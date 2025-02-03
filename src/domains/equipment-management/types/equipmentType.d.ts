type EquipmentStatus = "Operational" | "Repairable" | "Scrap"
type Equipment = {
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
    status: EquipmentStatus
    location: string,
    department: string,
    serviceRequest?: EquipmentServiceRequest
}

type EquipmentServiceRequest = {
    serviceRequestId: string,
    serviceRequestName: string,
}

type EquipmentInput = {
    quantity: number;
    description: string;
    brand: string;
    serialNumber: string;
    supplier: string;
    unitCost: number;
    totalCost: number;
    datePurchased: Date;
    dateReceived: Date;
    location: string;
    department: string;
    serviceRequestId?: string | null;
  };
  