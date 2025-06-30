"use server"

import { ajv, validate } from "@/lib/validators/ajv";
import client from "@/lib/database/client";
import { ErrorCodes } from "../ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

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

  console.log("equipment data: ", equipmentData);

  // const validationResult = validate(ajv, equipmentData, {
  //   properties: {
  //     description: { type: "string", format: "non-empty-string-value" },
  //     brand: { type: "string", format: "non-empty-string-value" },
  //     quantity: { type: "int32"},
  //     serialNumber: { type: "string", format: "non-empty-string-value" },
  //     supplier: { type: "string", format: "non-empty-string-value" },
  //     unitCost: { type: "int32"},
  //     totalCost: { type: "int32"},
  //     datePurchased: { type: "timestamp" },
  //     dateReceived: { type: "timestamp" },
  //     location: { type: "string", format: "non-empty-string-value" },
  //     department: { type: "string", format: "non-empty-string-value" },
  //   },
  //   required: [
  //     "description",
  //     "brand",
  //     "quantity",
  //     "serialNumber",
  //     "supplier",
  //     "unitCost",
  //     "totalCost",
  //     "datePurchased",
  //     "dateReceived",
  //     "location",
  //     "department"
  //   ]
  // })

  // if (!validationResult.ok) {
  //   return {
  //     code: ErrorCodes.EQUIPMENT_CREATION_ERROR,
  //     message: validationResult.messages.join(", ")
  //   }
  // }

  const newEquipment = await client.equipment.create({
    data: equipmentData
  })

  return {
    code: ErrorCodes.OK,
    data: newEquipment
  }
}