import { NextRequest, NextResponse } from "next/server";
import getServiceRequestById from "@/utils/service-request/getServiceRequestById";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Service request ID is required" }, { status: 400 });
  }

  try {
    const serviceRequest = await getServiceRequestById(id);
    return NextResponse.json(serviceRequest, { status: 200 });
  } catch (error) {
    console.error("Error fetching service request:", error);
    return NextResponse.json({ error: "Failed to retrieve service request" }, { status: 500 });
  }
}