import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departmentsData = await prisma.equipment.findMany({
      distinct: ["department"],
      select: {
        department: true,
      },
    });
    const departments = departmentsData
      .map((item) => item.department)
      .filter(Boolean)
      .sort();
    
    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}