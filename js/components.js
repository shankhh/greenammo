// components.js - Centralized Nav, Footer, and Explore Modal

const state = {
    theme: 'group',
    isMobileMenuOpen: false
};

const paths = {
    group: {
        logo: '/assets/greenammo-BqfXjaiB.jpeg',
        home: '/index.html',
        about: '/aboutus.html',
        gallery: '/gallery.html',
        testimonials: '/testimonials.html',
        blog: '/blog.html',
        join: '/joinus.html',
        donate: '/donate.html'
    },
    trust: {
        logo: '/assets/trust-q95g3UYq.png',
        home: '/trust/index.html',
        campaigns: '/trust/campaign.html',
        projects: '/trust/projects.html',
        reports: '/trust/reports.html',
        tutorials: '/trust/tutorials.html',
        faq: '/trust/faq.html',
        donate: '/trust/donate.html'
    },
    solutions: {
        logo: '/assets/greenammo-BqfXjaiB.jpeg',
        home: '/solutions/index.html',
        finance: '/solutions/finance.html',
        education: '/solutions/education.html',
        eventsupply: '/solutions/eventsupply.html',
        accommodation: '/solutions/accommodation.html',
        contact: '/solutions/contact.html'
    }
};

function detectTheme() {
    const path = window.location.pathname;
    if (path.includes('/trust/')) return 'trust';
    if (path.includes('/solutions/')) return 'solutions';
    return 'group';
}

function normalizePath(p) {
    if (p === '/' || p === '') return '/index.html';
    return p;
}

function getActiveClass(href, activeClasses) {
    const current = normalizePath(window.location.pathname);
    return current === href ? activeClasses : '';
}

// ================= NAV COMPONENTS =================

function getGroupNav() {
    return `
    <nav class="w-full bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto flex justify-between items-center px-6 py-4">
            <a href="${paths.group.home}" class="font-heading font-extrabold text-2xl text-group-primary-green tracking-tight flex items-center gap-2">
                <img src="${paths.group.logo}" alt="GreenAmmo Logo" class="h-10 w-auto rounded-full object-cover">
                <div style="display: flex; align-items: center; gap: 0;">
                    <span class="text-group-primary-green">GREEN</span>
                    <span class="text-[#3B82F6]">AMMO</span>
                </div>
            </a>
            <ul class="hidden md:flex space-x-6 text-group-text-medium font-medium items-center">
                <li><a href="${paths.group.about}" class="hover:text-group-primary-green transition ${getActiveClass(paths.group.about, 'text-group-primary-green')}">About Us</a></li>
                <li class="relative group">
                    <button class="hover:text-group-primary-green transition inline-flex items-center gap-1">
                        Media
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="absolute hidden group-hover:block bg-white rounded-xl shadow-lg p-4 top-5 -left-4 w-56 transition-all z-10 border border-gray-100">
                        <ul class="text-sm space-y-1">
                            <li><a href="${paths.group.gallery}" class="block py-1 px-3 text-group-text-medium hover:bg-group-pastel-green/30 rounded transition ${getActiveClass(paths.group.gallery, 'font-bold text-group-primary-green')}">Gallery</a></li>
                            <li><a href="${paths.group.testimonials}" class="block py-1 px-3 text-group-text-medium hover:bg-group-pastel-green/30 rounded transition ${getActiveClass(paths.group.testimonials, 'font-bold text-group-primary-green')}">Testimonials</a></li>
                        </ul>
                    </div>
                </li>
                <li><a href="${paths.group.blog}" class="hover:text-group-primary-green transition ${getActiveClass(paths.group.blog, 'text-group-primary-green')}">Blog</a></li>
                <li><a href="${paths.group.join}" class="hover:text-group-primary-green transition ${getActiveClass(paths.group.join, 'text-group-primary-green')}">Join Us</a></li>
            </ul>
            <button class="explore-btn hidden md:block cta-button bg-group-primary-green text-white hover:bg-opacity-90" style="padding: 0.5rem 1.5rem; border-radius: 9999px;">
                Explore
            </button>
            <button class="mobile-menu-toggle md:hidden flex items-center text-group-primary-green focus:outline-none">
                <svg class="menu-icon-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                <svg class="menu-icon-close w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <div class="mobile-menu hidden md:hidden flex-col space-y-2 bg-white shadow-inner px-6 py-4 border-t border-gray-100">
            <a href="${paths.group.about}" class="block py-2 text-group-text-medium hover:text-group-primary-green">About Us</a>
            <a href="${paths.group.gallery}" class="block py-2 text-group-text-medium hover:text-group-primary-green">Media</a>
            <a href="${paths.group.blog}" class="block py-2 text-group-text-medium hover:text-group-primary-green">Blog</a>
            <a href="${paths.group.join}" class="block py-2 text-group-text-medium hover:text-group-primary-green">Join Us</a>
            <button class="explore-btn mt-2 w-full cta-button bg-group-primary-green text-white hover:bg-opacity-90" style="padding: 0.5rem 1.5rem; border-radius: 9999px;">
                Explore
            </button>
        </div>
    </nav>
    `;
}

