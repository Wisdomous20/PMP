import { NextRequest, NextResponse } from "next/server";
import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";
import fetchUpdateImplementationPlan from "@/domains/implementation-plan/services/fetchUpdateImplementationPlan";

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
    const implementationPlan = await getImplementationPlans(id);
    if (!implementationPlan) {
      return NextResponse.json(
        { error: "Implementation plan not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(implementationPlan, { status: 200 });
  } catch (error) {
    console.error("Error retrieving implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to retrieve implementation plan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { tasks } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Implementation plan ID is required" },
      { status: 400 }
    );
  }

  if (!tasks) {
    return NextResponse.json(
      { error: "Tasks are required to update implementation plan" },
      { status: 400 }
    );
  }

  try {
    fetchUpdateImplementationPlan(id, tasks);
    return NextResponse.json({ message: "Implementation plan updated" });
  } catch (error) {
    console.error("Error updating implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to update implementation plan" },
      { status: 500 }
    );
  }
}
