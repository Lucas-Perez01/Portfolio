// Seleccionamos elementos
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

// Evento clic en hamburguesa
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
