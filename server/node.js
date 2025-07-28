const nodemailer = require("nodemailer");
// Load environment variables from .env file
require("dotenv").config();

// Create transporter object using SMTP
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.PASSWORD, // Replace with your app password
  },
});

// Mail options
let mailOptions = {
  from: process.env.EMAIL, // sender address
  to: "watharva383@gmail.com", // receiver
  subject: "Test Email from Nodemailer", // Subject line
  text: "Hello! This is a test email.", // plain text body
};

// Send mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error occurred:", error);
  }
  console.log("Email sent successfully:", info.response);
});
