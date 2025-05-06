import { NextResponse } from "next/server";
import { getImplementationPlansInProgress } from "@/domains/implementation-plan/services/getImplementationPlansInProgress";

export async function GET(): Promise<NextResponse> {
  try {
    const newImplementationPlan = await getImplementationPlansInProgress();
    return NextResponse.json(newImplementationPlan, { status: 201 });
  } catch (error) {
    console.error("Error getting implementation plans:", error);
    return NextResponse.json(
      { error: "Failed to get implementation plans" },
      { status: 500 }
    );
  }
}