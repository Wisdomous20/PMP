import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import updateUser from "@/domains/user-management/services/updateUser";

export async function GET(): Promise<NextResponse> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "desc", // Sort with latest user first
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await req.json();

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExist) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { email } });

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
    const { userId, newRole, pendingLimit } = await req.json();
    if (!userId || !newRole || pendingLimit == null) {
      return NextResponse.json({ error: "User ID, new role, and pendingLimit are required" }, { status: 400 });
    }
    const updated = await updateUser(userId, newRole, pendingLimit);
    return NextResponse.json({ message: "User updated successfully", user: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}