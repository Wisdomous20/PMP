import { NextRequest, NextResponse } from "next/server";
import addRejectedStatus from "@/utils/service-request/status/addRejectedStatus";

export async function POST(req: NextRequest) {
  const { serviceRequestId, note } = await req.json();

  if (!serviceRequestId) {
    return NextResponse.json({ error: "Service request ID is required" }, { status: 400 });
  }

  try {
    const status = await addRejectedStatus(serviceRequestId, note)

    return NextResponse.json({ message: `Rejected status added successfully`, status }, { status: 200 });
  } catch (error) {
    console.error(`Error adding rejected status:`, error);
    return NextResponse.json({ error: `Failed to add rejected status` }, { status: 500 });
  }
}
