import { NextRequest, NextResponse } from "next/server";
import updateImplementationPlan from "@/domains/implementation-plan/services/updateImplementationPlan";
import updateImplementationPlanStatus from "@/domains/implementation-plan/services/updateImplementationPlanStatus";
import getImplementationPlanByServiceRequestId from "@/domains/implementation-plan/services/getImplementationPlanByServiceRequestId";
import getServiceRequestById from "@/domains/service-request/services/getServiceRequestById";
import { sendServiceRequestCompletedEmail } from "@/domains/notification/services/sendServiceRequestCompleteEmail";

import { ServerImplementationPlan } from "@/domains/implementation-plan/services/updateImplementationPlan";

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
    const tasks = await getImplementationPlanByServiceRequestId(id);

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

export async function PUT(
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
    const updatedPlan: ServerImplementationPlan | null = await updateImplementationPlan(id, tasks);

    if (!updatedPlan) {
      return NextResponse.json(
        { error: "Failed to update implementation plan" },
        { status: 500 }
      );
    }
    return NextResponse.json(updatedPlan, { status: 200 });
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
      return NextResponse.json(
        { error: "Implementation plan ID and status are required" },
        { status: 400 }
      );
    }

    const updatedPlan = await updateImplementationPlanStatus(id, status);
    if (!updatedPlan) {
      return NextResponse.json(
        { error: "Failed to update implementation plan status" },
        { status: 500 }
      );
    }

    if (status === "completed") {
      const serviceRequest = await getServiceRequestById(id);
      if (serviceRequest && serviceRequest.user && serviceRequest.user) {
        await sendServiceRequestCompletedEmail({
          to: serviceRequest.user.email,
          userName: `${serviceRequest.user.firstName} ${serviceRequest.user.lastName}`,
          concern: serviceRequest.concern,
          details: serviceRequest.details,
          requestId: id,
        });
      }
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