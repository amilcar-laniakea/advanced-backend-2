import Email from "../dao/classes/email.dao.js";
import { Response } from "../utils/response.js";

const emailService = new Email();

export const emailProcess = async (req, res) => {
  try {
    const { emailUser, emailSubject, description } = req.body;

    const html = `
      <h1>Test Confirmation</h1>
      <p>Thank you for your purchase!</p>
      <p>Your name is <strong>${description}</strong>.</p>
    `;

    const response = await emailService.sendEmail({
      to: emailUser,
      subject: emailSubject,
      html,
    });

    Response(
      res,
      { messageId: response.messageId },
      "Test completed, confirmation email sent.",
      200
    );
  } catch (error) {
    Response(res, null, "Purchase process failed.", 500, false);
  }
};
