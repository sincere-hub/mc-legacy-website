import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "STAFF" | "CLIENT";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "STAFF" | "CLIENT";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "STAFF" | "CLIENT";
  }
}