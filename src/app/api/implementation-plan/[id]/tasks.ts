import { NextRequest, NextResponse } from "next/server";
import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  console.log("API called with serviceRequestId:", id);

  if (!id) {
    return NextResponse.json(
      { error: "Implementation plan ID is required" },
      { status: 400 }
    );
  }

  try {
    const tasks = await getImplementationPlans(id);
    console.log("Tasks fetched:", tasks);

    if (!tasks) {
      return NextResponse.json(
        { error: "No tasks found for the given implementation plan ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}