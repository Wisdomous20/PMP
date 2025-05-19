type EquipmentStatus = "Operational" | "Repairable" | "Scrap"
type Equipment = {
    id: string,
    quantity: number,
    description: string,
    brand: string,
    serialNumber: string,
    unitCost: number,
    totalCost: number,
    datePurchased: string,
    supplier: string;
    dateReceived: string,
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
    status: EquipmentStatus;
    serviceRequestId?: string | null;
  };

  type PaginatedResponse<T> = {
    data: T[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  }
  