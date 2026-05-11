/**
 * GreenAmmo Gallery — Tag-Based Category Engine
 * 
 * HOW IT WORKS:
 * 1. Fetches ALL media from WP REST API (paginated).
 * 2. Each media item's title is matched against TAG_GROUPS keywords.
 * 3. Items are bucketed into categories; pills are rendered for filtering.
 * 4. Carousel lightbox for full-size viewing.
 * 
 * FOR THE WORDPRESS TEAM:
 * - Name/title your media uploads with a keyword from the categories below.
 *   e.g. "Training session Jan 2026", "Construction site Shillong", "Members group photo"
 * - The gallery auto-discovers and groups them.
 */

(function () {
    'use strict';

    // ── Tag group definitions (label → title keywords) ──
    const TAG_GROUPS = [
        { key: 'all', label: '🏠 All', icon: '', keywords: null },
        { key: 'training', label: '🎓 Training', icon: '🎓', keywords: ['training', 'workshop', 'session', 'seminar'] },
        { key: 'fieldwork', label: '🌿 Field Work', icon: '🌿', keywords: ['field', 'fieldwork', 'survey', 'site visit', 'cleanup', 'drive'] },
        { key: 'events', label: '🎉 Events', icon: '🎉', keywords: ['event', 'ceremony', 'inauguration', 'celebration', 'fest'] },
        { key: 'construction', label: '🏗️ Construction', icon: '🏗️', keywords: ['construction', 'building', 'structure', 'civil', 'infrastructure'] },
        { key: 'education', label: '📚 Education', icon: '📚', keywords: ['education', 'school', 'student', 'learning', 'class'] },
        { key: 'members', label: '👥 Members', icon: '👥', keywords: ['member', 'team', 'group photo', 'staff', 'volunteer'] },
        { key: 'posters', label: '📄 Posters', icon: '📄', keywords: ['poster', 'flyer', 'banner', 'design'] },
        { key: 'logo', label: '🏷️ Logo', icon: '🏷️', keywords: ['logo', 'brand', 'emblem'] },
    ];

    // ── State ──
    const API_BASE = 'https://cms.greenammo.in/wp-json/wp/v2/media';
    let currentMediaType = 'image';
    let currentCategory = 'all';
    let currentPage = 1;
    const perPage = 20;
    let isLoading = false;
    let hasMore = true;

    // allMedia: flat array of all fetched WP items for current mediaType
    let allMedia = [];
    // categorized: { key: [items] }
    let categorized = {};
    // filteredItems: items currently visible (for carousel)
    let filteredItems = [];
    let carouselIndex = 0;

    // ── DOM refs ──
    const grid = () => document.getElementById('media-grid');
    const skeleton = () => document.getElementById('gallery-skeleton');
    const pillsWrap = () => document.getElementById('category-pills');
    const catHeader = () => document.getElementById('category-header');
    const catTitle = () => document.getElementById('category-title');
    const catCount = () => document.getElementById('category-count');
    const sentinel = () => document.getElementById('infinite-scroll-sentinel');
    const loadingMsg = () => document.getElementById('loading-message');
    const endMsg = () => document.getElementById('end-message');
    const modal = () => document.getElementById('carousel-modal');
    const carouselContent = () => document.getElementById('carousel-content');
    const carouselCaption = () => document.getElementById('carousel-caption');
    const carouselPrev = () => document.getElementById('carousel-prev');
    const carouselNext = () => document.getElementById('carousel-next');

    // ── Lazy load observer ──
    const lazyObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const img = e.target;
                if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '0px 0px 300px 0px' });

    // ── Infinite scroll observer ──
    const scrollObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            fetchPage();
        }
    }, { threshold: 0.5 });

    // ── Categorize a single WP media item ──
    function classifyItem(item) {
        const title = (item.title?.rendered || '').toLowerCase();
        const alt = (item.alt_text || '').toLowerCase();
        const desc = (item.description?.rendered || '').toLowerCase();
        const haystack = title + ' ' + alt + ' ' + desc;

        const matched = [];
        TAG_GROUPS.forEach(g => {
            if (!g.keywords) return; // skip "all"
            for (const kw of g.keywords) {
                if (haystack.includes(kw)) { matched.push(g.key); break; }
            }
        });
        return matched.length > 0 ? matched : ['uncategorized'];
    }

    // ── Rebuild category buckets from allMedia ──
    function rebuildCategories() {
        categorized = {};
        TAG_GROUPS.forEach(g => { categorized[g.key] = []; });
        categorized['uncategorized'] = [];

        allMedia.forEach(item => {
            const cats = classifyItem(item);
            cats.forEach(c => {
                if (!categorized[c]) categorized[c] = [];
                categorized[c].push(item);
            });
            categorized['all'].push(item);
        });
    }

    // ── Render category pills ──
    function renderPills() {
        const wrap = pillsWrap();
        if (!wrap) return;
        wrap.innerHTML = '';

        // Determine which groups have items
        const visibleGroups = TAG_GROUPS.filter(g => {
            if (g.key === 'all') return true;
            return (categorized[g.key] || []).length > 0;
        });

        // Add uncategorized if it has items
        const uncatCount = (categorized['uncategorized'] || []).length;

        visibleGroups.forEach(g => {
            const count = (categorized[g.key] || []).length;
            const btn = document.createElement('button');
            btn.className = 'category-pill' + (g.key === currentCategory ? ' active' : '');
            btn.textContent = g.label + (g.key !== 'all' ? ` (${count})` : '');
            btn.onclick = () => selectCategory(g.key);
            wrap.appendChild(btn);
        });

        if (uncatCount > 0) {
            const btn = document.createElement('button');
            btn.className = 'category-pill' + (currentCategory === 'uncategorized' ? ' active' : '');
            btn.textContent = `📁 Other (${uncatCount})`;
            btn.onclick = () => selectCategory('uncategorized');
            wrap.appendChild(btn);
        }
    }

    // ── Select a category and re-render grid ──
    function selectCategory(key) {
        currentCategory = key;
        renderPills();
        renderGrid();
    }

    // ── Render the media grid for current category ──
    function renderGrid() {
        const g = grid();
        if (!g) return;
        g.innerHTML = '';

        filteredItems = categorized[currentCategory] || [];

        const header = catHeader();
        const title = catTitle();
        const count = catCount();

        if (currentCategory !== 'all' && filteredItems.length > 0) {
            const group = TAG_GROUPS.find(t => t.key === currentCategory);
            const label = group ? group.label : '📁 Other';
            if (header) header.classList.remove('hidden');
            if (title) title.textContent = label;
            if (count) count.textContent = filteredItems.length + ' items';
        } else {
            if (header) header.classList.add('hidden');
        }

        if (filteredItems.length === 0) {
            g.innerHTML = '<p class="col-span-full text-center text-group-text-medium py-12">No media found in this category yet.</p>';
            return;
        }

        filteredItems.forEach((item, idx) => {
            const mime = item.mime_type || '';
            const isImage = mime.startsWith('image');
            const isVideo = mime.startsWith('video');
            if (!isImage && !isVideo) return;

            const thumbUrl = item.media_details?.sizes?.medium_large?.source_url
                || item.media_details?.sizes?.medium?.source_url
                || item.source_url;
            if (!thumbUrl) return;

            const caption = (item.caption?.rendered || '').replace(/<[^>]*>/g, '') || (item.title?.rendered || '');

            const container = document.createElement('div');
            container.className = 'aspect-square overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition duration-300 relative group rounded-lg border border-gray-100';
            container.onclick = () => openCarousel(idx);

            if (isImage) {
                const img = document.createElement('img');
                img.dataset.src = thumbUrl;
                img.alt = caption;
                img.className = 'w-full h-full object-cover group-hover:scale-105 transition duration-300';
                img.loading = 'lazy';
                lazyObs.observe(img);
                container.appendChild(img);
            } else {
                const vid = document.createElement('video');
                vid.src = thumbUrl;
                vid.className = 'w-full h-full object-cover';
                vid.muted = true; vid.loop = true; vid.playsInline = true; vid.preload = 'metadata';
                container.addEventListener('mouseenter', () => vid.play().catch(() => { }));
                container.addEventListener('mouseleave', () => vid.pause());
                const overlay = document.createElement('div');
                overlay.className = 'absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition';
                overlay.innerHTML = '<svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>';
                container.appendChild(vid);
                container.appendChild(overlay);
            }

            // Category badge overlay
            if (currentCategory === 'all') {
                const cats = classifyItem(item);
                const firstCat = cats[0];
                if (firstCat && firstCat !== 'uncategorized') {
                    const grp = TAG_GROUPS.find(t => t.key === firstCat);
                    if (grp) {
                        const badge = document.createElement('span');
                        badge.className = 'absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm';
                        badge.textContent = grp.icon + ' ' + grp.label.replace(/^[^\s]+\s/, '');
                        container.appendChild(badge);
                    }
                }
            }

            g.appendChild(container);
        });
    }

    // ── Fetch a page of media from WP ──
    async function fetchPage() {
        if (isLoading || !hasMore) return;
        isLoading = true;

        const skel = skeleton();
        const lm = loadingMsg();
        const em = endMsg();

        if (allMedia.length === 0 && skel) skel.classList.remove('hidden');
        if (lm) lm.classList.remove('hidden');
        if (em) em.classList.add('hidden');

        try {
            const url = `${API_BASE}?media_type=${currentMediaType}&per_page=${perPage}&page=${currentPage}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);

            const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');
            const data = await res.json();

            if (data.length === 0 || currentPage >= totalPages) {
                hasMore = false;
                if (em) em.classList.remove('hidden');
            }

            allMedia = allMedia.concat(data);
            currentPage++;

            rebuildCategories();
            renderPills();
            renderGrid();

        } catch (err) {
            console.error('Gallery fetch error:', err);
            hasMore = false;
            const em2 = endMsg();
            if (em2) { em2.textContent = 'Failed to load content.'; em2.classList.remove('hidden'); }
        } finally {
            isLoading = false;
            if (skel) skel.classList.add('hidden');
            if (lm) lm.classList.add('hidden');
        }
    }

    // ── Tab switch (Photos / Videos) ──
    window.switchTab = function (mediaType) {
        if (mediaType === currentMediaType) return;
        currentMediaType = mediaType;
        currentPage = 1;
        hasMore = true;
        allMedia = [];
        categorized = {};
        filteredItems = [];
        currentCategory = 'all';

        // Update tab button styles
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById('tab-' + mediaType);
        if (activeBtn) activeBtn.classList.add('active');

        const g = grid(); if (g) g.innerHTML = '';
        const em = endMsg(); if (em) em.classList.add('hidden');

        fetchPage();
    };

    // ── Carousel & Zoom State ──
    let currentZoom = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    function applyTransform() {
        const el = carouselContent()?.querySelector('img, video');
        if (!el) return;
        el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
        
        const cc = carouselContent();
        if (cc) cc.style.cursor = currentZoom > 1 ? 'grab' : 'auto';
    }

    window.zoomMedia = function(step, isDelta = false) {
        if (isDelta) {
            currentZoom += step;
        } else {
            currentZoom += (step * 0.5);
        }
        
        if (currentZoom < 0.5) currentZoom = 0.5;
        if (currentZoom > 5) currentZoom = 5;
        
        // If zooming out to 1 or less, reset translation
        if (currentZoom <= 1) {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
        }
        
        applyTransform();
    };

    window.resetZoom = function() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
    };

    function openCarousel(idx) {
        carouselIndex = idx;
        updateCarousel();
        const m = modal();
        if (m) {
            m.classList.remove('hidden', 'modal-hidden');
            m.classList.add('flex', 'modal-visible');
            document.body.style.overflow = 'hidden';
        }
    }

    function updateCarousel() {
        if (!filteredItems.length || carouselIndex < 0 || carouselIndex >= filteredItems.length) return;
        const item = filteredItems[carouselIndex];
        const mime = item.mime_type || '';
        const isImage = mime.startsWith('image');
        const mediaUrl = item.media_details?.sizes?.large?.source_url
            || item.media_details?.sizes?.full?.source_url
            || item.source_url;
        if (!mediaUrl) return;
        const caption = (item.caption?.rendered || '').replace(/<[^>]*>/g, '') || (item.title?.rendered || '');

        resetZoom();

        const cc = carouselContent(); if (!cc) return;
        cc.innerHTML = '';

        let el;
        if (isImage) {
            el = document.createElement('img');
            // Try to use original source URL for full un-cropped resolution
            el.src = item.source_url || mediaUrl;
            el.alt = caption;
            el.className = 'transition-transform duration-200 ease-out origin-center select-none max-h-full max-w-full object-contain';
            el.draggable = false;
        } else {
            el = document.createElement('video');
            el.src = mediaUrl; el.controls = true; el.autoplay = true; el.playsInline = true;
            el.className = 'transition-transform duration-200 ease-out origin-center select-none max-h-full max-w-full object-contain';
        }
        cc.appendChild(el);

        const cap = carouselCaption(); if (cap) cap.textContent = caption;
        const prev = carouselPrev(); if (prev) prev.style.visibility = carouselIndex === 0 ? 'hidden' : 'visible';
        const next = carouselNext(); if (next) next.style.visibility = carouselIndex === filteredItems.length - 1 ? 'hidden' : 'visible';
        
        const zoomControls = document.getElementById('zoom-controls');
        if (zoomControls) zoomControls.style.display = isImage ? 'flex' : 'none';
    }

    window.closeCarousel = function () {
        const m = modal();
        if (!m) return;
        const vid = m.querySelector('video');
        if (vid) { vid.pause(); vid.src = ''; }
        m.classList.remove('flex', 'modal-visible');
        m.classList.add('modal-hidden');
        setTimeout(() => m.classList.add('hidden'), 300);
        document.body.style.overflow = '';
        resetZoom();
    };

    window.changeMedia = function (step) {
        const ni = carouselIndex + step;
        if (ni >= 0 && ni < filteredItems.length) { carouselIndex = ni; updateCarousel(); }
    };

    // ── Close carousel on backdrop click ──
    document.addEventListener('click', (e) => {
        const m = modal();
        if (e.target === m) window.closeCarousel();
    });

    // ── Init ──
    document.addEventListener('DOMContentLoaded', () => {
        const s = sentinel();
        if (s) scrollObs.observe(s);
        fetchPage();

        // Explore modal (shared across pages)
        const exploreModal = document.getElementById('exploreModal');
        const exploreBtns = ['explore-btn-desktop', 'explore-btn-mobile', 'explore-btn-footer'].map(id => document.getElementById(id));
        const modalCloseBtn = document.getElementById('modal-close-btn');

        function openExplore() {
            if (!exploreModal) return;
            exploreModal.classList.remove('hidden', 'modal-hidden');
            exploreModal.classList.add('flex', 'modal-visible');
        }
        function closeExplore() {
            if (!exploreModal) return;
            exploreModal.classList.remove('flex', 'modal-visible');
            exploreModal.classList.add('modal-hidden');
            setTimeout(() => exploreModal.classList.add('hidden'), 300);
        }
        exploreBtns.forEach(b => { if (b) b.addEventListener('click', openExplore); });
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeExplore);
        if (exploreModal) exploreModal.addEventListener('click', e => { if (e.target === exploreModal) closeExplore(); });

        // Lenis smooth scroll
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis();
            (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
        }

        // Zoom/Pan events
        const cc = carouselContent();
        if (cc) {
            cc.addEventListener('mousedown', (e) => {
                if (currentZoom <= 1) return;
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                cc.style.cursor = 'grabbing';
            });
            window.addEventListener('mouseup', () => {
                isDragging = false;
                if (currentZoom > 1) cc.style.cursor = 'grab';
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                
                // For a polished feel, remove transition during drag, add it back after
                const el = cc.querySelector('img, video');
                if (el) {
                    el.style.transition = 'none';
                    el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
                }
            });
            cc.addEventListener('wheel', (e) => {
                const el = cc.querySelector('img');
                if (!el) return;
                e.preventDefault();
                // Add transition back for wheel zoom
                el.style.transition = 'transform 0.2s ease-out';
                const delta = e.deltaY < 0 ? 0.15 : -0.15;
                window.zoomMedia(delta, true);
            });
            
            // Add transition back when not dragging
            window.addEventListener('mouseup', () => {
                const el = cc.querySelector('img, video');
                if (el) el.style.transition = 'transform 0.2s ease-out';
            });
        }
    });

})();
