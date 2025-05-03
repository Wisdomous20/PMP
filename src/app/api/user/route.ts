import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import updateUserRole from "@/domains/user-management/services/updateUserRole";

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await req.json();

    const userExist = await prisma.user.findUnique({
      where: { email: email },
    })

    if(!userExist) {
      return NextResponse.json(
        {error: 'Email does not exists'},
        {status: 400}
      )
    }

    await prisma.user.delete({ where: { email: email } });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "An error occurred when deleting user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserRole(userId, newRole);

    return NextResponse.json(
      { message: "User role updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
