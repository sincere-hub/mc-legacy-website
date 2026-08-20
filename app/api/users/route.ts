import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            city: true,
            province: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        error: "Failed to load users.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const role = String(body.role ?? "CLIENT").trim();
    const passwordHash = String(body.passwordHash ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    if (!passwordHash) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 },
      );
    }

    if (!["ADMIN", "STAFF", "CLIENT"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid user role." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "A user with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: role as "ADMIN" | "STAFF" | "CLIENT",
        isActive: true,
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            city: true,
            province: true,
          },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        description: `Created user ${user.name ?? user.email}`,
        userId: user.id,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/users error:", error);

    return NextResponse.json(
      {
        error: "Failed to create user.",
      },
      {
        status: 500,
      },
    );
  }
}