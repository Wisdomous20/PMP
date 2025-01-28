type EquipmentStatus = "Operational" | "Repairable" | "Scrap"
type Equipment = {
    id: string,
    quanty: number,
    description: string,
    brand: string,
    serialNumber: string,
    UnitCost: number,
    TotalCost: number,
    DatePurchased: Date,
    DateRecieved: Date,
    status: EquipmentStatus
    location: string,
    department: string,
    serviceRequest?: EquipmentServiceRequest
}

type EquipmentServiceRequest = {
    serviceRequestId: string,
    serviceRequestName: string,
}