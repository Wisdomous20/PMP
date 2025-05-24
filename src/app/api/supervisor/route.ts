import { NextRequest, NextResponse } from "next/server";
import getSupervisors from "@/domains/user-management/services/getSupervisors";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const supervisors = await getSupervisors();
    return NextResponse.json(supervisors, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return NextResponse.json(
      { error: "Failed to retrieve supervisors" },
      { status: 500 }
    );
  }
}
