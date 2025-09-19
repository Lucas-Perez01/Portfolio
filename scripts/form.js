import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // para validar reCAPTCHA
import { z } from "zod";
import rateLimit from "express-rate-limit"; // <-- importamos

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "https://lucas-perez-portfolio.vercel.app" }));
app.use(express.json());

// Rate Limiter para proteger el endpoint de contacto
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // máximo 5 solicitudes por IP
  message: {
    success: false,
    message: "Has alcanzado el límite de envíos. Intenta nuevamente más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Schema Zod para validar el formulario
const contactSchema = z.object({
  email: z.string().email(),
  asunto: z.string().min(1),
  message: z.string().min(1),
  captchaToken: z.string().min(1),
});

// Ruta para enviar correo con rate limiting
app.post("/send", contactLimiter, async (req, res) => {
  try {
    // Validamos los datos con Zod
    const { email, asunto, message, captchaToken } = contactSchema.parse(
      req.body
    );

    // Validar token de reCAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    const captchaResponse = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaResponse.json();

    if (!captchaData.success || captchaData.score < 0.5) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha inválido o sospechoso" });
    }

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      subject: asunto,
      text: `Has recibido un nuevo mensaje desde tu portfolio:\n\nDe: ${email}\nAsunto: ${asunto}\nMensaje:\n${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Correo enviado con éxito ✅" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos ❌",
        errors: err.errors,
      });
    }
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar correo ❌" });
  }
});

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
