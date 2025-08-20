// Seleccionamos el form
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevenimos recarga de página

  // Obtenemos los valores del form
  const email = document.getElementById("email").value;
  const asunto = document.getElementById("asunto").value;
  const message = document.getElementById("message").value;

  try {
    const response = await fetch("http://localhost:5000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, asunto, message }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Correo enviado con éxito ✅");
      contactForm.reset(); // limpiamos el formulario
    } else {
      alert("Error al enviar el correo ❌");
    }
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al enviar el correo ❌");
  }
});
