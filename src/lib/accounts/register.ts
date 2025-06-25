"use server";

import {ajv, validate} from "@/lib/validators/ajv";
import client from "@/lib/database/client";
import bcrypt from "bcrypt";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {RegisterResult} from "@/lib/accounts/types";
import type {RegisterInputType} from "@/lib/types/RegisterInputType";
import {sendEmailVerification} from "@/lib/accounts/verification";

export async function register(user: RegisterInputType): Promise<RegisterResult> {
  // Validation for Sanity Check
  const validationResult = validate(ajv, user, {
    properties: {
      firstName: { type: "string", format: "non-empty-string-value" },
      lastName: { type: "string", format: "non-empty-string-value" },
      email: { type: "string", format: "email" },
      password: { type: "string", format: "strong-password" },
      cellphoneNumber: { type: "string", format: "non-empty-string-value" },
      department: { type: "string", format: "non-empty-string-value" },
    },
    required: ["firstName", "lastName", "email", "password", "cellphoneNumber", "department"],
  });
  if (!validationResult.ok) {
    return {
      code: ErrorCodes.REGISTRATION_FAILURE,
      message: validationResult.messages.join(", "),
    }
  }

  const userExist = await client.user.findUnique({
    where: { email: user.email },
  });

  // Bail when the user already exists in the database.
  if (userExist) {
    return {
      code: ErrorCodes.ACCOUNT_ALREADY_EXISTS,
      message: "Account already exists",
    }
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    // Create the account
    const newUser = await client.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        user_type: "USER",
        password: hashedPassword,
        cellphoneNumber: user.cellphoneNumber,
        localNumber: user.localNumber,
        department: user.department
      },
    });

    // After generating, send out mail for verification
    const sendResult = await sendEmailVerification(newUser);

    if (sendResult.code === ErrorCodes.MAIL_SEND_FAILURE) {
      return {
        code: ErrorCodes.REGISTRATION_SUCCESS_BUT_MAIL_SEND_FAILURE,
        message: sendResult.message,
      };
    }

    return {
      code: ErrorCodes.OK,
      data: {
        email: newUser.email,
      }
    }
  } catch {
    return {
      code: ErrorCodes.REGISTRATION_FAILURE,
      message: "Failed to register due to an exception",
    }
  }
}
