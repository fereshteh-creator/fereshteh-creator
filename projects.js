document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const details = btn.nextElementSibling;
      details.classList.toggle("hidden");
      btn.textContent = details.classList.contains("hidden")
        ? "Learn More"
        : "Show Less";
    });
  });
});
