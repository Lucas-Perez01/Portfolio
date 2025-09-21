const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const asunto = document.getElementById("asunto").value;
  const message = document.getElementById("message").value;

  const captchaToken = grecaptcha.getResponse();

  if (!captchaToken) {
    alert("Por favor completa el captcha ❌");
    return;
  }

  try {
    const response = await fetch("https://portfolio-yavp.onrender.com/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, asunto, message, captchaToken }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Correo enviado con éxito ✅");
      contactForm.reset();
      grecaptcha.reset();
    } else {
      alert(data.message || "Error al enviar el correo ❌");
    }
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al enviar el correo ❌");
  }
});
