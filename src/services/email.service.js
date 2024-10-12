import { emailAddress } from "../config/env.js";
import { transportEmail } from "../config/email.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: emailAddress,
      to,
      subject,
      html,
    };

    const info = await transportEmail.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error("Email service failed");
  }
};
