import nodemailer from "nodemailer";

export type ImplementationPlanEmailParams = {
  to: string;
  userName: string;
  concern: string;
  planStatus: "Proposed" | "Revised" | "Approved";
  tasks: string[];
  history?: { sender: string; message: string; timestamp: string }[];
  actionUrl?: string;
  color?: string;
};

export async function sendImplementationPlanEmail({
  to,
  userName,
  concern,
  planStatus,
  tasks,
  history = [],
  actionUrl = `${process.env.BASE_URL}/requests`,
  color = "#2c3e50",
}: ImplementationPlanEmailParams) {
  // Configure the SMTP transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Build tasks list HTML
  const tasksHtml = tasks
    .map((task, idx) =>
      `<tr style="border-bottom:1px solid #ddd;"><td style="padding:8px; width:40px;">${idx + 1}</td><td style="padding:8px;">${task}</td></tr>`
    )
    .join("");

  // Build conversation history HTML if any
  const historyHtml = history.length
    ? `
      <h3 style="margin-top:24px; color:#333;">Conversation History</h3>
      <div style="border:1px solid #ddd; border-radius:4px; padding:10px; background-color:#fafafa; max-height:200px; overflow-y:auto;">
        ${history
          .map(
            item =>
              `<p style="margin:8px 0;"><strong>${item.sender} (${item.timestamp}):</strong><br/>${item.message}</p>`
          )
          .join("")}
      </div>
    `
    : "";

  // Email HTML
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; padding:20px; background-color:#f4f7f6; color:#333;">
      <div style="max-width:600px; margin:0 auto; background:#fff; padding:24px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:${color}; margin-bottom:24px;">Implementation Plan ${planStatus}</h2>

        <p>Hello <strong>${userName}</strong>,</p>
        <p>The implementation plan for your service request <strong>\"${concern}\"</strong> has been <strong>${planStatus.toLowerCase()}</strong>. Please review the list of tasks below:</p>

        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <thead>
            <tr style="background-color:#f9f9f9;">
              <th style="text-align:left; padding:8px; background-color:#f4f7f6; border-bottom:1px solid #ddd;">#</th>
              <th style="text-align:left; padding:8px; background-color:#f4f7f6; border-bottom:1px solid #ddd;">Task Description</th>
            </tr>
          </thead>
          <tbody>
            ${tasksHtml}
          </tbody>
        </table>

        ${historyHtml}

        <p style="text-align:center; margin:32px 0;">
          <a href="${actionUrl}" style="display:inline-block; padding:12px 24px; background-color:${color}; color:#fff; text-decoration:none; border-radius:4px; font-weight:bold;">
            View Implementation Plan
          </a>
        </p>

        <p style="font-size:12px; color:#666; text-align:center;">
          Please do not reply to this email. To discuss or update the plan, use the link above.
        </p>

        <div style="text-align:center; padding:20px; background-color:#f4f7f6; border-radius:8px; margin-top:30px;">
          <p style="font-size:14px; color:#888; margin-bottom:10px;">Sincerely,</p>
          <p style="font-size:16px; color:${color}; font-weight:bold; margin:0;">CPU Project Management Team</p>
          <p style="font-size:12px; color:#666; margin:5px 0;">Office of the Vice President for Administration</p>
          <p style="font-size:12px; color:#666; margin:5px 0;">Contact us at <a href="mailto:ovpa@cpu.edu.ph" style="color:${color}; text-decoration:none;">ovpa@cpu.edu.ph</a></p>
          <p style="font-size:10px; color:#aaa; margin-top:10px;">© ${new Date().getFullYear()} Central Philippine University. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"CPU Project Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Implementation Plan ${planStatus} - ${concern}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Implementation plan email sent to ${to}`);
  } catch (error) {
    console.error("Error sending implementation plan email:", error);
    throw new Error("Failed to send implementation plan email.");
  }
}
