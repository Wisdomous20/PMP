export enum EquipmentObjectStatus {
  Operational,
  Repairable,
  Scrap
}

export interface EquipmentObjectServiceRequest {
  serviceRequestId: string;
  serviceRequestName: string;
}

export interface EquipmentObject {
  id: string,
  quantity: number,
  description: string,
  brand: string,
  serialNumber: string,
  unitCost: number,
  totalCost: number,
  datePurchased: Date,
  supplier: string;
  dateReceived: Date,
  status: EquipmentObjectStatus
  location: string,
  department: string,
  serviceRequest?: EquipmentObjectServiceRequest
}

export interface EquipmentObjectForExports extends Omit<EquipmentObject, "serviceRequest" | "id"> {
  remarks?: string;
}

export interface EquipmentObjectForEditing extends Omit<EquipmentObject,  "id" | "status" | "datePurchased" | "dateReceived"> {
  dateReceived: string;
  datePurchased: string;
  status: string;
}

export interface EquipmentObjectUpdatePayload extends Omit<EquipmentObject, "serviceRequest"> {
  serviceRequestId?: string;
}
