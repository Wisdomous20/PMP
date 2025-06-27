"use server";

import {ajv, validate} from "@/lib/validators/ajv";
import { ErrorCodes } from "../ErrorCodes";
import { getDashboardData } from "@/domains/dashboard/services/getDashbaordData";

export async function dashboardData(userId: string) {
  // Validation for Sanity Check
  const validationResult = validate(ajv, { userId }, {
    properties: {
      userId: { type: "string", format: "non-empty-string-value" }
    },
    required: ["userId"],
  })

  if (!validationResult.ok) {
    return {
      code: ErrorCodes.DASHBOARD_ID_ERROR,
      message: validationResult.messages.join(", ")
    }
  }

  try {
    const dashboardData = await getDashboardData(userId)

    return {
      code: ErrorCodes.OK,
      data: dashboardData
    }
  } catch {
    return {
      code: ErrorCodes.DASHBOARD_FAILURE
    }
  }
}