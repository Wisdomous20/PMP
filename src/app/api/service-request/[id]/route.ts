import { NextRequest, NextResponse } from "next/server";
import getServiceRequestById from "@/domains/service-request/services/getServiceRequestById";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Service request ID is required" },
      { status: 400 }
    );
  }

  try {
    const serviceRequest = await getServiceRequestById(id);
    return NextResponse.json(serviceRequest, { status: 200 });
  } catch (error) {
    console.error("Error fetching service request:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service request" },
      { status: 500 }
    );
  }
}


