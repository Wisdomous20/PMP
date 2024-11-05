import { NextRequest, NextResponse } from "next/server";
import addApprovedStatus from "@/utils/service-request/status/addApprovedStatus";

export async function POST(req: NextRequest) {
  const { serviceRequestId } = await req.json();

  if (!serviceRequestId) {
    return NextResponse.json({ error: "Service request ID is required" }, { status: 400 });
  }

  try {
    const status = await addApprovedStatus(serviceRequestId)

    return NextResponse.json({ message: `Approved status added successfully`, status }, { status: 200 });
  } catch (error) {
    console.error(`Error adding approved status:`, error);
    return NextResponse.json({ error: `Failed to add approved status` }, { status: 500 });
  }
}