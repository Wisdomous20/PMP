"use server"

import validator from "@/lib/validators";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";

export async function deleteEquipment(id: string) {

  const validationResult = await validator.validate({ id }, {
    properties: {
      id: { type: "string", formatter: "non-empty-string" }
    },
    requiredProperties: [
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