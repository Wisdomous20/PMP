import { NextRequest, NextResponse } from "next/server";
import addCompletedStatus from "@/domains/service-request/services/status/addCompletedStatus";

export async function POST(req: NextRequest) {
  try {
    const { serviceRequestId } = await req.json();

    if (!serviceRequestId) {
      return NextResponse.json(
        { error: "Service request ID is required" },
        { status: 400 }
      );
    }

    const status = await addCompletedStatus(serviceRequestId);

    return NextResponse.json(
      { message: "Completed status added successfully", status },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding completed status:", error);
    return NextResponse.json(
      { error: "Failed to add completed status" },
      { status: 500 }
    );
  }
}
