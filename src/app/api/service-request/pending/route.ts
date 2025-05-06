import { NextResponse } from "next/server";
import { getPendingServiceRequests } from "@/domains/service-request/services/getPendingServiceRequests";

export async function GET(): Promise<NextResponse> {
  try {
    const pendingServiceRequests = await getPendingServiceRequests();
    return NextResponse.json(pendingServiceRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending service requests:", error);
    return NextResponse.json(
      { error: "Failed to retrieve pending service requests" },
      { status: 500 }
    );
  }
}
