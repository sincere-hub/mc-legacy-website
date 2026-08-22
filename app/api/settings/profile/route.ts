import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "Full name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Name is too long.",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User account not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!existingUser.isActive) {
      return NextResponse.json(
        {
          error: "This account is inactive.",
        },
        {
          status: 403,
        },
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },

      data: {
        name,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        description: `Updated profile for ${updatedUser.email}`,
        userId: updatedUser.id,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(
      "PATCH /api/settings/profile error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to update profile.",
      },
      {
        status: 500,
      },
    );
  }
}