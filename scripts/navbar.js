document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = navMenu.querySelectorAll("a");
  const overlay = document.querySelector(".overlay"); // nuevo

  // Abrir/cerrar con el icono
  menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active"); // mostramos/ocultamos overlay
  });

  // Cerrar al hacer clic en un enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  // Cerrar al hacer clic en el overlay
  overlay.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});
