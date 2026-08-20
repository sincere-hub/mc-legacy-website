import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        client: {
          include: {
            user: true,
          },
        },
        booking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("GET /api/contracts error:", error);

    return NextResponse.json(
      { error: "Failed to load contracts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      clientId,
      status,
      expiresAt,
    } = body;

    if (!title || !clientId) {
      return NextResponse.json(
        {
          error: "Contract title and client are required",
        },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    const reference = `CON-${Date.now()}`;

    const contract = await prisma.contract.create({
      data: {
        title,
        reference,
        clientId,
        status: status || "DRAFT",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("POST /api/contracts error:", error);

    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}