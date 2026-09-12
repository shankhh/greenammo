// src/project-gallery.js

const WP_BASE = "https://cms.greenammo.in/wp-json/wp/v2";
const PROJECT_ENDPOINT = `${WP_BASE}/project`;
const MEDIA_ENDPOINT = `${WP_BASE}/media`;

document.addEventListener("DOMContentLoaded", () => {
  initGalleries();
  initDynamicProjectsFeed();
});

async function initGalleries() {
  const containers = document.querySelectorAll(".smart-gallery-container");

  for (const container of containers) {
    const slug = container.dataset.wpSlug;
    if (!slug) continue;

    const images = await fetchProjectImages(slug);
    if (images.length) {
      renderGallery(container, images);
    }
  }
}

/* ============================
   FETCH LOGIC
============================ */

async function parseProjectImages(project) {
  if (!project || !project.acf) return [];

  const imageIds = Object.values(project.acf).filter(
    (val) => typeof val === "number" && val !== 0,
  );

  const images = [];

  for (const id of imageIds) {
    try {
      const mediaRes = await fetch(`${MEDIA_ENDPOINT}/${id}?_fields=source_url,alt_text,caption,title`);
      if (!mediaRes.ok) continue;
      const media = await mediaRes.json();

      const captionText = media.caption?.rendered ? media.caption.rendered.replace(/<[^>]*>?/gm, '').trim() : '';

      images.push({
        url: media.source_url,
        alt: media.alt_text || media.title?.rendered || "",
        caption: captionText || media.alt_text || "",
      });
    } catch (e) {
      console.warn("Failed to fetch media ID:", id, e);
    }
  }

  return images;
}

async function fetchProjectImages(slug) {
  try {
    const projectRes = await fetch(`${PROJECT_ENDPOINT}?slug=${slug}`);
    const projectData = await projectRes.json();

    if (!projectData.length) return [];

    return await parseProjectImages(projectData[0]);
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return [];
  }
}

function getCurrentRegion() {
  const container = document.querySelector(".timeline-container");
  if (container && container.dataset.wpRegion) {
    return container.dataset.wpRegion.toLowerCase().trim();
  }

  const path = window.location.pathname.toLowerCase();
  if (path.includes("meghalaya")) return "meghalaya";
  if (path.includes("west-bengal") || path.includes("westbengal")) return "west-bengal";
  if (path.includes("assam")) return "assam";
  if (path.includes("goa")) return "goa";
  if (path.includes("himachal")) return "himachal-pradesh";
  if (path.includes("arunachal")) return "arunachal-pradesh";
  if (path.includes("nepal")) return "nepal";
  if (path.includes("odisha")) return "odisha";
  if (path.includes("tamil-nadu") || path.includes("tamilnadu")) return "tamil-nadu";
  return null;
}

