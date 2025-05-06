import { NextRequest, NextResponse } from "next/server";
import getEquipmentById from "@/domains/inventory-management/services/getEquipmentById";
import updateEquipment from "@/domains/inventory-management/services/updateEquipment";
import { deleteEquipmentById } from "@/domains/inventory-management/services/deleteEquipmentById";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Equipment ID is required" },
        { status: 400 }
      );
    }

    const equipment = await getEquipmentById(params.id);

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
      !department 
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteEquipmentById(params.id);
    return NextResponse.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json(
      { error: "Failed to delete equipment" },
      { status: 500 }
    );
  }
}