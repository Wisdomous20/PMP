import { createMailer } from "@/lib/mailer/create-mailer";

type EmailParams = {
  to: string;
  userName: string;
  concern: string;
  details: string;
  requestId: string
  note?: string;
  color?: string;
};

export async function sendServiceRequestRatingReminderEmail({
  to,
  userName,
  concern,
  details,
  requestId,
  note = '',
  color = '#2c3e50',
} : EmailParams) {
  const transporter = await createMailer();

  const noteSection = note
    ? `
      <h3 style="margin-top: 24px; color: #333;">Note</h3>
      <p style="padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
        ${note}
      </p>
    `
    : '';

  const rateUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/service-request/${requestId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f7f6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: ${color};">Rate Your Completed Service Request</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>It’s been 5 days since we completed your service request. We noticed you haven’t rated it yet.</p>

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

        <h3 style="margin-top: 24px; color: #333;">We Value Your Feedback</h3>
        <p>Please click the button below to rate your experience.</p>

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
            Rate Now
          </a>
        </div>

        <p style="margin-top: 24px;">Thank you! Your feedback helps us improve.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"CPU Project Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Reminder: Please Rate Your Service Request`,
    html,
  };

  await transporter.sendMail(mailOptions);
}
