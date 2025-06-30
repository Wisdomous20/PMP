"use server"

import validator from "@/lib/validators";
import client from "@/lib/database/client";
import { ErrorCodes } from "../ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface EquipmentParams {
  description: string,
  brand: string,
  quantity: number,
  serialNumber: string,
  supplier: string,
  unitCost: number,
  totalCost: number,
  datePurchased: Date,
  dateReceived: Date,
  location: string,
  department: string,
  status: EquipmentStatus,
  serviceRequestId?: string | null | undefined,
}

interface EquipmentResult extends GenericFailureType {
  data?: EquipmentParams
}

export async function editEquipment(data: EquipmentParams, id: string): Promise<EquipmentResult> {

    const validationResult = await validator.validate(data, {
    properties: {
      description: { type: "string", formatter: "non-empty-string" },
      brand: { type: "string", formatter: "non-empty-string" },
      quantity: { type: "number"},
      serialNumber: { type: "string", formatter: "non-empty-string" },
      supplier: { type: "string", formatter: "non-empty-string" },
      unitCost: { type: "number"},
      totalCost: { type: "number"},
      datePurchased: { type: "date" },
      dateReceived: { type: "date" },
      location: { type: "string", formatter: "non-empty-string" },
      department: { type: "string", formatter: "non-empty-string" },
      status: { type: "string", formatter: "non-empty-string"}
    },
    requiredProperties: [
      "description",
      "brand",
      "quantity",
      "serialNumber",
      "supplier",
      "unitCost",
      "totalCost",
      "datePurchased",
      "dateReceived",
      "location",
      "department",
      "status"
    ]
  })

  if (!validationResult.ok) {
    return {
      code: ErrorCodes.EQUIPMENT_UPDATE_ERROR,
      message: validator.toPlainErrors(validationResult.errors)
    }
  }

  const idValidation = await validator.validate({ id }, {
    properties: { id: {type: "string", formatter: "non-empty-string"}},
    requiredProperties: [ "id" ]
  })

  if (!idValidation.ok) {
    return {
      code: ErrorCodes.EQUIPMENT_ID_ERROR,
      message: "Equipment ID does not exist or is invalid."
    }
  }

  const equipment = await client.equipment.update({
    where: { id },
    data
  })

  return {
    code: ErrorCodes.OK,
    data: equipment
  }
}