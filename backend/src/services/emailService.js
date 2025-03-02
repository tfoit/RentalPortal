// emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.development" });

// Configure Nodemailer with environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    acccessToken: process.env.GMAIL_ACCESS_TOKEN,
  },
});

// Function to send an email
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: "rmp6160@gmail.com", // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

// Export the sendEmail function
module.exports = {
  sendEmail,
};
