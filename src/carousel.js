import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import Glide from "@glidejs/glide";
async function fetch_post() {
  const posts = [];
  try {
    let page = 1;
    const limit = 10;

    while (true) {
      const response = await fetch(
        `https://cms.greenammo.in/wp-json/wp/v2/posts?per_page=${limit}&page=${page}&_embed`,
      );

      // Stop if page does not exist (404) or any other non-OK status
      if (!response.ok) break;

      const body = await response.json();

      // Stop if there are no posts returned
      if (!body || body.length === 0) break;

      // Append posts to array
      posts.push(...body);

      page++;
    }
  } catch (error) {
    console.log("Error or reached end of all items:", error.message);
  }

  return posts;
}
async function exrender_carousel() {
  try {
    const posts = await fetch_post();
    console.log(posts);
    let slidesHTML = "";
    for (const item of posts) {
      const ui_post = `
      
                            <li class="glide__slide flex-shrink-0">
  <div class="flex flex-col items-start gap-5">
    <!-- Image: full width on mobile, max width on desktop -->
    <img
      src="https://images.pexels.com/photos/29498849/pexels-photo-29498849.jpeg?_gl=1*1p9lwnb*_ga*NTc5ODkzMjM3LjE3NjA4NTA3OTQ.*_ga_8JE65Q40S6*czE3NjA5MDI5NDckbzIkZzEkdDE3NjA5MDI5NTEkajU2JGwwJGgw"
      class="w-full sm:w-[460px] h-60 sm:h-[300px] object-cover rounded"
      alt="Slide Image"
    />
    <div class="w-full sm:w-[420px]">
      <a href="./post_campaign.html?slug=${item.slug}">
        <p class="text-xl sm:text-2xl font-semibold line-clamp-2">
          ${item.title.rendered}
        </p>
      </a>
      <span class="text-sm font-semibold text-slate-400">@ greenammo</span>
    </div>
  </div>
</li>

      
      `;
      slidesHTML += ui_post;
    }
    document.querySelector(".glide").classList.remove("hidden");
    document.querySelector(".carousel_skeleton").classList.add("hidden");
    document.querySelector(".glide__slides").innerHTML = slidesHTML;
    const perView = 3; // visible slides per view

    const glide = new Glide(".glide", {
      type: "slider", // important: 'slider' stops looping
      perView: 4,
      focusAt: "center",
      gap: 30,
      startAt: 0,
      rewind: false, // disables looping
      bound: true,
      breakpoints: {
        800: { perView: 2 },
        480: { perView: 1 },
      },
    }).mount();

    const totalSlides = posts.length;
    const totalPages = Math.ceil(totalSlides / perView);

    // Create bullets
    const bulletsContainer = document.getElementById("bullets");
    bulletsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const bullet = document.createElement("div");
      bullet.className = "w-3 h-3 rounded-full bg-gray-400 cursor-pointer";
      bullet.dataset.page = i;
      bullet.addEventListener("click", () => glide.go(`=${i * perView}`));
      bulletsContainer.appendChild(bullet);
    }

    const counter = document.getElementById("slide-counter");

    const updateUI = () => {
      // Update gone / total
      const gone = Math.min(glide.index + perView, totalSlides);
      counter.textContent = `${gone} / ${totalSlides}`;

      // Update active bullet
      const pageIndex = Math.floor(glide.index / perView);
      bulletsContainer.querySelectorAll("div").forEach((b, idx) => {
        b.classList.toggle("bg-gray-800", idx === pageIndex);
        b.classList.toggle("bg-gray-400", idx !== pageIndex);
      });
    };

    updateUI();
    glide.on("run.after", updateUI);
  } catch (error) {
    console.log(error);
  }
}
async function fetch_campaign_pages() {
  const pages = [];
  let page = 1;
  const limit = 10;

  while (true) {
    const res = await fetch(
      `https://cms.greenammo.in/wp-json/wp/v2/pages?per_page=${limit}&page=${page}&_embed`,
    );
    if (res.status === 400) break;
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    if (!data.length) break;

    // const campaigns = data.filter(
    //   (p) => p.slug !== "campaigns" && p.link.includes("/campaign")
    // );
    const campaigns = data.filter((p) => p.slug.includes("campaign"));

    console.log(data.map((p) => p.slug));

    pages.push(...campaigns);
    page++;
  }

  return pages;
}

async function render_carousel() {
  try {
    const campaigns = await fetch_campaign_pages();
    let slidesHTML = "";

    for (const item of campaigns) {
      slidesHTML += `
        <li class="glide__slide">
          <div class="flex flex-col gap-5">
            <img
  src="${item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""}"
  class="w-full h-60 object-cover rounded"
  alt="${item.title.rendered}"
/>

            <div>
              <a href="./campaign.html?slug=${item.slug}">
                <p class="text-xl font-semibold line-clamp-2">
                  ${item.title.rendered}
                </p>
              </a>
              
            </div>
          </div>
        </li>
      `;
    }

    document.querySelector(".glide").classList.remove("hidden");
    document.querySelector(".carousel_skeleton").classList.add("hidden");
    document.querySelector(".glide__slides").innerHTML = slidesHTML;

    const perView = 3;
    const glide = new Glide(".glide", {
      type: "slider",
      perView: 4,
      focusAt: "center",
      gap: 30,
      startAt: 0,
      rewind: false,
      bound: true,
      breakpoints: {
        800: { perView: 2 },
        480: { perView: 1 },
      },
    }).mount();

    const totalSlides = campaigns.length;
    const totalPages = Math.ceil(totalSlides / perView);

    const bulletsContainer = document.getElementById("bullets");
    bulletsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const bullet = document.createElement("div");
      bullet.className = "w-3 h-3 rounded-full bg-gray-400 cursor-pointer";
      bullet.dataset.page = i;
      bullet.addEventListener("click", () => glide.go(`=${i * perView}`));
      bulletsContainer.appendChild(bullet);
    }

    const counter = document.getElementById("slide-counter");
    const updateUI = () => {
      const gone = Math.min(glide.index + perView, totalSlides);
      counter.textContent = `${gone} / ${totalSlides}`;

      const pageIndex = Math.floor(glide.index / perView);
      bulletsContainer.querySelectorAll("div").forEach((b, idx) => {
        b.classList.toggle("bg-gray-800", idx === pageIndex);
        b.classList.toggle("bg-gray-400", idx !== pageIndex);
      });
    };

    updateUI();
    glide.on("run.after", updateUI);
  } catch (error) {
    console.log(error);
  }
}

render_carousel();
