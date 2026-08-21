import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTATION_SENT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const validStatuses: BookingStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTATION_SENT",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function generateBookingReference() {
  const shortId = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `BK-${new Date().getFullYear()}-${shortId}`;
}

async function createUniqueBookingReference() {
  let reference = generateBookingReference();

  while (
    await prisma.booking.findUnique({
      where: {
        reference,
      },
    })
  ) {
    reference = generateBookingReference();
  }

  return reference;
}

const bookingInclude = {
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

  enquiry: {
    select: {
      id: true,
      reference: true,
      name: true,
      email: true,
      phone: true,
    },
  },

  _count: {
    select: {
      files: true,
      contracts: true,
      invoices: true,
      messages: true,
    },
  },
} as const;

/**
 * GET /api/bookings
 *
 * Returns all bookings for the management dashboard.
 */
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: bookingInclude,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);

    return NextResponse.json(
      {
        error: "Failed to load bookings.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/bookings
 *
 * Converts a confirmed enquiry into a booking.
 *
 * Customers are stored as Client records only.
 * No User account is created.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const enquiryId = String(body.enquiryId ?? "").trim();

    if (!enquiryId) {
      return NextResponse.json(
        {
          error: "Enquiry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: {
        id: enquiryId,
      },

      include: {
        client: true,
        booking: true,
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        {
          error: "Enquiry not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (enquiry.booking) {
      return NextResponse.json(
        {
          error: "This enquiry has already been converted to a booking.",
        },
        {
          status: 409,
        },
      );
    }

    if (enquiry.status !== "CONFIRMED") {
      return NextResponse.json(
        {
          error:
            "The enquiry must be confirmed before it can be converted to a booking.",
        },
        {
          status: 400,
        },
      );
    }

    const reference = await createUniqueBookingReference();

    const booking = await prisma.$transaction(async (tx) => {
      let clientId = enquiry.clientId;

      if (!clientId) {
        let client = await tx.client.findFirst({
          where: {
            email: enquiry.email,
          },
        });

        if (!client) {
          client = await tx.client.create({
            data: {
              name: enquiry.name,
              email: enquiry.email,
              phone: enquiry.phone || null,
            },
          });
        } else {
          client = await tx.client.update({
            where: {
              id: client.id,
            },
            data: {
              name: client.name || enquiry.name,
              phone: client.phone || enquiry.phone || null,
            },
          });
        }

        clientId = client.id;

        await tx.enquiry.update({
          where: {
            id: enquiry.id,
          },

          data: {
            clientId,
          },
        });
      }

      const createdBooking = await tx.booking.create({
        data: {
          reference,
          clientId,
          enquiryId: enquiry.id,
          service: enquiry.service,
          eventType: enquiry.eventType,
          eventDate: enquiry.eventDate,
          location: enquiry.location,
          notes: enquiry.message,
          status: "CONFIRMED",
        },

        include: bookingInclude,
      });

      await tx.activityLog.create({
        data: {
          action: "CREATE",

          description: `Booking ${createdBooking.reference} created from enquiry ${enquiry.reference}`,
        },
      });

      return createdBooking;
    });

    return NextResponse.json(booking, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/bookings error:", error);

    return NextResponse.json(
      {
        error: "Failed to convert enquiry to booking.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * PATCH /api/bookings
 *
 * Updates booking status.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "").trim();

    const status = String(body.status ?? "")
      .trim()
      .toUpperCase() as BookingStatus;

    if (!id) {
      return NextResponse.json(
        {
          error: "Booking ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid booking status.",
        },
        {
          status: 400,
        },
      );
    }

    const existing = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Booking not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (existing.status === status) {
      const booking = await prisma.booking.findUnique({
        where: {
          id,
        },

        include: bookingInclude,
      });

      return NextResponse.json(booking);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: {
          id,
        },

        data: {
          status,
        },

        include: bookingInclude,
      });

      await tx.activityLog.create({
        data: {
          action: "STATUS_CHANGE",

          description: `Booking ${booking.reference} changed from ${existing.status} to ${booking.status}`,
        },
      });

      return booking;
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/bookings error:", error);

    return NextResponse.json(
      {
        error: "Failed to update booking.",
      },
      {
        status: 500,
      },
    );
  }
}