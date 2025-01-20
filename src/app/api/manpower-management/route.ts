import { NextRequest, NextResponse } from "next/server";
import createPersonel from "@/domains/manpower-management/services/createPersonel";

export async function POST(req: NextRequest) {
  const { name, department } = await req.json();
try{
  if (!name || !department) {
    return NextResponse.json(
      { error: `Missing required fields` },
      { status: 400 }
    );
  }

  const newEmployee = await createPersonel(name, department);
  return NextResponse.json(newEmployee, { status: 201 });
}catch (error) {
    console.error(`Error Creating Personel`, error);
    return NextResponse.json(
      { error: `Failed Creating Personel`},
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
      const personnel = await prisma.personnel.findMany();
      return NextResponse.json(personnel, { status: 200 });
    } catch (error) {
      console.error("Error fetching personnel:", error);
      return NextResponse.json(
        { error: "Failed to fetch personnel" },
        { status: 500 }
      );
    }
  }