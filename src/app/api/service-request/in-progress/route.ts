import { NextRequest, NextResponse } from "next/server";
import addInProgressStatus from "@/domains/service-request/services/status/addInProgressStatus";

export async function POST(req: NextRequest) {
  const { serviceRequestId, note } = await req.json();

  if (!serviceRequestId) {
    return NextResponse.json(
      { error: "Service request ID is required" },
      { status: 400 }
    );
  }

  try {
    const status = await addInProgressStatus(serviceRequestId, note);

    return NextResponse.json(
      { message: `In progress status added successfully`, status },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error adding in progress status:`, error);
    return NextResponse.json(
      { error: `Failed to add in progress status` },
      { status: 500 }
    );
  }
}
