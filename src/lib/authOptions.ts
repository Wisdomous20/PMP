import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/lib/database/client";
import { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const user = await client.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Email not found");
        }

        const isValid = user.password
          ? await bcrypt.compare(credentials.password, user.password)
          : false;
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.user_type,
          department: user.department,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Fetch roles and department
      const user = await client.user.findUnique({
        where: { id: token.id as string },
        select: {
          user_type: true,
          department: true,
        },
      });

      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.role = user?.user_type ?? "";
      session.user.department = user?.department ?? "";

      return session;
    },
  },
  events: {},
};
