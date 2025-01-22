import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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