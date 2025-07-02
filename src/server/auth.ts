import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { env } from "~/env.mjs";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "~/server/db";
import { v4 as uuidv4 } from 'uuid';

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isGuest?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isGuest?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Required for guest sessions
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: "https://github.com/login/oauth/authorize?scope=user",
    }),
    {
      id: "guest",
      name: "Guest",
      type: "credentials",
      credentials: {},
      async authorize() {
        const uuid = uuidv4();
        const guestUserId = `guest_${uuid}`;
        const guestUser = await prisma.user.upsert({
          where: { id: guestUserId },
          create: {
            id: guestUserId,
            name: `Guest ${uuid.split("-")[0]}`,
            email: null,
            isGuest: true,
          },
          update: {},
        });
        return guestUser;
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isGuest = (user as any).isGuest || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isGuest = token.isGuest as boolean;
      }
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET, // Make sure this is set in your env
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};