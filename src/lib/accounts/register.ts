"use server";

import client from "@/lib/database/client";
import bcrypt from "bcrypt";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {RegisterResult} from "@/lib/accounts/types";
import type {RegisterInputType} from "@/lib/types/RegisterInputType";
import {sendEmailVerification} from "@/lib/accounts/verification";
import validator from "@/lib/validators";

export async function register(user: RegisterInputType): Promise<RegisterResult> {
  // Validation for Sanity Check
  const validationResult = await validator.validate(user, {
    properties: {
      firstName: { type: "string", formatter: "ascii-names" },
      lastName: { type: "string", formatter: "ascii-names" },
      email: { type: "string", formatter: "cpu-email" },
      password: { type: "string", formatter: "strong-password" },
      cellphoneNumber: { type: "string", formatter: "cellphone-number" },
      department: { type: "string", formatter: "non-empty-string" },
      localNumber: { type: "string", formatter: "local-number" },
    },
    requiredProperties: ["firstName", "lastName", "email", "password", "cellphoneNumber", "department"],
    allowUnvalidatedProperties: true,
  });
  if (!validationResult.ok) {
    return {
      code: ErrorCodes.REGISTRATION_FAILURE,
      message: validator.toPlainErrors(validationResult.errors),
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
