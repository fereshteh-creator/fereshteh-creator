function forceLayoutRefresh() {
  console.log("📐 Forcing layout refresh...");
  document.body.style.display = "none";
  document.body.offsetHeight; // force reflow
  document.body.style.display = "block";
  window.dispatchEvent(new Event("resize"));
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded and DOM is ready.");

  // Fetch and insert the header
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
      console.log("Header loaded.");

      forceLayoutRefresh();

      // Hamburger toggle setup
      const hamburger = document.querySelector(".hamburger");
      const nav = document.querySelector(".nav");

      if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
          nav.classList.toggle("open");
        });
      }

      // Highlight nav
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
    })
    .catch((error) => console.error("Error loading header:", error));

  // Moved outside so it's always evaluated when DOM is ready
  setTimeout(() => {
    const path = window.location.pathname;

    if (
      path.endsWith("/") ||
      path.endsWith("/index.html") ||
      path === "/" ||
      path.includes("index.html") ||
      path.includes("/fereshteh-creator/")
    ) {
      console.log("Running star generation...");
      generateStars();
      startRingExpansion();
      window.dispatchEvent(new Event("resize"));
    } else {
      console.log("Not running star logic on this page:", path);
    }
  }, 300); // Delay slightly longer to ensure DOM is ready
  setTimeout(forceLayoutRefresh, 500);
});

// Fetch and insert the footer
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);
    console.log("Footer loaded.");
    window.dispatchEvent(new Event("resize"));
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
        window.dispatchEvent(new Event("resize"));
      })
      .catch((error) => console.error("Error loading skills section:", error));
  } else {
    console.warn("No #skills-container found. Skipping skills section load.");
  }
}
// Fetch and insert projects
if (
  window.location.pathname.includes("index.html") ||
  window.location.pathname === "/" ||
  window.location.hash === "#projects"
) {
  const projectsContainer = document.getElementById("projects-container");
  if (projectsContainer) {
    fetch("projects-section.html")
      .then((response) => {
        if (!response.ok)
          throw new Error("Failed to load projects-section.html");
        return response.text();
      })
      .then((data) => {
        projectsContainer.innerHTML = data;
        console.log("Projects section loaded inside index.html");
        window.dispatchEvent(new Event("resize"));

        // Re-initialize toggles after insertion
        document.querySelectorAll(".toggle-details").forEach((btn) => {
          btn.addEventListener("click", () => {
            const details = btn.nextElementSibling;
            details.classList.toggle("hidden");
            btn.textContent = details.classList.contains("hidden")
              ? "Learn More"
              : "Show Less";
          });
        });

        // If hash is #projects, wait until section exists before scrolling
        if (window.location.hash === "#projects") {
          const waitForElement = (selector, timeout = 2000) =>
            new Promise((resolve, reject) => {
              const interval = 50;
              let elapsed = 0;
              const check = () => {
                const element = document.querySelector(selector);
                if (element) return resolve(element);
                elapsed += interval;
                if (elapsed >= timeout) return reject();
                setTimeout(check, interval);
              };
              check();
            });

          waitForElement("#projects-section")
            .then((target) => {
              target.scrollIntoView({ behavior: "smooth" });
            })
            .catch(() => {
              console.warn("Could not find #projects-section after injection.");
            });
        }
        window.dispatchEvent(new Event("resize"));
      })
      .catch((error) =>
        console.error("Error loading projects section:", error)
      );
  }
}

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
// === INTERACTIVE GRADIENT DESCENT CHART LOGIC ===
if (document.querySelector("#interactive-chart")) {
  const width = 700;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  const svg = d3
    .select("#interactive-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true);

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([-10, 10])
    .range([0, width - margin.left - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 50])
    .range([height - margin.top - margin.bottom, 0]);

  const loss = (x) => Math.sin(x) * 10 + 0.5 * x * x;

  const xData = d3.range(-10, 10.1, 0.1);
  const yData = xData.map(loss);

  const baseLine = d3
    .line()
    .x((d, i) => xScale(xData[i]))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  chart
    .append("path")
    .datum(yData)
    .attr("fill", "none")
    .attr("stroke", "#60a5fa")
    .attr("stroke-width", 2)
    .attr("d", baseLine);

  chart
    .append("g")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  chart.append("g").call(d3.axisLeft(yScale));

  document.getElementById("lr-slider").addEventListener("input", function () {
    document.getElementById("lr-value").textContent = this.value;
  });

  document.getElementById("run-descent").addEventListener("click", () => {
    const lr = parseFloat(document.getElementById("lr-slider").value);
    const feedback = document.getElementById("feedback");
    chart.selectAll(".descent-path, .descent-dot").remove();

    let w = -9;
    const points = [{ x: w, y: loss(w) }];
    for (let i = 0; i < 20; i++) {
      const grad = Math.cos(w) * 10 + w;
      w = w - lr * grad;
      points.push({ x: w, y: loss(w) });
      if (Math.abs(grad) < 0.01) break;
    }

    chart
      .append("path")
      .datum(points)
      .attr("class", "descent-path")
      .attr("fill", "none")
      .attr("stroke", "#e9b850")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4 4")
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(d.x))
          .y((d) => yScale(d.y))
      );

    chart
      .selectAll(".descent-dot")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "descent-dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 4)
      .attr("fill", "#e9b850");

    // Feedback
    if (lr < 0.05) {
      feedback.textContent = "Too slow. Try increasing the learning rate.";
    } else if (lr > 0.25) {
      feedback.textContent = "Too fast! You overshot.";
    } else {
      feedback.textContent = "Just right! You’re converging smoothly.";
    }
  });
}
