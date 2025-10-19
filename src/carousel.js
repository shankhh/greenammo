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
        `https://greenammo.in/wp-json/wp/v2/posts?per_page=${limit}&page=${page}`
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

async function render_carousel() {
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
    const perView = 4; // visible slides per view

    const glide = new Glide(".glide", {
      type: "slider", // important: 'slider' stops looping
      perView: perView,
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
render_carousel();
