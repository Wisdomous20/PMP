import { NextRequest, NextResponse } from "next/server";
import CreateImplementationPlan from "@/domains/implementation-plan/services/CreateImplementationPlan";
import getImplementationPlan from "@/domains/implementation-plan/services/getImplementationPlan";


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, description, status, tasks, files } = await req.json();
    if (!id || !description || !status || !tasks || !files) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newImplementationPlan = await CreateImplementationPlan(id, description, status, tasks, files);
    return NextResponse.json(newImplementationPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to create implementation plan" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { error: "Implementation plan ID is required" },
      { status: 400 }
    );
  }
  try {
    const implementationPlan = await getImplementationPlan(id);
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