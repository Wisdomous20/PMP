import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: User;
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    // TODO: Why do we need this?
    hashPassword?: string;
    role: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
