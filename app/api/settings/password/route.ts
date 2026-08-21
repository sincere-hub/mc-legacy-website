import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

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

    const currentPassword = String(
      body.currentPassword ?? "",
    );

    const newPassword = String(
      body.newPassword ?? "",
    );

    if (!currentPassword) {
      return NextResponse.json(
        {
          error: "Current password is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          error: "New password is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "New password must contain at least 8 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (newPassword.length > 128) {
      return NextResponse.json(
        {
          error: "New password is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          error:
            "New password must be different from your current password.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User account not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          error: "This account is inactive.",
        },
        {
          status: 403,
        },
      );
    }

    const currentPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );

    if (!currentPasswordValid) {
      return NextResponse.json(
        {
          error: "Current password is incorrect.",
        },
        {
          status: 400,
        },
      );
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      12,
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        description: `Password changed for ${user.email}`,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "PATCH /api/settings/password error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to change password.",
      },
      {
        status: 500,
      },
    );
  }
}