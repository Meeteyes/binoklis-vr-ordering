"use strict";
import nodemailer from "nodemailer";

export const main = async (email) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      type: "login",
      user: process.env.EMAIL, // your e-mail
      pass: process.env.PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: "We received your booking", // Subject line
    text: "Thank you very much for the booking. Someone form our company will get in touch with you in next 2 days", // plain text body
    html: `<div><h1>VR show is coming your way</h1><p>Thank you very much for your order. We have registered it and someone form the company will get in touch with you in next two days. If you have any other questions, please write to us at reinis@binoklis.eu</p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
