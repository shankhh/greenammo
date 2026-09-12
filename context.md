# GREENAMMO Headless CMS & Slugs Lookup Guide (`context.md`)

This guide serves as a quick lookup and reference for both the **non-technical team** (managing content in WordPress Admin) and **developers** (maintaining the codebase).

---

## 📌 1. Quick Slugs & Endpoints Lookup Table

| Resource Type | WordPress Slug | Description / Target | WP Admin Location |
| :--- | :--- | :--- | :--- |
| **Menu** | `group-nav` | Main GREENAMMO Group Portal Navbar | Appearance → Menus |
| **Menu** | `trust-nav` | GREENAMMO Trust NGO Navbar | Appearance → Menus |
| **Menu** | `solutions-nav` | GREENAMMO Solutions Commercial Navbar | Appearance → Menus |
| **Page** | `home` | Group Portal Homepage Copy | Pages → All Pages → home |
| **Page** | `aboutus` | About Us & Team Bios Copy | Pages → All Pages → aboutus |
| **Page** | `joinus` | Join Us & Careers Copy | Pages → All Pages → joinus |
| **Page** | `donate` | Donation Causes & Payment Info | Pages → All Pages → donate |
| **Page** | `trust-home` | GREENAMMO Trust Overview | Pages → All Pages → trust-home |
| **Page** | `solutions-home` | GREENAMMO Solutions Services | Pages → All Pages → solutions-home |
| **Gallery** | `urban-demonstration-projects` | West Bengal Projects Media | Project Custom Post → urban-demonstration-projects |
| **Gallery** | `meghalaya-eco-tourism` | Meghalaya Eco-Tourism Media | Project Custom Post → meghalaya-eco-tourism |
| **Gallery** | `himachal-waste-management` | Himachal Pradesh Waste Drive | Project Custom Post → himachal-waste-management |
| **Gallery** | `assam-flood-resilience` | Assam Brahmaputra Resilience | Project Custom Post → assam-flood-resilience |
| **Gallery** | `arunachal-conservation` | Arunachal Pradesh Conservation | Project Custom Post → arunachal-conservation |
| **Gallery** | `tamil-nadu-coastal` | Tamil Nadu Coastal Cleanup | Project Custom Post → tamil-nadu-coastal |
| **Gallery** | `odisha-community` | Odisha Sanitation & Education | Project Custom Post → odisha-community |
| **Gallery** | `goa-beach-cleanups` | Goa Tourism Preservation | Project Custom Post → goa-beach-cleanups |
| **Gallery** | `nepal-youth-action` | Nepal Youth Climate Alliance | Project Custom Post → nepal-youth-action |

> 📁 Machine-readable JSON schema is saved in [`wp-slugs.json`](file:///s:/CODE/greenammo/wp-slugs.json).

---

## 🙋 Non-Technical Team How-To Guide

### A. How to Add or Edit Navigation Links
1. Log into WordPress Admin (`https://cms.greenammo.in/wp-admin`).
2. Go to **Appearance → Menus**.
3. Select the menu you want to edit (`group-nav`, `trust-nav`, or `solutions-nav`).
4. Add new custom links or reorder items using drag-and-drop.
5. Click **Save Menu**. The website updates dynamically for users!

### B. How to Add Captions / Descriptions to Images
1. In WP Admin, go to **Media → Library**.
2. Click any image.
3. Fill out the **Caption** field (e.g. *"Menstrual hygiene workshop in Darjeeling"*).
4. Click Save. The caption automatically displays under the image card and inside the full-screen Lightbox viewer!

### C. How to Update Page Text Copy
1. In WP Admin, go to **Pages → All Pages**.
2. Select the page you want to update (e.g. `aboutus` or `home`).
3. Edit the text using the visual editor and click **Update**.

---

## 💻 Developer Architecture & Performance Reference

### ⚡ Stale-While-Revalidate (SWR) Caching
To prevent WordPress response delays from slowing down the website:
- **Instant Render (0ms)**: The app reads cached content from `localStorage` (`greenammo_cms_cache_*`) or inline baselines.
- **Silent Background Sync**: [src/cms-cache.js](file:///s:/CODE/greenammo/src/cms-cache.js) fetches fresh data with a **3.5s timeout** and `_fields` payload compression, updating `localStorage` for subsequent page views without blocking initial paint.

### Key Module Files
- [wp-slugs.json](file:///s:/CODE/greenammo/wp-slugs.json): WP API Endpoint & Slug registry.
- [src/cms-cache.js](file:///s:/CODE/greenammo/src/cms-cache.js): SWR Caching & Timeout engine.
- [js/components.js](file:///s:/CODE/greenammo/js/components.js): Navigation & Footer component generator.
- [src/project-gallery.js](file:///s:/CODE/greenammo/src/project-gallery.js): ACF Gallery parser with caption overlays.
