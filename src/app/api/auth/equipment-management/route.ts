import { NextRequest, NextResponse } from "next/server";
import createEquipment from "@/domains/equipment-management/services/createEquipment";
import getAllEquipment from "@/domains/equipment-management/services/getAllEquipment";

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

    const createEquipmentData = {
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
    }

    const newEquipment = await createEquipment(
      description,
      brand,
      supplier,
      TotalCost,
      new Date(DatePurchased),
      new Date(DateRecieved),
      location,
      UnitCost,
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const equipment = await getAllEquipment();
    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}