document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded and DOM is ready.");

  // Fetch and insert the header
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
      console.log("Header loaded.");

      // Now, generate the stars after header loads
      setTimeout(() => {
        generateStars();
        startRingExpansion(); // 🔥 Start expansion AFTER rings exist
      }, 100);
    })
    .catch((error) => console.error("Error loading header:", error));
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
