import { NextRequest, NextResponse } from "next/server";
import getEquipmentById from "@/domains/equipment-management/services/getEquipmentById";
import updateEquipment from "@/domains/equipment-management/services/updateEquipment";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Equipment ID is required" },
        { status: 400 }
      );
    }

    const equipment = await getEquipmentById(id);

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}




export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const {
      quantity,
      description,
      brand,
      serialNumber,
      supplier,
      unitCost,
      totalCost,
      datePurchased,
      dateReceived,
      status,
      location,
      department,
      serviceRequestId,
    } = await req.json();

    if (
      !quantity ||
      !description ||
      !brand ||
      !serialNumber ||
      !supplier ||
      !unitCost ||
      !totalCost ||
      !datePurchased ||
      !dateReceived ||
      !status ||
      !location ||
      !department ||
      !serviceRequestId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedEquipment = await updateEquipment(id, {
      quantity,
      description,
      brand,
      serialNumber,
      supplier,
      unitCost,
      totalCost,
      datePurchased: new Date(datePurchased),
      dateReceived: new Date(dateReceived),
      status,
      location,
      department,
      serviceRequestId,
    });

    return NextResponse.json(updatedEquipment, { status: 200 });
  } catch (error) {
    console.error("Error updating equipment:", error);
    return NextResponse.json(
      { error: "Failed to update equipment" },
      { status: 500 }
    );
  }
}