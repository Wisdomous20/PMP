import {type EquipmentObject, EquipmentObjectStatus} from "@/lib/types/InventoryManagementTypes";
import type {GetAllEquipmentsResultRaw} from "@/lib/equipments/get-equipments";
import {equipment_status} from "@prisma/client";

export function toEquipmentObjectStatus(from: equipment_status | string): EquipmentObjectStatus {
  switch (from) {
    case "Operational":
      return EquipmentObjectStatus.Operational;
    case "Repairable":
      return EquipmentObjectStatus.Repairable;
    default:
      return EquipmentObjectStatus.Scrap;
  }
}

export function toEquipmentStatus(from: EquipmentObjectStatus): equipment_status {
  switch (from) {
    case EquipmentObjectStatus.Operational:
      return equipment_status.Operational;
    case EquipmentObjectStatus.Repairable:
      return equipment_status.Repairable;
    case EquipmentObjectStatus.Scrap:
      return equipment_status.Scrap;
  }
}

export function equipmentObjectStatusToString(from: EquipmentObjectStatus): string {
  switch (from) {
    case EquipmentObjectStatus.Operational:
      return "Operational";
    case EquipmentObjectStatus.Repairable:
      return "Repairable";
    case EquipmentObjectStatus.Scrap:
      return "Scrap";
  }
}

export function toEquipmentObjectArray(from: GetAllEquipmentsResultRaw): EquipmentObject {
  return {
    id: from.id,
    quantity: from.quantity,
    description: from.description,
    brand: from.brand,
    serialNumber: from.serialNumber,
    unitCost: from.unitCost,
    totalCost: from.totalCost,
    datePurchased: from.datePurchased,
    supplier: from.supplier,
    dateReceived: from.dateReceived,
    status: toEquipmentObjectStatus(from.status),
    department: from.department,
    location: from.location,
    serviceRequest: from.serviceRequest ? {
        serviceRequestId: from.serviceRequest.id,
        serviceRequestName: from.serviceRequest.concern || from.serviceRequest.id
    } : undefined,
  }
}
