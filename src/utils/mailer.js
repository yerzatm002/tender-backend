const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // В .env
    pass: process.env.EMAIL_PASSWORD    // В .env
  }
});

async function sendEmail(to, subject, text) {
  return transporter.sendMail({
    from: `"Tender Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = sendEmail;
