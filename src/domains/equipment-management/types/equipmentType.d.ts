type EquipmentStatus = "Operational" | "Repairable" | "Scrap"
type Equipment = {
    id: string,
    quanty: number,
    description: string,
    brand: string,
    serialNumber: string,
    unit_cost: number,
    total_cost: number,
    DatePurchased: Date,
    date_recieved: Date,
    status: EquipmentStatus
    location: string,
    department: string,
    serviceRequest?: EquipmentServiceRequest
}

type EquipmentServiceRequest = {
    serviceRequestId: string,
    serviceRequestName: string,
}