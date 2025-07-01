"use server";

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes";
import validator from "@/lib/validators";
import bcrypt from "bcrypt";

interface UpdatePasswordParams {
  token: string;
  password: string;
}

export async function updatePassword(params: UpdatePasswordParams) {
  const validation = await validator.validate(params, {
    properties: {
      token: { type: "string", formatter: "non-empty-string" },
      password: { type: "string", formatter: "strong-password" }
    },
    requiredProperties: [
      "token",
      "password"
    ],
  });

  if (!validation.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validation.errors),
    }
  }

  const user = await client.user.findFirst({
    where: {
      resetPasswordToken: params.token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    }
  });

  if (!user) {
    return {
      code: ErrorCodes.PASSWORD_UPDATE_TOKEN_INVALID,
      message: "Invalid password reset token.",
    }
  }

  const hashedPassword = await bcrypt.hash(params.password, 10);
  await client.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    }
  });

  return {code: ErrorCodes.OK};
}
