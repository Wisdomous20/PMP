import { NextRequest, NextResponse } from "next/server";
import getEquipmentById from "@/domains/equipment-management/services/getEquipmentById";

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