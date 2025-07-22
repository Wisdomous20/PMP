"use server";

import client from "@/lib/database/client";
import {DateTime} from "luxon";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import validator from "@/lib/validators";

interface ValidateUserPayload {
  userId: string;
  token: string;
}

export async function validateUser(payload: ValidateUserPayload): Promise<GenericFailureType> {
  const validate = await validator.validate(payload, {
    properties: {
      userId: {type: "string", formatter: "non-empty-string"},
      token: {type: "string", formatter: "non-empty-string"},
    },
    requiredProperties: ["userId", "token"],
  });
  if (!validate.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validate.errors),
    }
  }

  const record = await client.verificationToken.findUnique({
    where: { token: payload.token },
  });

  // Check for the entry
  if (!record || record.userId !== payload.userId) {
    return {
      code: ErrorCodes.EMAIL_VERIFICATION_TOKEN_INVALID,
      message: "Invalid email verification token.",
    };
  }

  // Check for expiration
  const expires = DateTime.fromJSDate(record.expires);
  const now = DateTime.now();
  if (expires <= now) {
    return {
      code: ErrorCodes.EMAIL_VERIFICATION_TOKEN_EXPIRED,
      message: "Email verification token has expired.",
    }
  }

  // Update
  await client.user.update({
    where: { id: payload.userId },
    data: {
      isVerified: true,
    }
  });

  await client.verificationToken.delete({
    where: { token: payload.token },
  });

  return { code: ErrorCodes.OK };
}
