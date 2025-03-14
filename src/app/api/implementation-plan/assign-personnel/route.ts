/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { implementationPlanId, assignments } = await req.json();

    if (!implementationPlanId) {
      return NextResponse.json(
        { error: "ImplementationPlanId is required" },
        { status: 400 }
      );
    }

    if (!assignments || !Array.isArray(assignments)) {
      return NextResponse.json(
        { error: "A valid assignments array is required" },
        { status: 400 }
      );
    }

    const createdAssignments = await Promise.all(
      assignments.map(async (assignment: {
        task: { name: string; startTime: string; endTime: string };
        personnelId: string;
        assignedAt: string;
      }) => {
        // Find the matching task in the database for this implementation plan
        const dbTask = await prisma.task.findFirst({
          where: {
            implementationPlanId,
            name: assignment.task.name,
            startTime: new Date(assignment.task.startTime),
            endTime: new Date(assignment.task.endTime),
          },
        });

        if (!dbTask) {
          throw new Error(
            `No matching task found for name "${assignment.task.name}" with the provided times in this implementation plan`
          );
        }

        return await prisma.personnelAssignment.create({
          data: {
            task: { connect: { id: dbTask.id } },
            personnel: { connect: { id: assignment.personnelId } },
            assignedAt: new Date(assignment.assignedAt),
          },
        });
      })
    );

    return NextResponse.json({ assignments: createdAssignments }, { status: 200 });
  } catch (error) {
    console.error("Error assigning personnel:", error);
    return NextResponse.json(
      { error: "Failed to assign personnel" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const assignments = await prisma.personnelAssignment.findMany();
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
