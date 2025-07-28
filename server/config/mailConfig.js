require("dotenv").config();
const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports = mailTransporter;
// This module exports the configured mail transporter for use in other parts of the application.