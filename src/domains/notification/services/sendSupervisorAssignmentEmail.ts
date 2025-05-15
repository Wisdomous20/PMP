// lib/sendSupervisorAssignmentEmail.ts
import nodemailer from "nodemailer";

type SupervisorEmailParams = {
  to: string;
  supervisorName: string;
  assignedBy: string;
  serviceRequestId: string;
  concern: string;
  details: string;
  color?: string;
};

const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000"

export async function sendSupervisorAssignmentEmail({
  to,
  supervisorName,
  assignedBy,
  serviceRequestId,
  concern,
  details,
  color = "#2c3e50",
}: SupervisorEmailParams) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const requestUrl = `${baseUrl.replace(/\/$/, "")}/service-request/${serviceRequestId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f4f7f6; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: ${color};">New Service Request Assigned</h2>
        <p>Hello <strong>${supervisorName}</strong>,</p>
        <p>You have been assigned a new service request by <strong>${assignedBy}</strong>. Please review the details below and take the appropriate action.</p>

        <h3 style="margin-top: 24px; color: #333;">Request Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background: #f9f9f9;">
            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Concern</th>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${concern}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f4f7f6;">Details</th>
            <td style="padding: 10px;">${details}</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 30px;">
          <a
            href="${requestUrl}"
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
            View Service Request
          </a>
        </div>

        <div style="text-align: center; padding: 20px; background: #f4f7f6; border-radius: 8px; margin-top: 30px;">
          <p style="font-size: 12px; color: #666; margin: 0;">© ${new Date().getFullYear()} Central Philippine University</p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"CPU Project Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You’ve Been Assigned a Service Request (${serviceRequestId})`,
    html,
  };

  await transporter.sendMail(mailOptions);
}
