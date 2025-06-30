"use server"

import { ajv, validate } from "@/lib/validators/ajv";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";

export async function deleteEquipment(id: string) {

  const validationResult = validate(ajv, { id }, {
    properties: {
      id: { type: "string", format: "non-empty-string-value" }
    },
    required: [
      "id"
    ]
  })

  if (!validationResult.ok) {
    return {
      code: ErrorCodes.INVALID_ID,
      message: "Invalid ID."
    }
  }

  await client.equipment.delete({
    where: { id }
  })

  return {
    success: true,
    code: ErrorCodes.OK
  }
}