"use server"

import { ajv, validate } from "@/lib/validators/ajv";
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

  const equipment = await client.equipment.update({
    where: { id },
    data
  })

  return {
    code: ErrorCodes.OK,
    data: equipment
  }
}