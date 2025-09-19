async function cargarProyectos() {
  try {
    const res = await fetch("../data/card.json");
    const proyectos = await res.json();
    const cardWrapper = document.querySelector(".card-wrapper");

    proyectos.forEach((proyecto) => {
      cardWrapper.innerHTML += `
        <div class="card-container">
          <div class="card-image-container">
            <a class="anchor-menu" href="${proyecto.enlace}" target="_blank">
              <img src="${proyecto.imagen}" alt="${proyecto.titulo}" />
               <div class="image-overlay">
                  <span>Visitar</span>
                </div>
            </a>
          </div>
          <div class="text-container">
            <h2 class="project-title">${proyecto.titulo}</h2>
            <p class="description">${proyecto.descripcion}</p>
          </div>
          <div class="technologies-container">
            <ul>
             ${proyecto.tecnologias
               .map(
                 (tech) =>
                   `<li><img src="${tech.icon}" alt="" />${tech.nombre}</li>`
               )
               .join("")}
            </ul>
          </div>
          <a class="anchor-github github-icon icon-button" href="${
            proyecto.repositorio
          }" target="_blank">
            <img src="../assets/icons/github-svgrepo-com.svg" alt="github" />GitHub
          </a>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
  }
}

cargarProyectos();