function getTrustNav() {
    return `
    <nav class="bg-white shadow-lg sticky top-0 z-20">
      <div class="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <a href="${paths.trust.home}" class="block">
            <img src="${paths.trust.logo}" alt="GreenAmmo Trust Logo" class="h-12 w-auto object-contain" title="GreenAmmo Trust" />
          </a>
        </div>
        <div class="hidden lg:flex items-center space-x-8">
          <a href="${paths.group.home}" class="text-gray-700 hover:text-brand-accent transition font-semibold">HOME</a>
          <a href="${paths.trust.campaigns}" class="text-gray-700 hover:text-brand-accent transition font-semibold ${getActiveClass(paths.trust.campaigns, 'text-brand-accent')}">Campaigns</a>
          <div class="relative group dropdown-container">
            <button class="dropdown-toggle text-gray-700 hover:text-brand-accent transition inline-flex items-center gap-1 font-semibold">
              Projects
              <svg class="dropdown-icon w-4 h-4 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="dropdown-menu absolute hidden group-hover:block bg-white rounded-xl shadow-xl p-3 top-10 right-0 w-48 transition-all z-30 border border-brand-light origin-top-right">
              <ul class="text-sm space-y-1">
                <li><a href="${paths.trust.projects}" class="block py-1 px-2 text-gray-700 hover:bg-brand-light/50 rounded transition">Projects</a></li>
                <li><a href="${paths.trust.reports}" class="block py-1 px-2 text-gray-700 hover:bg-brand-light/50 rounded transition">Reports</a></li>
              </ul>
            </div>
          </div>
          <a href="${paths.trust.tutorials}" class="text-gray-700 hover:text-brand-accent transition font-semibold ${getActiveClass(paths.trust.tutorials, 'text-brand-accent')}">Tutorials</a>
          <a href="${paths.group.join}" class="cta-button bg-brand-accent text-white hover:bg-[#1D371F]/90 shadow-brand-accent/50" style="padding: 0.5rem 1.5rem; border-radius: 9999px;">
            Let's Talk
          </a>
        </div>
        <button class="mobile-menu-toggle lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <svg class="menu-icon-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            <svg class="menu-icon-close w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="mobile-menu hidden lg:hidden px-4 pb-4 bg-white border-t border-gray-100 absolute w-full shadow-2xl z-10">
        <ul class="flex flex-col space-y-2 font-medium">
          <a href="${paths.group.home}" class="block py-2 text-gray-700 hover:bg-brand-light/50 hover:text-brand-accent rounded">Group Home</a>
          <a href="${paths.trust.campaigns}" class="block py-2 text-gray-700 hover:bg-brand-light/50 hover:text-brand-accent rounded">Campaigns</a>
          <div class="mobile-dropdown-container">
            <button class="mobile-dropdown-toggle w-full text-left py-2 text-gray-700 hover:bg-brand-light/50 hover:text-brand-accent rounded flex justify-between items-center">
              Projects
              <svg class="mobile-dropdown-icon w-4 h-4 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="mobile-dropdown-menu hidden ml-4 border-l border-brand-light pl-4 space-y-1">
              <a href="${paths.trust.projects}" class="block py-1 text-sm text-gray-600 hover:text-brand-accent">Projects</a>
              <a href="${paths.trust.reports}" class="block py-1 text-sm text-gray-600 hover:text-brand-accent">Reports</a>
            </div>
          </div>
          <a href="${paths.group.join}" class="mt-4 block text-center cta-button bg-brand-accent text-white hover:bg-[#1D371F]/90" style="padding: 0.5rem 1.5rem; border-radius: 9999px;">
            Join the Change
          </a>
        </ul>
      </div>
    </nav>
    `;
}

