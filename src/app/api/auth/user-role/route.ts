import { NextRequest, NextResponse } from "next/server";
import getUserRole from "@/domains/user-management/services/getUserRole";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userRole = await getUserRole(userId);

    return NextResponse.json({ userRole }, { status: 200 });
  } catch (error) {
    console.error(`Error getting user role:`, error);
    return NextResponse.json(
      { error: `Failed to get user role` },
      { status: 500 }
    );
  }
}
