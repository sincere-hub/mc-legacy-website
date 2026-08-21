import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const contractInclude = {
  client: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      city: true,
      province: true,
    },
  },

  booking: {
    select: {
      id: true,
      reference: true,
      service: true,
      eventType: true,
      status: true,
    },
  },
} as const;

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: contractInclude,

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("GET /api/contracts error:", error);

    return NextResponse.json(
      {
        error: "Failed to load contracts.",
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

    const title = String(body.title ?? "").trim();
    const clientId = String(body.clientId ?? "").trim();

    const status = String(
      body.status ?? "DRAFT",
    ).trim();

    const expiresAtValue = String(
      body.expiresAt ?? "",
    ).trim();

    if (!title) {
      return NextResponse.json(
        {
          error: "Contract title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!clientId) {
      return NextResponse.json(
        {
          error: "Please select a client.",
        },
        {
          status: 400,
        },
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
          error: "Selected client was not found.",
        },
        {
          status: 404,
        },
      );
    }

    let expiresAt: Date | null = null;

    if (expiresAtValue) {
      expiresAt = new Date(expiresAtValue);

      if (Number.isNaN(expiresAt.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid contract expiry date.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const reference = `CON-${Date.now()}`;

    const contract = await prisma.contract.create({
      data: {
        title,
        reference,
        clientId,
        status: status as
          | "DRAFT"
          | "SENT"
          | "SIGNED"
          | "EXPIRED"
          | "CANCELLED",
        expiresAt,
      },

      include: contractInclude,
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        description: `Created contract ${contract.reference} for ${client.name}`,
      },
    });

    return NextResponse.json(contract, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/contracts error:", error);

    return NextResponse.json(
      {
        error: "Failed to create contract.",
      },
      {
        status: 500,
      },
    );
  }
}