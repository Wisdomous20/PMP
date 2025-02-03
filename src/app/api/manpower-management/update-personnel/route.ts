import { NextRequest, NextResponse } from "next/server";
import updatePersonnel from "@/domains/manpower-management/service/updatePersonnel"; 

export async function PUT(req: NextRequest) {
    const { id, name, department,position } = await req.json();

    try {
  
      if (!id || !name || !department || !position) {
        return NextResponse.json(
          { error: "ID, name, and department are required" },
          { status: 400 }
        );
      }
      const updatedPersonnel = await updatePersonnel(id, name, department, position);
      return NextResponse.json(updatedPersonnel, { status: 200 });
    } catch (error) {
      console.error("Error updating personnel:", error);
      return NextResponse.json(
        { error: "Failed to update personnel" },
        { status: 500 }
      );
    }
  }