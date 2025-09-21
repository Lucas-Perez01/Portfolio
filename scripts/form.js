import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { z } from "zod";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
  "https://lucas-perez-portfolio.vercel.app",
  "http://127.0.0.1:5500", // Agrega tu dirección de desarrollo local
  "http://localhost:5500", // Si usas localhost en lugar de 127.0.0.1
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes sin origen (como las de Postman o curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "La política de CORS para este sitio no permite el acceso desde el origen especificado.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Has alcanzado el límite de envíos. Intenta nuevamente más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactSchema = z.object({
  email: z.string().email(),
  asunto: z.string().min(1),
  message: z.string().min(1),
  captchaToken: z.string().min(1),
});

// Ruta para enviar correo
app.post("/send", contactLimiter, async (req, res) => {
  try {
    const { email, asunto, message, captchaToken } = contactSchema.parse(
      req.body
    );

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    const captchaResponse = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha inválido ❌" });
    }

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
