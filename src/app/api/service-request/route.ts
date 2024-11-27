import { NextRequest, NextResponse } from "next/server";
import createServiceRequest from "@/domains/service-request/services/createServiceRequest";
import getServiceRequests from "@/domains/service-request/services/getServiceRequest";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, title, details } = await req.json();

    if (!userId || !title || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newServiceRequest = await createServiceRequest(
      userId,
      title,
      details
    );

    return NextResponse.json(newServiceRequest, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to create service request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || null;

  if (!userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const serviceRequests = await getServiceRequests(userId);
    return NextResponse.json(serviceRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service requests" },
      { status: 500 }
    );
  }
}
