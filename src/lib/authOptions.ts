import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {PrismaAdapter} from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          return null;
        }
      
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
      
          if (!user || !user.email) { 
            return null;
          }
      
          const isValid = user.password ? await bcrypt.compare(credentials.password, user.password) : false;
      
          if (!isValid) {
            return null;
          }
      
          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.user_type,
          } as User;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  events: {
    signIn: async (message) => {
      console.log('User signed in:', message);
    },
    signOut: async (message) => {
      console.log('User signed out:', message);
    },
  },
};