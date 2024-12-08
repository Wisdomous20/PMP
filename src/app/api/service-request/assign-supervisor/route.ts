import { NextRequest, NextResponse } from "next/server";
import assignSupervisor from "@/domains/service-request/services/assignSupervisor";

export async function POST(req: NextRequest) {
  const { serviceRequestId, supervisorId } = await req.json();

  if (!serviceRequestId) {
    return NextResponse.json(
      { error: "Service request ID is required" },
      { status: 400 }
    );
  }

  try {
    const status = await assignSupervisor(serviceRequestId, supervisorId);

    return NextResponse.json(
      { message: `Assigned supervisor successfully`, status },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error assigning supervisor:`, error);
    return NextResponse.json(
      { error: `Failed to assign supervisor` },
      { status: 500 }
    );
  }
}