function isPostForRegion(project, targetRegion) {
  if (!targetRegion) return false;
  const cleanTarget = targetRegion.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Check ACF field 'region' or 'project_region'
  if (project.acf) {
    let rawRegion = project.acf.region || project.acf.project_region || '';
    if (typeof rawRegion === 'object' && rawRegion !== null) {
      rawRegion = rawRegion.value || rawRegion.label || JSON.stringify(rawRegion);
    }
    const acfRegion = String(rawRegion || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (acfRegion && acfRegion !== 'false' && acfRegion !== 'true' && (acfRegion.includes(cleanTarget) || cleanTarget.includes(acfRegion))) {
      return true;
    }
  }

  // 2. Check Post Slug
  const slug = (project.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (slug && slug.includes(cleanTarget)) return true;

  // 3. Check Post Title
  const title = (project.title?.rendered || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (title && title.includes(cleanTarget)) return true;

  return false;
}

async function initDynamicProjectsFeed() {
  const outerContainer = document.querySelector(".timeline-container");
  if (!outerContainer) return;

  const feedContainer = outerContainer.querySelector(".relative.flex") || outerContainer;

  const currentRegion = getCurrentRegion();
  if (!currentRegion) return;

  const existingSlugs = new Set();
  document.querySelectorAll("[data-wp-slug]").forEach((el) => {
    if (el.dataset.wpSlug) existingSlugs.add(el.dataset.wpSlug.toLowerCase().trim());
  });

  try {
    const res = await fetch(`${PROJECT_ENDPOINT}?per_page=100`);
    if (!res.ok) return;
    const projects = await res.json();
    if (!Array.isArray(projects)) return;

    // Filter for new projects published in WP that match current region and aren't hardcoded yet
    const newProjects = projects.filter((p) => {
      if (!p.slug) return false;
      const isAlreadyOnPage = existingSlugs.has(p.slug.toLowerCase().trim());
      if (isAlreadyOnPage) return false;
      return isPostForRegion(p, currentRegion);
    });

    for (const project of newProjects) {
      const images = await parseProjectImages(project);
      const title = project.title?.rendered || "Project Milestone";
      const content = project.content?.rendered || "";

      if (!content && !images.length) continue;

      const article = document.createElement("article");
      article.className = "timeline-row relative pl-6 md:pl-0 mt-12 md:mt-0";
      article.innerHTML = `
        <div class="timeline-dot absolute top-8 w-4 h-4 bg-brand-accent rounded-full border-4 border-white z-10"></div>
        <div class="timeline-content w-full md:w-1/2 flex flex-col">
            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 w-full">
                <h3 class="text-xl font-bold text-brand-dark font-heading">${title}</h3>
                <p class="text-xs text-brand-accent font-semibold uppercase tracking-wider mb-2">WordPress Live Sync</p>
                <div class="md:hidden mt-2 mb-6 smart-gallery-container-dynamic"></div>
                <div class="space-y-4 pt-4 border-t border-gray-100 text-brand-dark/80 text-sm">
                    ${content}
                </div>
            </div>
        </div>
        <div class="timeline-image-desktop hidden md:block w-1/2 md:pl-10">
            <div class="smart-gallery-container-dynamic"></div>
        </div>
      `;

      feedContainer.appendChild(article);

      if (images.length) {
        const desktopGal = article.querySelector(".timeline-image-desktop .smart-gallery-container-dynamic");
        const mobileGal = article.querySelector(".timeline-content .smart-gallery-container-dynamic");
        if (desktopGal) renderGallery(desktopGal, images);
        if (mobileGal) renderGallery(mobileGal, images);
      }
    }
  } catch (err) {
    console.error("Error loading dynamic projects feed:", err);
  }
}

/* ============================
   RENDER ENGINE
============================ */

function renderGallery(container, images) {
  let wrapper = container.querySelector(".grid-wrapper");

  if (!wrapper) {
    wrapper = document.createElement("div");
    // wrapper.className =
    //   "relative rounded-2xl shadow-xl w-full border border-gray-200 bg-white p-4 space-y-4 grid-wrapper";
    wrapper.className = "rounded-2xl w-full space-y-4";

    container.appendChild(wrapper);
  } else {
    wrapper.innerHTML = "";
  }

  let i = 0;

  while (i < images.length) {
    const remaining = images.length - i;

    if (remaining >= 4) {
      wrapper.appendChild(layoutFour(images.slice(i, i + 4)));
      i += 4;
    } else if (remaining === 3) {
      wrapper.appendChild(layoutThree(images.slice(i, i + 3)));
      i += 3;
    } else if (remaining === 2) {
      wrapper.appendChild(layoutTwo(images.slice(i, i + 2)));
      i += 2;
    } else {
      wrapper.appendChild(layoutOne(images[i]));
      i += 1;
    }
  }
}

/* ============================
   LAYOUT MODULES
============================ */
function layoutOne(img) {
  // Added 'grid-rows-1' and 'h-full' to lock the height to the container
  const div = createBlock("grid grid-cols-1 grid-rows-1 gap-4 h-full");
  div.innerHTML = imageHTML(img);
  return div;
}

function layoutTwo(imgs) {
  // Changed grid-cols-1 to grid-cols-2
  const div = createBlock("grid grid-cols-2 gap-4 h-full");
  div.innerHTML = `
        ${imageHTML(imgs[0])}
        ${imageHTML(imgs[1])}
    `;
  return div;
}

// function layoutThree(imgs) {
//   const div = createBlock("grid grid-cols-2 gap-4");
//   div.innerHTML = `
//         ${imageHTML(imgs[0])}
//         ${imageHTML(imgs[1])}
//         <div class="col-span-2">
//             ${imageHTML(imgs[2])}
//         </div>
//     `;
//   return div;
// }

function layoutThree(imgs) {
  const div = createBlock("grid grid-cols-2 gap-4");

  // Wrap images in aspect ratio containers to lock their height.
  // Top row = 1:1 squares, Bottom row = 2:1 landscape rectangle.
  div.innerHTML = `
        <div class="aspect-square w-full overflow-hidden rounded-lg">
            ${imageHTML(imgs[0])}
        </div>
        <div class="aspect-square w-full overflow-hidden rounded-lg">
            ${imageHTML(imgs[1])}
        </div>
        <div class="col-span-2 aspect-[2/1] w-full overflow-hidden rounded-lg">
            ${imageHTML(imgs[2])}
        </div>
    `;

  return div;
}

function layoutFour(imgs) {
  const div = createBlock("grid grid-cols-2 gap-4");
  imgs.forEach((img) => {
    div.innerHTML += imageHTML(img);
  });
  return div;
}

/* ============================
   UTILITIES
============================ */

function createBlock(classes) {
  const div = document.createElement("div");
  div.className = `${classes} mb-4`;
  return div;
}

// function imageHTML(img) {
//   return `
//         <div class="rounded-xl overflow-hidden">
//             <img
//                 src="${img.url}"
//                 alt="${img.alt}"
//                 class="w-full aspect-[4/5] object-cover transition duration-500 hover:scale-105"
//                 loading="lazy"
//             >
//         </div>
//     `;
// }

function imageHTML(img) {
  const hasCaption = img.caption && img.caption.length > 0;
  return `
        <div class="rounded-xl overflow-hidden cursor-zoom-in relative group/img">
            <img 
                src="${img.url}" 
                alt="${img.alt}" 
                data-full="${img.url}"
                data-caption="${img.caption || ''}"
                class="w-full aspect-[4/5] object-cover transition duration-500 hover:scale-105"
                loading="lazy"
            >
            ${hasCaption ? `
              <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs opacity-90 group-hover/img:opacity-100 transition-opacity">
                <p class="line-clamp-2 font-medium">${img.caption}</p>
              </div>
            ` : ''}
        </div>
    `;
}

/* ============================
   MODAL LOGIC
============================ */

document.addEventListener("click", function (e) {
  const img = e.target.closest("img[data-full]");
  if (!img) return;

  openModal(img.dataset.full, img.alt, img.dataset.caption);
});

function openModal(src, alt, caption) {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");

  if (modalImg) {
    modalImg.src = src;
    modalImg.alt = alt || "";
  }

  if (modalCaption) {
    modalCaption.textContent = caption || "";
    modalCaption.classList.toggle("hidden", !caption);
  }

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  document.body.classList.add("overflow-hidden");
}

function closeModal() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");

  modal.classList.add("hidden");
  modal.classList.remove("flex");

  modalImg.src = "";
  document.body.classList.remove("overflow-hidden");
}

// Close button
document.addEventListener("click", function (e) {
  if (e.target.id === "modal-close") {
    closeModal();
  }

  // click outside image
  if (e.target.id === "image-modal") {
    closeModal();
  }
});

// ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});
