"use server";

import client from "@/lib/database/client";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import {randomBytes} from "crypto";
import {User} from "@prisma/client";
import {sendUserVerificationEmail} from "@/domains/notification/services/sendUserVerificationEmail";
import {ErrorCodes} from "@/lib/ErrorCodes";

const VERIFICATION_WINDOW_MINUTES = Number(
  process.env.VERIFICATION_WINDOW_MINUTES || 10
);

export async function sendEmailVerification(user: User, color?: string): Promise<GenericFailureType> {
  // Delete old verification tokens
  await client.verificationToken.deleteMany({
    where: {
      userId: user.id,
    }
  });

  // Generate Token
  const token = randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + VERIFICATION_WINDOW_MINUTES * 60000);
  await client.verificationToken.create({
    data: { userId: user.id, token, expires },
  });

  // Send it to a user
  try {
    await sendUserVerificationEmail({
      to: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      userId: user.id,
      verificationToken: token,
      color,
    });

    return { code: ErrorCodes.OK }
  } catch (e) {
    return {
      code: ErrorCodes.MAIL_SEND_FAILURE,
      message: (e as Error).message,
    }
  }
}
