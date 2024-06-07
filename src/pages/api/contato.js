// pages/api/contato.js

import nodemailer from 'nodemailer';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { nome, email, mensagem } = req.body;

   
    // Configuração do transportador de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuração do email
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_RECEIVER,
      subject: `Mensagem no site juliano340.com: Nome: ${nome} - Email: ${email}`,
      text: mensagem,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
};
