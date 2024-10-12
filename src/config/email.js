import nodemailer from "nodemailer";
import { emailUserAddress, emailSecretKey } from "./env.js";

export const transportEmail = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: emailUserAddress,
    pass: emailSecretKey,
  },
});
