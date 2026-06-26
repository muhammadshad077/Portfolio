document.addEventListener("DOMContentLoaded", () => {
  // ⚡ PROJECTS FILTER CONFIGURATION ONLY
  const filterButtons = document.querySelectorAll(".filter-bar .filter-btn");
  const projectCards = document.querySelectorAll(".project-grid .project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute("data-category");

          if (filterValue === "all" || cardCategory === filterValue) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            card.style.display = "none";
          }
        });
      });
    });
  }
});