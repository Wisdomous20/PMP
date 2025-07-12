"use server";

import client from "@/lib/database/client";
import type {EquipmentObjectUpdatePayload} from "@/lib/types/InventoryManagementTypes";
import {ErrorCodes} from "@/lib/ErrorCodes";
import * as helpers from "@/lib/types/InventoryManagementTypesHelpers";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import validator from "@/lib/validators";

export async function updateEquipment(payload: EquipmentObjectUpdatePayload): Promise<GenericFailureType> {
  const validation = await validator.validate(payload, {
    properties: {
      id: { type: "string", formatter: "non-empty-string" },
      quantity: { type: "number", min: 1 },
      description: { type: "string", formatter: "non-empty-string" },
      brand: { type: "string", formatter: "non-empty-string" },
      serialNumber: { type: "string", formatter: "non-empty-string" },
      supplier: { type: "string", formatter: "non-empty-string" },
      unitCost: { type: "number", min: 1 },
      totalCost: { type: "number", min: 1 },
      datePurchased: { type: "date" },
      dateReceived: { type: "date" },
      status: { type: "number" }, // Enums are numbers by default.
      location: { type: "string", formatter: "non-empty-string" },
      department: { type: "string", formatter: "non-empty-string" },
      serviceRequestId: { type: "string", formatter: "non-empty-string" },
    },
    requiredProperties: [
      "id",
      "quantity",
      "description",
      "brand",
      "serialNumber",
      "supplier",
      "unitCost",
      "totalCost",
      "datePurchased",
      "dateReceived",
      "status",
      "department"
    ],
    allowUnvalidatedProperties: true,
  });
  if (!validation.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validation.errors),
    }
  }

  try {
    await client.equipment.update({
      where: { id: payload.id },
      data: {
        quantity: payload.quantity,
        description: payload.description,
        brand: payload.brand,
        serialNumber: payload.serialNumber,
        supplier: payload.supplier,
        unitCost: payload.unitCost,
        totalCost: payload.totalCost,
        datePurchased: payload.datePurchased,
        dateReceived: payload.dateReceived,
        serviceRequestId: payload.serviceRequestId,
        status: helpers.toEquipmentStatus(payload.status),
        location: payload.location,
        department: payload.department,
      },
    });

    return { code: ErrorCodes.OK }
  } catch {
    return {
      code: ErrorCodes.EQUIPMENT_UPDATE_ERROR,
      message: "An Internal Error Occurred while updating the Equipment. Please try again later."
    }
  }
}
