import { NextRequest, NextResponse } from "next/server";
import getPersonnelAssignmentsByImplementationPlanId from "@/domains/personnel-management/service/GetPersonnelAssignmentByImplementationPlanId";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
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