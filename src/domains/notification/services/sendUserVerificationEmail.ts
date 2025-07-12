import { createMailer } from "@/lib/mailer/create-mailer";

type VerifyUserEmailParams = {
  to: string;
  userName: string;
  userId: string;
  verificationToken: string;
  color?: string;
};

export async function sendUserVerificationEmail({
  to,
  userName,
  userId,
  verificationToken,
  color = "#4CAF50",
}: VerifyUserEmailParams): Promise<void> {
  const transporter = await createMailer();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify-user?userId=${encodeURIComponent(
    userId
  )}&token=${encodeURIComponent(verificationToken)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f7f6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: ${color};">Verify Your Account</h2>
        
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Welcome aboard! Please click the button below to verify your email and activate your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${verifyUrl}"
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
            Verify My Account
          </a>
        </div>
        
        <p><strong>Note:</strong> This link will expire in 15 minutes. If it expires, request a new verification email from the login page.</p>
        
        <div style="text-align: center; padding: 20px; background-color: #f4f7f6; border-radius: 8px; margin-top: 30px;">
          <p style="font-size: 14px; color: #888; margin-bottom: 10px;">Sincerely,</p>
          <p style="font-size: 16px; color: ${color}; font-weight: bold; margin: 0;">CPU Project Management Team</p>
          <p style="font-size: 12px; color: #666; margin: 5px 0;">Office of the Vice President for Administration</p>
          <p style="font-size: 12px; color: #666; margin: 5px 0;">
            Contact us at 
            <a href="mailto:ovpa@cpu.edu.phh" style="color: ${color}; text-decoration: none;">ovpa@cpu.edu.ph</a>
          </p>
          <p style="font-size: 10px; color: #aaa; margin-top: 10px;">© ${new Date().getFullYear()} Central Philippine University. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"CPU Project Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Please Verify Your CPU Account",
    html,
  });
}
