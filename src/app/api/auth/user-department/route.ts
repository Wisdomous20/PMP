import { NextRequest, NextResponse } from "next/server";
import getUserDepartment from "@/domains/user-management/services/getUserDepartment";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const department = await getUserDepartment(userId);
    return NextResponse.json(
      { department },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user department:", error);
    return NextResponse.json(
      { error: "Failed to get user department" },
      { status: 500 }
    );
  }
}