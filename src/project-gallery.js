// src/project-gallery.js

const WP_BASE = "https://cms.greenammo.in/wp-json/wp/v2";
const PROJECT_ENDPOINT = `${WP_BASE}/project`;
const MEDIA_ENDPOINT = `${WP_BASE}/media`;

document.addEventListener("DOMContentLoaded", () => {
  initGalleries();
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

async function fetchProjectImages(slug) {
  try {
    const projectRes = await fetch(`${PROJECT_ENDPOINT}?slug=${slug}`);
    const projectData = await projectRes.json();

    if (!projectData.length) return [];

    const project = projectData[0];
    if (!project.acf) return [];

    const imageIds = Object.values(project.acf).filter(
      (val) => typeof val === "number" && val !== 0,
    );

    const images = [];

    for (const id of imageIds) {
      const mediaRes = await fetch(`${MEDIA_ENDPOINT}/${id}`);
      const media = await mediaRes.json();

      images.push({
        url: media.source_url,
        alt: media.alt_text || "",
      });
    }

    return images;
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return [];
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
  return `
        <div class="rounded-xl overflow-hidden cursor-zoom-in">
            <img 
                src="${img.url}" 
                alt="${img.alt}" 
                data-full="${img.url}"
                class="w-full aspect-[4/5] object-cover transition duration-500 hover:scale-105"
                loading="lazy"
            >
        </div>
    `;
}

/* ============================
   MODAL LOGIC
============================ */

document.addEventListener("click", function (e) {
  const img = e.target.closest("img[data-full]");
  if (!img) return;

  openModal(img.dataset.full, img.alt);
});

function openModal(src, alt) {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");

  modalImg.src = src;
  modalImg.alt = alt || "";
  modal.classList.remove("hidden");
  modal.classList.add("flex");

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
