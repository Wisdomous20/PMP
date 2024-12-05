
import { NextRequest, NextResponse } from "next/server";
import getImplementationPlanById from "@/domains/implementation-plan/services/getImplementationPlanById"; // Import the service to get an implementation plan by ID

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { error: "Implementation plan ID is required" },
            { status: 400 }
        );
    }

    try {
        const implementationPlan = await getImplementationPlanById(id);
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