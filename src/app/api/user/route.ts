import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove a user by email
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

// GET: Fetch all users
export async function GET(): Promise<NextResponse> {
  try {
    const users = await prisma.user.findMany();
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
