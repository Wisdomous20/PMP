import { NextRequest, NextResponse } from "next/server";
import getPersonnelAssignmentsByImplementationPlanId from "@/domains/personnel-management/service/GetPersonnelAssignmentByImplementationPlanId";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Implementation plan ID is required" },
      { status: 400 }
    );
  }

  try {
    const personnelAssignments = await getPersonnelAssignmentsByImplementationPlanId(id);

    if (!personnelAssignments) {
      return NextResponse.json(
        { error: "Personnel assignments not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(personnelAssignments, { status: 200 });
  } catch (error) {
    console.error("Error retrieving personnel assignments:", error);
    return NextResponse.json(
      { error: "Failed to retrieve personnel assignments" },
      { status: 500 }
    );
  }
}