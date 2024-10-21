import { NextRequest, NextResponse } from "next/server";
import getServiceRequests from "@/utils/service-request/getServiceRequest";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || null;

  if (!userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const serviceRequests = await getServiceRequests(userId);
    return NextResponse.json(serviceRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json({ error: "Failed to retrieve service requests" }, { status: 500 });
  }
}