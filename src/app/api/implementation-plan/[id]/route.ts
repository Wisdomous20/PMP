import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react"; // Importing getSession to retrieve user import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";
import updateImplementationPlan from "@/domains/implementation-plan/services/updateImplementationPlan";
import updateImplementationPlanStatus from "@/domains/implementation-plan/services/updateImplementationPlanStatus";   

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
    const implementationPlan = await getImplementationPlans(session.user.id); // Pass the user ID from session

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { tasks } = await req.json();

  console.log("tasks", tasks);
  console.log("ok")

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
    updateImplementationPlan(id, tasks);
    return NextResponse.json({ message: "Implementation plan updated" });
  } catch (error) {
    console.error("Error updating implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to update implementation plan" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      console.error('Missing required fields:', { id, status });
      return NextResponse.json(
        { error: "Implementation plan ID and status are required" },
        { status: 400 }
      );
    }

    const updatedPlan = await updateImplementationPlanStatus(id, status);

    if (!updatedPlan) {
      console.error('Update failed - no plan returned');
      return NextResponse.json(
        { error: "Failed to update implementation plan" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPlan, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return NextResponse.json(
      { error: "Failed to update implementation plan status", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
