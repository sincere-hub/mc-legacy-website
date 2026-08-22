import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
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

    const url = new URL(request.url);

    const summary =
      url.searchParams.get("summary") === "1";

    if (summary) {
      const unreadCount =
        await prisma.notification.count({
          where: {
            userId: session.user.id,
            readAt: null,
          },
        });

      return NextResponse.json({
        unreadCount,
      });
    }

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId: session.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(
      "GET /api/notifications error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load notifications.",
      },
      {
        status: 500,
      },
    );
  }
}

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

    if (body.markAllAsRead === true) {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          readAt: null,
        },

        data: {
          readAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        unreadCount: 0,
      });
    }

    const url = new URL(request.url);

    const id =
      url.searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Notification ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const notification =
      await prisma.notification.findFirst({
        where: {
          id,
          userId: session.user.id,
        },
      });

    if (!notification) {
      return NextResponse.json(
        {
          error: "Notification not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updated =
      await prisma.notification.update({
        where: {
          id,
        },

        data: {
          readAt:
            body.read === false
              ? null
              : new Date(),
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(
      "PATCH /api/notifications error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update notification.",
      },
      {
        status: 500,
      },
    );
  }
}