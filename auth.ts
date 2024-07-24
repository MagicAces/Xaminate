import type { NextAuthConfig, DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import prisma from "./prisma/prisma";
import { loginSchema } from "@/lib/schema";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      firstName: string | null;
      lastName: string | null;
      emailAlerts: boolean | null;
    } & DefaultSession["user"];
  }
}

interface User {
  id?: string;
  email?: string;
  password?: string;
  emailAlerts?: boolean;
  firstName?: string;
  lastName?: string;
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await prisma.examsOfficer.findUnique({
      where: {
        email: String(email),
      },
    });
    return {
      id: user?.id.toString(),
      password: user?.password,
      email: user?.email,
      firstName: user?.first_name,
      lastName: user?.last_name,
      emailAlerts: user?.email_alerts,
    };
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

const credentialsConfig = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: {},
    password: {},
  },
  async authorize(credentials) {
    const result = loginSchema.safeParse(credentials);

    if (!result.success) return null;

    if (result.success) {
      const { email, password } = result.data;
      const user = await getUser(email);

      if (!user) return null;
      const passwordsMatch = await compare(password, String(user.password));

      if (passwordsMatch) return user;
    }

    return null;
  },
});

const config = {
  ...authConfig,
  providers: [credentialsConfig],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }

      if (trigger === "update" && session?.emailAlerts !== null) {
        return {
          ...token,
          emailAlerts: session.emailAlerts,
        };
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          emailAlerts: token.emailAlerts as boolean,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth(config);
