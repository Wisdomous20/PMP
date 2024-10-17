import { NextRequest, NextResponse } from "next/server";
import createServiceRequest from "@/utils/service-request/createServiceRequest";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, title, details } = await req.json();

    if (!userId || !title || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newServiceRequest = await createServiceRequest(userId, title, details);

    return NextResponse.json(newServiceRequest, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}