function getSolutionsNav() {
    return `
    <nav class="bg-white shadow-lg sticky top-0 z-20">
        <div class="container mx-auto px-4 md:px-8 py-3">
            <div class="flex justify-between items-center">
                <a href="${paths.solutions.home}" class="flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-brand-dark rounded-lg p-1 font-heading">
                    <img src="${paths.solutions.logo}" alt="GreenAmmo" class="h-10 w-auto rounded-full object-cover">
                    Solutions
                </a>
                <ul class="hidden md:flex items-center space-x-6">
                    <li><a href="${paths.group.home}" class="text-base font-semibold text-gray-700 hover:text-brand-accent transition">HOME</a></li>
                    <li><a href="${paths.group.about}" class="text-gray-700 hover:text-brand-accent transition">About Us</a></li>
                    <li class="relative group dropdown-container">
                        <button class="dropdown-toggle text-gray-700 hover:text-brand-accent transition inline-flex items-center gap-1">
                            Services
                            <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon w-4 h-4 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div class="dropdown-menu absolute hidden group-hover:block bg-white rounded-xl shadow-xl p-3 top-5 -left-4 w-48 transition-all z-10 border border-brand-light">
                            <ul class="text-sm space-y-1">
                                <li><a href="${paths.solutions.finance}" class="block py-1 px-2 text-gray-700 hover:bg-brand-light rounded transition">Finance Services</a></li>
                                <li><a href="${paths.solutions.education}" class="block py-1 px-2 text-gray-700 hover:bg-brand-light rounded transition">Education & Dev.</a></li>
                                <li><a href="${paths.solutions.eventsupply}" class="block py-1 px-2 text-gray-700 hover:bg-brand-light rounded transition">Event & Supply</a></li>
                                <li><a href="${paths.solutions.accommodation}" class="block py-1 px-2 text-gray-700 hover:bg-brand-light rounded transition">Accommodation</a></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <a href="${paths.solutions.contact}" class="cta-button bg-brand-accent text-white hover:bg-brand-primary shadow-brand-accent/50" style="padding: 0.5rem 1.5rem; border-radius: 9999px;">
                            Contact Us
                        </a>
                    </li>
                </ul>
                <button class="mobile-menu-toggle md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none">
                    <svg class="menu-icon-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    <svg class="menu-icon-close w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="mobile-menu hidden md:hidden mt-4 border-t border-gray-200 pt-4">
                <ul class="flex flex-col space-y-3">
                    <li><a href="${paths.group.home}" class="block py-2 px-3 text-base font-semibold text-gray-700 hover:bg-brand-light rounded">HOME</a></li>
                    <li><a href="${paths.group.about}" class="block py-2 px-3 text-gray-700 hover:bg-brand-light rounded">About Us</a></li>
                    <li><a href="${paths.solutions.finance}" class="block py-2 px-3 text-gray-700 hover:bg-brand-light rounded">Finance Services</a></li>
                    <li><a href="${paths.solutions.education}" class="block py-2 px-3 text-gray-700 hover:bg-brand-light rounded">Education & Dev.</a></li>
                    <li><a href="${paths.solutions.eventsupply}" class="block py-2 px-3 text-gray-700 hover:bg-brand-light rounded">Event & Supply</a></li>
                    <li><a href="${paths.solutions.accommodation}" class="block py-2 px-3 text-gray-700 hover:bg-brand-light rounded">Accommodation</a></li>
                    <li>
                        <a href="${paths.solutions.contact}" class="block text-center mt-2 cta-button bg-brand-accent text-white hover:bg-brand-primary w-full" style="padding: 0.5rem 1.5rem; border-radius: 9999px;">
                            Contact Us
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;
}

// ================= FOOTER COMPONENTS =================

function getFooterCols() {
    return `
        <div class="space-y-3">
            <h4 class="font-semibold text-white mb-3 font-heading">GREENAMMO</h4>
            <ul class="text-sm space-y-2 opacity-80">
                <li><a href="${paths.group.about}" class="hover:text-white transition">About Us</a></li>
                <li><a href="${paths.group.gallery}" class="hover:text-white transition">Media (Gallery)</a></li>
                <li><a href="/certifications.html" class="hover:text-white transition">Certificates</a></li>
                <li><a href="/alliances.html" class="hover:text-white transition">Alliances</a></li>
            </ul>
        </div>
        <div class="space-y-3">
            <h4 class="font-semibold text-white mb-3 font-heading">Solutions</h4>
            <ul class="text-sm space-y-2 opacity-80">
                <li><a href="${paths.solutions.finance}" class="hover:text-white transition">Finance</a></li>
                <li><a href="${paths.solutions.education}" class="hover:text-white transition">Education & Development</a></li>
                <li><a href="${paths.solutions.eventsupply}" class="hover:text-white transition">Event & Supply</a></li>
                <li><a href="${paths.solutions.accommodation}" class="hover:text-white transition">Accommodations</a></li>
            </ul>
        </div>
        <div class="space-y-3">
            <h4 class="font-semibold text-white mb-3 font-heading">Trust</h4>
            <ul class="text-sm space-y-2 opacity-80">
                <li><a href="${paths.trust.projects}" class="hover:text-white transition">Projects</a></li>
                <li><a href="${paths.trust.campaigns}" class="hover:text-white transition">Campaigns</a></li>
                <li><a href="${paths.trust.reports}" class="hover:text-white transition">Reports & Research</a></li>
                <li><a href="${paths.trust.donate}" class="hover:text-white transition">Donate Now</a></li>
            </ul>
        </div>
    `;
}

function getGroupFooter() {
    return `
    <footer class="bg-group-text-dark text-white pt-12">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
                <div class="md:col-span-2 space-y-4">
                    <h3 class="text-3xl font-bold text-group-pastel-green font-heading">GREENAMMO Group</h3>
                    <p class="text-sm text-gray-300 max-w-sm">Empowering sustainable living and waste management through community action, research, and project initiation.</p>
                </div>
                <div class="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    ${getFooterCols()}
                    <div class="space-y-3">
                        <h4 class="font-semibold text-white mb-3 font-heading">Take Action</h4>
                        <div class="space-y-2">
                            <a href="${paths.group.join}" class="block text-center py-2 px-4 rounded-full bg-group-primary-green text-white hover:bg-opacity-80 transition text-sm font-semibold shadow-md">Join Us</a>
                            <button class="explore-btn block w-full text-center py-2 px-4 rounded-full border-2 border-group-pastel-green text-group-pastel-green hover:bg-group-pastel-green hover:text-group-text-dark transition text-sm font-semibold">Explore</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-center py-6 text-sm text-gray-400">
                <p>&copy; 2025 GreenAmmo Group. All rights reserved.</p>
                <div class="flex gap-4 mt-4 sm:mt-0">
                    <a href="https://www.facebook.com/people/GreenAmmo/100071774210115/" class="hover:text-group-pastel-blue transition">Facebook</a>
                    <a href="https://www.instagram.com/green_ammo/" class="hover:text-group-pastel-blue transition">Instagram</a>
                    <a href="https://www.youtube.com/@greenammo7472" class="hover:text-group-pastel-blue transition">YouTube</a>
                </div>
            </div>
        </div>
    </footer>
    `;
}

function getTrustFooter() {
    return `
    <footer class="bg-[#1D371F] text-white pt-12">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-8 pb-8 border-b border-[#7C966A]">
                <div class="md:col-span-2 space-y-4">
                    <h3 class="text-3xl font-bold text-[#D2E3AB]">GREENAMMO Group</h3>
                    <p class="text-sm text-[#D2E3AB]/70 max-w-sm">Empowering sustainable living and waste management through community action, research, and project initiation.</p>
                </div>
                <div class="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-6 text-[#D2E3AB]">
                    ${getFooterCols()}
                    <div class="space-y-3" style="display: none;">
                        <h4 class="font-semibold text-white mb-3">Support</h4>
                        <ul class="text-sm space-y-2 opacity-80">
                            <li><a href="${paths.solutions.contact}" class="hover:text-white transition">Contact Us</a></li>
                            <li><a href="${paths.group.join}" class="hover:text-white transition">Join Us</a></li>
                            <li><a href="${paths.trust.faq}" class="hover:text-white transition">FAQ</a></li>
                            <li><a href="/privacy.html" class="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="container mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-[#D2E3AB]/80">
                <p>&copy; 2025 GreenAmmo Group. All rights reserved.</p>
                <div class="flex space-x-4 mt-2 sm:mt-0">
                    <a href="https://www.facebook.com/people/GreenAmmo/100071774210115/" class="hover:text-white transition">Facebook</a>
                    <a href="https://www.instagram.com/green_ammo/" class="hover:text-white transition">Instagram</a>
                    <a href="https://www.youtube.com/@greenammo7472" class="hover:text-white transition">YouTube</a>
                </div>
            </div>
        </div>
    </footer>
    `;
}

function getSolutionsFooter() {
    return `
    <footer class="bg-[#2A6496] text-white pt-12">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-8 pb-8 border-b border-[#56A0D3]">
                <div class="md:col-span-2 space-y-4">
                    <h3 class="text-3xl font-bold text-[#BFDBFE]">GREENAMMO Group</h3>
                    <p class="text-sm text-[#BFDBFE]/70 max-w-sm">Empowering sustainable living and waste management through community action, research, and project initiation.</p>
                </div>
                <div class="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-6 text-[#BFDBFE]">
                    ${getFooterCols()}
                    <div class="space-y-3" style="display: none;">
                        <h4 class="font-semibold text-white mb-3">Support</h4>
                        <ul class="text-sm space-y-2 opacity-80">
                            <li><a href="${paths.solutions.contact}" class="hover:text-white transition">Contact Us</a></li>
                            <li><a href="${paths.group.join}" class="hover:text-white transition">Join Us</a></li>
                            <li><a href="/privacy.html" class="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="container mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-[#BFDBFE]/80">
                <p>&copy; 2025 GreenAmmo Group. All rights reserved.</p>
                <div class="flex space-x-4 mt-2 sm:mt-0">
                    <a href="https://www.facebook.com/people/GreenAmmo/100071774210115/" class="hover:text-white transition">Facebook</a>
                    <a href="https://www.instagram.com/green_ammo/" class="hover:text-white transition">Instagram</a>
                    <a href="https://www.youtube.com/@greenammo7472" class="hover:text-white transition">YouTube</a>
                </div>
            </div>
        </div>
    </footer>
    `;
}

// ================= EXPLORE MODAL =================

function getExploreModal() {
    return `
    <div id="exploreModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm hidden justify-center items-center z-50 p-4 opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-auto overflow-hidden scale-95 transition-transform duration-300" id="modal-content">
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h3 class="text-xl font-semibold text-group-text-dark font-heading">Explore GreenAmmo</h3>
                <button id="modal-close-btn" class="text-gray-400 hover:text-group-primary-green focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="grid md:grid-cols-2 gap-6 p-8">
                <!-- Solutions -->
                <div class="bg-[#9FD8E4]/20 rounded-2xl p-6 flex flex-col justify-between shadow hover:shadow-md transition cursor-pointer hover:bg-[#9FD8E4]/30 border border-[#9FD8E4]/40" onclick="window.location.href='${paths.solutions.home}'">
                    <div>
                        <div class="w-full h-40 bg-white rounded-xl flex items-center justify-center mb-4 border border-[#9FD8E4]/20">
                            <svg class="w-16 h-16 text-[#9FD8E4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h4 class="text-2xl font-semibold text-[#2A6496] mb-2 font-heading">GreenAmmo Solutions</h4>
                        <p class="text-gray-500 text-sm leading-relaxed">Professional, scalable services spanning Finance, Education, Events, and Accommodation.</p>
                    </div>
                    <div class="mt-6">
                        <button class="cta-button-secondary border-[#9FD8E4] text-[#2A6496] hover:bg-[#9FD8E4]/20 w-full sm:w-auto" style="padding: 0.75rem 2.5rem; border-radius: 9999px; border-width: 2px;">Visit Solutions</button>
                    </div>
                </div>
                <!-- Trust -->
                <div class="bg-[#A8D7B0]/30 rounded-2xl p-6 flex flex-col justify-between shadow hover:shadow-md transition cursor-pointer hover:bg-[#A8D7B0]/40 border border-[#A8D7B0]/50" onclick="window.location.href='${paths.trust.home}'">
                    <div>
                        <div class="w-full h-40 bg-white rounded-xl flex items-center justify-center mb-4 border border-[#A8D7B0]/20">
                            <svg class="w-16 h-16 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h4 class="text-2xl font-semibold text-[#4CAF50] mb-2 font-heading">GreenAmmo Trust</h4>
                        <p class="text-gray-500 text-sm leading-relaxed">Non-profit initiatives for environmental awareness, youth empowerment, and community development.</p>
                    </div>
                    <div class="mt-6">
                        <button class="cta-button-secondary border-[#4CAF50] text-[#4CAF50] hover:bg-[#A8D7B0]/50 w-full sm:w-auto" style="padding: 0.75rem 2.5rem; border-radius: 9999px; border-width: 2px;">Visit Trust</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ================= INITIALIZATION =================

function attachEvents() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const iconOpen = document.querySelector('.menu-icon-open');
    const iconClose = document.querySelector('.menu-icon-close');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (iconOpen && iconClose) {
                iconOpen.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
        });
    }

    // Dropdowns (desktop hover works via CSS group-hover, mobile needs click)
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(container => {
        const toggle = container.querySelector('.dropdown-toggle');
        const menu = container.querySelector('.dropdown-menu');
        const icon = container.querySelector('.dropdown-icon');

        if (toggle && menu) {
            // Mobile specific logic for desktop nav if used on smaller screens
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) { // typical lg breakpoint
                    e.preventDefault();
                    menu.classList.toggle('hidden');
                    if (icon) icon.classList.toggle('rotate-180');
                }
            });
        }
    });

    const mobileDropdownContainers = document.querySelectorAll('.mobile-dropdown-container');
    mobileDropdownContainers.forEach(container => {
        const toggle = container.querySelector('.mobile-dropdown-toggle');
        const menu = container.querySelector('.mobile-dropdown-menu');
        const icon = container.querySelector('.mobile-dropdown-icon');

        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                menu.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            });
        }
    });

    // Explore Modal
    const exploreBtns = document.querySelectorAll('.explore-btn');
    const exploreModal = document.getElementById('exploreModal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (exploreModal && exploreBtns.length > 0) {
        const openModal = () => {
            exploreModal.classList.remove('hidden');
            // Small delay to allow display block to apply before transition
            setTimeout(() => {
                exploreModal.classList.remove('opacity-0');
                if (modalContent) modalContent.classList.remove('scale-95');
            }, 10);
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            exploreModal.classList.add('opacity-0');
            if (modalContent) modalContent.classList.add('scale-95');
            setTimeout(() => {
                exploreModal.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
        };

        exploreBtns.forEach(btn => btn.addEventListener('click', openModal));
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        exploreModal.addEventListener('click', (e) => {
            if (e.target === exploreModal) closeModal();
        });
    }
}

export function initComponents() {
    const theme = detectTheme();
    const navPlaceholder = document.getElementById('site-nav');
    const footerPlaceholder = document.getElementById('site-footer');

    if (navPlaceholder) {
        if (theme === 'trust') navPlaceholder.innerHTML = getTrustNav();
        else if (theme === 'solutions') navPlaceholder.innerHTML = getSolutionsNav();
        else navPlaceholder.innerHTML = getGroupNav();
    }

    if (footerPlaceholder) {
        if (theme === 'trust') footerPlaceholder.innerHTML = getTrustFooter();
        else if (theme === 'solutions') footerPlaceholder.innerHTML = getSolutionsFooter();
        else footerPlaceholder.innerHTML = getGroupFooter();
    }

    // Add explore modal only for group theme if a placeholder exists or just append to body
    if (theme === 'group') {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = getExploreModal();
        document.body.appendChild(modalDiv.firstElementChild);
    }

    attachEvents();
}

// Auto-initialize when the script loads
document.addEventListener('DOMContentLoaded', initComponents);
