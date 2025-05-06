import { NextRequest, NextResponse } from "next/server";
import CreateImplementationPlan from "@/domains/implementation-plan/services/CreateImplementationPlan";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {serviceRequestId, tasks} = await req.json();
    if (!tasks) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newImplementationPlan = await CreateImplementationPlan(serviceRequestId, tasks);
    
    return NextResponse.json(newImplementationPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to create implementation plan" },
      { status: 500 }
    );
  }
}