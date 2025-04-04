document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded and DOM is ready.");

  // Fetch and insert the header
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
      console.log("Header loaded.");
      document.body.style.display = "none";
      document.body.offsetHeight; // Force a reflow
      document.body.style.display = "block";
      // Setup hamburger menu toggle immediately
      const hamburger = document.querySelector(".hamburger");
      const nav = document.querySelector(".nav");

      if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
          nav.classList.toggle("open");
        });
      }

      // Highlight current page in nav
      const setActiveNavItem = () => {
        const currentPage =
          window.location.pathname.split("/").pop().replace(".html", "") ||
          "index";
        const navItems = document.querySelectorAll(".nav-item");

        navItems.forEach((item) => {
          const page = item.dataset.page;
          if (
            (currentPage === "index" && page === "home") ||
            currentPage === page
          ) {
            item.classList.add("active");
          }
        });
      };

      setActiveNavItem();

      // Now, generate the stars after header loads
      setTimeout(() => {
        generateStars();
        startRingExpansion(); // Start expansion AFTER rings exist
        window.dispatchEvent(new Event("resize"));
      }, 100);
    })
    .catch((error) => console.error("Error loading header:", error));

  // Fetch and insert the footer
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("beforeend", data);
      console.log("Footer loaded.");
    })
    .catch((error) => console.error("Error loading footer:", error));
  //  Adjust Footer Position Based on Expanding Rings
  function adjustFooter() {
    const footer = document.querySelector(".footer");
    const hero = document.querySelector(".hero");

    if (!footer || !hero) return;

    const observer = new ResizeObserver(() => {
      const heroHeight = hero.offsetHeight;
      footer.style.marginTop = `${heroHeight * 0.2}px`; // Adjusts dynamically
    });

    observer.observe(hero);
  }

  // Fetch and insert the skills section only if on the About page
  if (window.location.pathname.includes("about.html")) {
    console.log(" Detected about.html. Attempting to load skills...");

    const skillsContainer = document.getElementById("skills-container");
    if (skillsContainer) {
      fetch("skills.html")
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load skills.html");
          return response.text();
        })
        .then((data) => {
          skillsContainer.innerHTML = data;
          console.log("Skills section successfully loaded inside About.");
        })
        .catch((error) =>
          console.error("Error loading skills section:", error)
        );
    } else {
      console.warn(
        "⚠️ No #skills-container found. Skipping skills section load."
      );
    }
  }
});

// Function to Generate Multiple Stars in Different Rings
function generateStars() {
  const orbitContainer = document.querySelector(".hero-orbit");
  if (!orbitContainer) {
    console.error("Error: .hero-orbit element not found.");
    return;
  }

  console.log("Generating rings with size variations for stars...");
  orbitContainer.innerHTML = ""; // Clear existing content

  const ringSizes = [620, 820, 1020, 1220]; // Ring sizes
  const numStarsPerRing = [3, 4, 5, 6]; // Number of stars in each ring

  ringSizes.forEach((size, index) => {
    const ring = document.createElement("div");
    ring.classList.add("hero-ring", `ring-${index + 1}`);
    ring.style.width = `${size}px`;
    ring.style.height = `${size}px`;

    // Generate Stars inside the ring
    for (let i = 0; i < numStarsPerRing[index]; i++) {
      const star = document.createElement("img");
      star.src = "assets/icons/star.svg";
      star.classList.add("orbit-icon");

      // Randomize size (smallest: 20px, biggest: 60px)
      const randomSize = Math.floor(Math.random() * 20) + 30; // Between 30px and 50px
      star.style.width = `${randomSize}px`;
      star.style.height = `${randomSize}px`;

      const angle = (i / numStarsPerRing[index]) * 360; // Spread stars evenly
      const radius = size / 2;
      const offsetAngle = index % 2 === 0 ? 0 : 45; // Offset to prevent straight lines
      const adjustedAngle = angle + offsetAngle;

      const x = Math.cos((adjustedAngle * Math.PI) / 180) * radius;
      const y = Math.sin((adjustedAngle * Math.PI) / 180) * radius;

      star.style.left = `calc(50% + ${x}px)`;
      star.style.top = `calc(50% + ${y}px)`;

      ring.appendChild(star);
    }

    orbitContainer.appendChild(ring);
  });
}

function startRingExpansion() {
  console.log("Starting ring expansion...");
  const rings = document.querySelectorAll(".hero-ring");

  // Reset animation first (force reflow)
  rings.forEach((ring) => {
    ring.style.animation = "none";
  });

  // Reapply animation after a short delay
  setTimeout(() => {
    rings.forEach((ring, index) => {
      ring.style.animation = `ring-move 6s ease-in-out forwards, ring-glow 10s ease-in-out infinite alternate , ring-rotate ${
        40 + index * 10
      }s linear infinite`;
    });
  }, 100); // Small delay to ensure browser registers the change
}

// EmailJS Integration for Contact Form (uses injected secrets)
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");

  if (
    contactForm &&
    typeof EMAILJS_PUBLIC_KEY !== "undefined" &&
    typeof EMAILJS_SERVICE_ID !== "undefined" &&
    typeof EMAILJS_TEMPLATE_ID !== "undefined"
  ) {
    emailjs.init(EMAILJS_PUBLIC_KEY);

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
        .then(() => {
          alert("Message sent successfully!");
          contactForm.reset();
        })
        .catch((error) => {
          alert("Oops! Something went wrong:\n" + JSON.stringify(error));
        });
    });
  } else if (contactForm) {
    console.error(
      " EmailJS credentials not found. Make sure secret.js is loaded and defines EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, and EMAILJS_TEMPLATE_ID."
    );
  }
});
