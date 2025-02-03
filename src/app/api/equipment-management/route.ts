import { NextRequest, NextResponse } from "next/server";
import createEquipment from "@/domains/equipment-management/services/createEquipment";
import getAllEquipment from "@/domains/equipment-management/services/getAllEquipment";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      description,
      brand,
      quantity,
      serialNumber,
      supplier,
      unitCost,
      totalCost,
      datePurchased,
      dateReceived,
      location,
      department,
      serviceRequestId,
    } = await req.json();

    console.log("okay1")

    if (
      !description ||
      !brand ||
      !quantity ||
      !serialNumber ||
      !supplier ||
      !unitCost ||
      !totalCost ||
      !datePurchased ||
      !dateReceived ||
      !location ||
      !department
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEquipment = await createEquipment({
      description,
      brand,
      quantity,
      serialNumber,
      supplier,
      unitCost,
      totalCost,
      datePurchased: new Date(datePurchased),
      dateReceived: new Date(dateReceived),
      location,
      department,
      serviceRequestId: serviceRequestId || null,
    });

    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to create equipment" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
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
