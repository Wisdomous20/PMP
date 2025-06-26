import { createMailer } from "@/lib/mailer/create-mailer";

type CompletedEmailParams = {
  to: string;
  userName: string;
  concern: string;
  details: string;
  requestId: string;
  note?: string;
  color?: string;
};

export async function sendServiceRequestCompletedEmail({
  to,
  userName,
  concern,
  details,
  requestId,
  note,
  color = "#2c3e50",
}: CompletedEmailParams) {
  const transporter = await createMailer();

  const noteSection = note
    ? `
      <h3 style="margin-top: 24px; color: #333;">Note</h3>
      <p style="padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
        ${note}
      </p>
    `
    : "";

  const rateUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/service-request/${requestId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f7f6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: ${color};">Service Request Completed</h2>

        <p>Hello <strong>${userName}</strong>,</p>
        <p>We’re pleased to inform you that your service request has been <strong>completed</strong>. Below are the details of your request:</p>

        <h3 style="margin-top: 24px; color: #333;">Request Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f9f9f9;">
            <th style="text-align: left; padding: 10px; background-color: #f4f7f6; border-bottom: 1px solid #ddd;">Concern</th>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${concern}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background-color: #f4f7f6;">Details</th>
            <td style="padding: 10px;">${details}</td>
          </tr>
        </table>

        ${noteSection}

        <h3 style="margin-top: 24px; color: #333;">We value your feedback</h3>
        <p>Please take a moment to rate your experience with our service.</p>

        <div style="text-align: center; margin-top: 20px;">
          <a
            href="${rateUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: ${color};
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            "
          >
            Rate Your Service Request
          </a>
        </div>

        <p style="margin-top: 24px;">Thank you for using our service! Your feedback helps us improve.</p>

        <div style="text-align: center; padding: 20px; background-color: #f4f7f6; border-radius: 8px; margin-top: 30px;">
          <p style="font-size: 14px; color: #888; margin-bottom: 10px;">Sincerely,</p>
          <p style="font-size: 16px; color: ${color}; font-weight: bold; margin: 0;">CPU Project Management Team</p>
          <p style="font-size: 12px; color: #666; margin: 5px 0;">Office of the Vice President for Administration</p>
          <p style="font-size: 12px; color: #666; margin: 5px 0;">
            Contact us at
            <a href="mailto:ovpa@cpu.edu.ph" style="color: ${color}; text-decoration: none;">ovpa@cpu.edu.ph</a>
          </p>
          <p style="font-size: 10px; color: #aaa; margin-top: 10px;">© ${new Date().getFullYear()} Central Philippine University. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"CPU Project Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Service Request is Complete – Please Rate`,
    html,
  };

  await transporter.sendMail(mailOptions);
}
