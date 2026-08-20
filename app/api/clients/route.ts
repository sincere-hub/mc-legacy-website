import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("GET /api/clients error:", error);

    return NextResponse.json(
      {
        error: "Failed to load clients.",
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

    const {
      name,
      email,
      phone,
      companyName,
      address,
      city,
      province,
      notes,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          error: "Name and email are required.",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
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

    const client = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: String(name).trim(),
          email: normalizedEmail,
          phone: phone ? String(phone).trim() : null,

          // Temporary value for clients created by an administrator.
          // Replace this with your real authentication/password flow later.
          passwordHash: "",
          role: "CLIENT",
          isActive: true,
        },
      });

      return tx.client.create({
        data: {
          userId: user.id,
          companyName: companyName
            ? String(companyName).trim()
            : null,
          address: address ? String(address).trim() : null,
          city: city ? String(city).trim() : null,
          province: province ? String(province).trim() : null,
          notes: notes ? String(notes).trim() : null,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              isActive: true,
            },
          },
        },
      });
    });

    return NextResponse.json(client, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/clients error:", error);

    return NextResponse.json(
      {
        error: "Failed to create client.",
      },
      {
        status: 500,
      },
    );
  }
}