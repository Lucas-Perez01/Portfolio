import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "https://lucas-perez-portfolio.vercel.app", // la URL de tu frontend
  })
);
app.use(express.json());

// Ruta para enviar correo
app.post("/send", async (req, res) => {
  const { email, asunto, message } = req.body;

  try {
    // Configuración del transporte con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tu cuenta de Gmail
        pass: process.env.EMAIL_PASS, // contraseña de aplicación
      },
    });

    // Opciones del correo
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`, // tu Gmail
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER, // donde recibís el correo
      subject: asunto || "Nuevo mensaje desde el formulario",
      text: `
Has recibido un nuevo mensaje desde tu portfolio:

De: ${email}
Asunto: ${asunto}
Mensaje: 
${message}
      `,
      replyTo: email, // <--- este es el truco: responderá al usuario
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Correo enviado con éxito ✅" });
  } catch (error) {
    console.error("Error en la conexión con el servidor de correo:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar correo ❌" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
