"use server";

import client from "@/lib/database/client";
import {GenericFailureType} from "@/lib/types/GenericFailureType";
import crypto from "crypto";
import {createMailer} from "@/lib/mailer/create-mailer";
import {ErrorCodes} from "@/lib/ErrorCodes";

export async function resetPassword(email: string): Promise<GenericFailureType> {
  try {
    const user = await client.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        code: ErrorCodes.NO_ACCOUNT_FOUND,
        message: "No account found with that email.",
      }
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await client.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/update-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    const mailer = await createMailer();
    await mailer.sendMail(mailOptions);
    return { code: ErrorCodes.OK };
  } catch (e) {
    return {
      code: ErrorCodes.RECOVERY_FAILED,
      message: (e as Error).message,
    }
  }
}
