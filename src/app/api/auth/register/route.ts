import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { firstName, lastName, email, password, cellphoneNumber, localNumber, department } = await req.json();

    const userExist = await prisma.user.findUnique({
      where: { email: email },
    })

    if(userExist) {
      return NextResponse.json(
        {error: 'Email already exists'},
        {status: 400}
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        user_type:"USER",
        password: hashedPassword,
        cellphoneNumber,
        localNumber,
        department
      },
    });

    console.log(newUser)

    return NextResponse.json(
      { message: "User registered successfully", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}