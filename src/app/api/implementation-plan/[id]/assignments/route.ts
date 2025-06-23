import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const { id } = params;
  const includeAssignments = req.nextUrl.searchParams.get('include') === 'assignments';

  if (!id) {
    return NextResponse.json(
      { error: "Implementation plan ID is required" },
      { status: 400 }
    );
  }

  try {
    const implementationPlan = await prisma.implementationPlan.findUnique({
      where: { serviceRequestId: id },
      include: {
        tasks: {
          include: {
            assignments: includeAssignments ? {
              include: { personnel: true }
            } : false
          }
        }
      }
    });

    if (!implementationPlan) {
      return NextResponse.json(
        { error: "No implementation plan found for the given service request ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(implementationPlan, { status: 200 });
  } catch (error) {
    console.error("Error fetching implementation plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch implementation plan" },
      { status: 500 }
    );
  }
}