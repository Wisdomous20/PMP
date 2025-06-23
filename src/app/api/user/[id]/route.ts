import { NextRequest, NextResponse } from "next/server";
import deleteUser from "@/domains/user-management/services/deleteUser";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await deleteUser(id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}