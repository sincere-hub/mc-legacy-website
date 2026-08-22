import { notifyPortalUsers } from "@/lib/notifications";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateReference() {
  const shortId = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `BK-${new Date().getFullYear()}-${shortId}`;
}

async function createUniqueReference() {
  let reference = generateReference();

  while (
    await prisma.booking.findUnique({
      where: {
        reference,
      },
    })
  ) {
    reference = generateReference();
  }

  return reference;
}

/**
 * POST /api/bookings/public
 *
 * Public customers can submit booking requests.
 *
 * Customers DO NOT receive user accounts.
 *
 * Existing clients are matched using email.
 * If no client exists, a Client record is created.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const phone = String(body.phone ?? "").trim();

    const service = String(body.service ?? "").trim();

    const eventType = String(body.eventType ?? "").trim();

    const eventDateValue = String(body.eventDate ?? "").trim();

    const location = String(body.location ?? "").trim();

    const message = String(body.message ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "Full name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          error: "A valid email address is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          error: "Phone number is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!service) {
      return NextResponse.json(
        {
          error: "Please select a service.",
        },
        {
          status: 400,
        },
      );
    }

    if (!eventType) {
      return NextResponse.json(
        {
          error: "Event or project type is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!location) {
      return NextResponse.json(
        {
          error: "Location is required.",
        },
        {
          status: 400,
        },
      );
    }

    let eventDate: Date | null = null;

    if (eventDateValue) {
      eventDate = new Date(`${eventDateValue}T12:00:00`);

      if (Number.isNaN(eventDate.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid event date.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const reference = await createUniqueReference();

    const booking = await prisma.$transaction(async (tx) => {
      /**
       * Customers are CLIENTS only.
       * They are not authentication USERS.
       */
      let client = await tx.client.findFirst({
        where: {
          email,
        },
      });

      if (!client) {
        client = await tx.client.create({
          data: {
            name,
            email,
            phone: phone || null,
          },
        });
      } else {
        /**
         * Keep existing client information,
         * but fill missing values when possible.
         */
        client = await tx.client.update({
          where: {
            id: client.id,
          },
          data: {
            name: client.name || name,
            phone: client.phone || phone || null,
          },
        });
      }

      const createdBooking = await tx.booking.create({
        data: {
          reference,

          clientId: client.id,

          service,

          eventType,

          eventDate,

          location,

          notes: message || null,

          status: "NEW",
        },

        include: {
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
        },
      });

      await tx.activityLog.create({
        data: {
          action: "CREATE",

          description: `Public booking ${createdBooking.reference} submitted by ${name}`,
        },
      });

      return createdBooking;
    });

    return NextResponse.json(
      {
        id: booking.id,
        reference: booking.reference,
        status: booking.status,

        client: booking.client,

        message:
          "Booking request submitted successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/bookings/public error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to submit booking request.",
      },
      {
        status: 500,
      },
    );
  }
}