import { NextRequest, NextResponse } from "next/server";
import createEquipment from "@/domains/equipment-management/createEquipment";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      description,
      brand,
      serialNumber,
      supplier,
      UnitCost,
      TotalCost,
      DatePurchased,
      DateRecieved,
      location,
      department,
      serviceRequestId,
    } = await req.json();

    if (
      !description ||
      !brand ||
      !serialNumber ||
      !supplier ||
      !UnitCost ||
      !TotalCost ||
      !DatePurchased ||
      !DateRecieved ||
      !location ||
      !department ||
      !serviceRequestId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEquipment = await createEquipment(
      description,
      brand,
      serialNumber,
      supplier,
      UnitCost,
      TotalCost,
      new Date(DatePurchased),
      new Date(DateRecieved),
      location,
      department,
      serviceRequestId
    );

    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to create equipment" },
      { status: 500 }
    );
  }
}