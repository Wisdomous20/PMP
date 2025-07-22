"use server"

import validator from "@/lib/validators";
import client from "@/lib/database/client";
import {ErrorCodes} from "../ErrorCodes";
import {GenericFailureType} from "@/lib/types/GenericFailureType";

type EquipmentStatus = "Operational" | "Repairable" | "Scrap";

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
  id?: string
}

interface EquipmentResult extends GenericFailureType {
  data?: EquipmentParams
}

export async function createEquipment(equipmentData: EquipmentParams): Promise<EquipmentResult> {
  const validationResult = await validator.validate(equipmentData, {
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
      status: { type: "string", formatter: "non-empty-string"},
      serviceRequestId: { type: "string", formatter: "non-empty-string" }
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
      "status",
    ],
    allowUnvalidatedProperties: true
  })

  if (!validationResult.ok) {
    return {
      code: ErrorCodes.EQUIPMENT_CREATION_ERROR,
      message: "Error creating equipment."
    }
  }

  try {
    const newEquipment = await client.equipment.create({
      data: equipmentData
    })

    return {
      code: ErrorCodes.OK,
      data: newEquipment
    }
  } catch {
    return {
      code: ErrorCodes.EQUIPMENT_CREATION_ERROR,
      message: "An Internal Error Occurred while creating entry of Equipment. Please try again later."
    }
  }
}
