import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("GET /api/invoices:", error);

    return NextResponse.json(
      {
        error: "Failed to load invoices.",
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

    const clientId = String(body.clientId ?? "").trim();
    const invoiceNumber = String(body.invoiceNumber ?? "").trim();
    const description = String(body.description ?? "").trim();

    const subtotal = Number(body.subtotal ?? 0);
    const tax = Number(body.tax ?? 0);

    const dueDateValue = body.dueDate
      ? new Date(body.dueDate)
      : null;

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

    if (!invoiceNumber) {
      return NextResponse.json(
        {
          error: "Invoice number is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json(
        {
          error: "Subtotal must be a valid amount.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(tax) || tax < 0) {
      return NextResponse.json(
        {
          error: "Tax must be a valid amount.",
        },
        {
          status: 400,
        },
      );
    }

    if (dueDateValue && Number.isNaN(dueDateValue.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid due date.",
        },
        {
          status: 400,
        },
      );
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        invoiceNumber,
      },
    });

    if (existingInvoice) {
      return NextResponse.json(
        {
          error: "An invoice with this number already exists.",
        },
        {
          status: 409,
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

    const total = subtotal + tax;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        description: description || null,

        subtotal,
        tax,
        total,
        amountPaid: 0,

        currency: "ZAR",

        status: "DRAFT",

        dueDate: dueDateValue,
      },

      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(invoice, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/invoices:", error);

    return NextResponse.json(
      {
        error: "Failed to create invoice.",
      },
      {
        status: 500,
      },
    );
  }
}