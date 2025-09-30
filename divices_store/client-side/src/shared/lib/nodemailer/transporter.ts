import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER, // твой реальный email для отправки
        pass: process.env.SMTP_PASS, // App Password
    },
});