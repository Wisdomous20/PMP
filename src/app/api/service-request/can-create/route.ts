import { NextRequest, NextResponse } from "next/server";
import { canCreateServiceRequest } from "@/domains/service-request/services/canCreateServiceRequest";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await canCreateServiceRequest(userId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(
      "Error checking service request creation eligibility:",
      error
    );
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
