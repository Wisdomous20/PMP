import { NextRequest, NextResponse } from "next/server";
import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const implementationPlans = await getImplementationPlans(id);

    if (!implementationPlans) {
      return NextResponse.json(
        { error: "Implementation plan not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(implementationPlans, { status: 200 });
  } catch (error) {
    console.error("Error retrieving implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to retrieve implementation plan" },
      { status: 500 }
    );
  }
}