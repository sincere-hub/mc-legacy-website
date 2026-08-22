import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
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

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const companyName = String(body.companyName ?? "").trim();
    const address = String(body.address ?? "").trim();
    const city = String(body.city ?? "").trim();
    const province = String(body.province ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "Client name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          error: "A valid client email is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingClient = await prisma.client.findFirst({
      where: {
        email,
      },
    });

    if (existingClient) {
      return NextResponse.json(
        {
          error: "A client with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || null,
        companyName: companyName || null,
        address: address || null,
        city: city || null,
        province: province || null,
        notes: notes || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        description: `Created client ${client.name}`,
      },
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