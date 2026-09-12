# GREENAMMO Headless CMS & Slugs Lookup Guide (`context.md`)

This guide serves as a quick lookup and reference for both the **non-technical team** (managing content in WordPress Admin) and **developers** (maintaining the codebase).

---

## 📌 1. Quick Slugs & Endpoints Lookup Table

| Resource Type | WordPress Slug / Location | Description / Target | WP Admin Location |
| :--- | :--- | :--- | :--- |
| **Menu** | `greenammogroup` / `primary` | Main GREENAMMO Group Portal Navbar | Appearance → Menus → GreenAmmoGroup |
| **Menu** | `trust` / `secondary_menu` | GREENAMMO Trust NGO Navbar | Appearance → Menus → Trust |
| **Menu** | `solutions` | GREENAMMO Solutions Commercial Navbar | Appearance → Menus → Solutions |
| **Page** | `home` | Group Portal Homepage Copy | Pages → All Pages → home |
| **Page** | `aboutus` | About Us & Team Bios Copy | Pages → All Pages → aboutus |
| **Page** | `joinus` | Join Us & Careers Copy | Pages → All Pages → joinus |
| **Page** | `donate` | Donation Causes & Payment Info | Pages → All Pages → donate |
| **Page** | `trust-home` | GREENAMMO Trust Overview | Pages → All Pages → trust-home |
| **Page** | `solutions-home` | GREENAMMO Solutions Services | Pages → All Pages → solutions-home |
| **Project Region** | `meghalaya` | Meghalaya Regional Timeline Feed | Projects → Add New / Edit → Region: Meghalaya |
| **Project Region** | `west-bengal` | West Bengal Regional Timeline Feed | Projects → Add New / Edit → Region: West Bengal |
| **Project Region** | `himachal-pradesh` | Himachal Pradesh Regional Timeline Feed | Projects → Add New / Edit → Region: Himachal Pradesh |
| **Project Region** | `assam` | Assam Regional Timeline Feed | Projects → Add New / Edit → Region: Assam |
| **Project Region** | `arunachal-pradesh` | Arunachal Pradesh Conservation Feed | Projects → Add New / Edit → Region: Arunachal Pradesh |
| **Project Region** | `tamil-nadu` | Tamil Nadu Coastal Cleanup Feed | Projects → Add New / Edit → Region: Tamil Nadu |
| **Project Region** | `odisha` | Odisha Community & Education Feed | Projects → Add New / Edit → Region: Odisha |
| **Project Region** | `goa` | Goa Tourism Preservation Feed | Projects → Add New / Edit → Region: Goa |
| **Project Region** | `nepal` | Nepal Youth Action Feed | Projects → Add New / Edit → Region: Nepal |

> 📁 Machine-readable JSON schema is saved in [`wp-slugs.json`](file:///s:/CODE/greenammo/wp-slugs.json).

---

## 🙋 Non-Technical Team How-To Guide

### A. How to Add or Edit Navigation Links
1. Log into WordPress Admin (`https://cms.greenammo.in/wp-admin`).
2. Go to **Appearance → Menus**.
3. Select the target menu (`GreenAmmoGroup`, `Trust`, or `Solutions`).
4. Add new custom links or reorder items using drag-and-drop. Drag an item to the right to create dropdown sub-menus (`child_items`).
5. Click **Save Menu**.

### B. How to Publish a New Regional Project Milestone (Zero-Code)
1. Go to **Projects → Add New**.
2. Fill in **Title** and **Description Copy** (in main editor box).
3. Attach photos in **Project Settings** (Image 1-4).
4. Set the **Region** dropdown (e.g. `Meghalaya`, `West Bengal`, `Assam`, etc.).
5. Click **Publish** — card automatically renders on the live region page!

### C. How to Add Captions / Descriptions to Images
1. In WP Admin, go to **Media → Library**.
2. Click any image and fill in the **Caption** field.
3. Caption automatically displays under image cards and in the Lightbox viewer!

---

## 💻 Developer Architecture & Performance Reference

### ⚡ Active REST API Endpoints
- **Menus**: `https://cms.greenammo.in/wp-json/menus/v1/menus/{slug}` & `https://cms.greenammo.in/wp-json/menus/v1/locations/{slug}`
- **Projects**: `https://cms.greenammo.in/wp-json/wp/v2/project?per_page=100`
- **Media**: `https://cms.greenammo.in/wp-json/wp/v2/media/{id}`

### ⚡ Stale-While-Revalidate (SWR) Caching
- **Instant Render (0ms)**: The app reads cached content from `localStorage` (`greenammo_cms_cache_*`).
- **Live Background Sync**: [src/cms-cache.js](file:///s:/CODE/greenammo/src/cms-cache.js) fetches fresh data in the background and invokes `onUpdate` callbacks to re-render DOM dynamically on updates.

### Key Module Files
- [wp-slugs.json](file:///s:/CODE/greenammo/wp-slugs.json): WP API Endpoint & Slug registry.
- [src/cms-cache.js](file:///s:/CODE/greenammo/src/cms-cache.js): SWR Caching & Timeout engine.
- [js/components.js](file:///s:/CODE/greenammo/js/components.js): Navigation & Footer component generator.
- [src/project-gallery.js](file:///s:/CODE/greenammo/src/project-gallery.js): ACF Gallery & Zero-Code Regional Feed renderer.
- [NON_TECH_GUIDE.md](file:///s:/CODE/greenammo/NON_TECH_GUIDE.md): End-user documentation for content editors.
