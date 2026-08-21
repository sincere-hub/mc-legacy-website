import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    // Extra protection for ADMIN-only route
    if (
      pathname.startsWith("/users") &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url),
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return Boolean(token);
      },
    },

    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/users/:path*",
    "/enquiries/:path*",
    "/bookings/:path*",
    "/files/:path*",
    "/contracts/:path*",
    "/invoices/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/activity/:path*",
    "/members/:path*",
    "/settings/:path*",
  ],
};