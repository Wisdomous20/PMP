"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return {
        error: "Email not found. Please register first",
        status: 404
      }
    }

    if (user.password !== password) {
      return {
        error: "Invalid email or password",
        status: 401
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        error: "Invalid email or password",
        status: 401
      }
    }

    return {
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      status: 200
    }

  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "An error occurred during login",
      status: 500
    }
  }
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  cellphoneNumber: string,
  department: string,
  localNumber?: string,
) {
  try {

    const userExist = await prisma.user.findUnique({
      where: { email: email },
    })

    if (userExist) {
      return {
        error: 'Email already exists',
        status: 400
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        user_type: "USER",
        password: hashedPassword,
        cellphoneNumber: cellphoneNumber,
        localNumber,
        department
      },
    });

    return {
      message: "User registered successfully", newUser,
      status: 201
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "An error occurred during registration",
      status: 500
    }
  } finally {
    await prisma.$disconnect();
  }
}