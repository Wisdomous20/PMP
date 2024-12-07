/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import getSupervisors from "@/domains/user-management/services/getSupervisors";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const supervisors = await getSupervisors();
    return NextResponse.json(supervisors, { status: 200 });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return NextResponse.json(
      { error: "Failed to retrieve supervisors" },
      { status: 500 }
    );
  }
}
