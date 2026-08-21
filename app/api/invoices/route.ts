import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const invoiceInclude = {
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
      status: true,
    },
  },
} as const;

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: invoiceInclude,

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(
      "GET /api/invoices error:",
      error,
    );

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

    const clientId = String(
      body.clientId ?? "",
    ).trim();

    const bookingId = String(
      body.bookingId ?? "",
    ).trim();

    const invoiceNumber = String(
      body.invoiceNumber ?? "",
    ).trim();

    const description = String(
      body.description ?? "",
    ).trim();

    const subtotal = Number(
      body.subtotal ?? 0,
    );

    const tax = Number(
      body.tax ?? 0,
    );

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
          error:
            "Invoice number is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Subtotal must be a valid amount.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Number.isFinite(tax) ||
      tax < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Tax must be a valid amount.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      dueDateValue &&
      Number.isNaN(
        dueDateValue.getTime(),
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid due date.",
        },
        {
          status: 400,
        },
      );
    }

    const existingInvoice =
      await prisma.invoice.findUnique({
        where: {
          invoiceNumber,
        },
      });

    if (existingInvoice) {
      return NextResponse.json(
        {
          error:
            "An invoice with this number already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const client =
      await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });

    if (!client) {
      return NextResponse.json(
        {
          error:
            "Selected client was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (bookingId) {
      const booking =
        await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },
        });

      if (!booking) {
        return NextResponse.json(
          {
            error:
              "Selected booking was not found.",
          },
          {
            status: 404,
          },
        );
      }

      if (
        booking.clientId !== clientId
      ) {
        return NextResponse.json(
          {
            error:
              "Selected booking does not belong to this client.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const total =
      subtotal + tax;

    const invoice =
      await prisma.invoice.create({
        data: {
          invoiceNumber,
          clientId,

          bookingId:
            bookingId || null,

          description:
            description || null,

          subtotal,
          tax,
          total,

          amountPaid: 0,

          currency: "ZAR",

          status: "DRAFT",

          dueDate:
            dueDateValue,
        },

        include: invoiceInclude,
      });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",

        description: `Created invoice ${invoice.invoiceNumber} for ${client.name}`,
      },
    });

    return NextResponse.json(invoice, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/invoices error:",
      error,
    );

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