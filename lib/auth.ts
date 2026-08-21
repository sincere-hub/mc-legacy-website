import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

        portalRole: {
          label: "Portal Role",
          type: "text",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.portalRole
        ) {
          return null;
        }

        const email = String(credentials.email)
          .trim()
          .toLowerCase();

        const password = String(
          credentials.password,
        );

        const requestedRole = String(
          credentials.portalRole,
        ).toUpperCase();

        if (
          requestedRole !== "ADMIN" &&
          requestedRole !== "STAFF"
        ) {
          return null;
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email,
            },
          });

        if (!user) {
          return null;
        }

        if (!user.isActive) {
          return null;
        }

        if (
          user.role !== "ADMIN" &&
          user.role !== "STAFF"
        ) {
          return null;
        }

        // The selected portal must match
        // the user's real DB role.
        if (user.role !== requestedRole) {
          return null;
        }

        const passwordValid =
          await bcrypt.compare(
            password,
            user.passwordHash,
          );

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.role =
          token.role as
            | "ADMIN"
            | "STAFF";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};