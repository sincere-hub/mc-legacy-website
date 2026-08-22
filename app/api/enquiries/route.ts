import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyPortalUsers } from "@/lib/notifications";
import crypto from "crypto";

type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTATION_SENT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const validStatuses: EnquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTATION_SENT",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const enquiryInclude = {
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
      status: true,
    },
  },
} as const;

function generateReference() {
  const shortId = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `MC-${new Date().getFullYear()}-${shortId}`;
}

async function createUniqueReference() {
  let reference = generateReference();

  while (
    await prisma.enquiry.findUnique({
      where: {
        reference,
      },
    })
  ) {
    reference = generateReference();
  }

  return reference;
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: enquiryInclude,
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error(
      "GET /api/enquiries error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load enquiries.",
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

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const phone = String(body.phone ?? "").trim();

    const service = String(body.service ?? "").trim();

    const eventType = String(body.eventType ?? "").trim();

    const location = String(body.location ?? "").trim();

    const message = String(body.message ?? "").trim();

    const eventDateValue = String(
      body.eventDate ?? "",
    ).trim();

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
          error:
            "Please provide a valid email address.",
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
          error: "Event type is required.",
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

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        },
      );
    }

    let eventDate: Date | null = null;

    if (eventDateValue) {
      eventDate = new Date(
        `${eventDateValue}T12:00:00`,
      );

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

    const reference =
      await createUniqueReference();

    const enquiry =
      await prisma.enquiry.create({
        data: {
          reference,
          name,
          email,
          phone,
          service,
          eventType,
          eventDate,
          location,
          message,
          status: "NEW",
        },
      });

    await notifyPortalUsers({
      type: "ENQUIRY",

      title: "New enquiry received",

      message: `${name} submitted enquiry ${enquiry.reference} for ${service}.`,
    });

    return NextResponse.json(
      {
        id: enquiry.id,
        reference: enquiry.reference,
        status: enquiry.status,
        message:
          "Enquiry submitted successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/enquiries error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to submit enquiry.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "").trim();

    const status = String(
      body.status ?? "",
    )
      .trim()
      .toUpperCase() as EnquiryStatus;

    if (!id) {
      return NextResponse.json(
        {
          error: "Enquiry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid enquiry status.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await prisma.enquiry.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Enquiry not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (existing.status === status) {
      const enquiry =
        await prisma.enquiry.findUnique({
          where: {
            id,
          },

          include: enquiryInclude,
        });

      return NextResponse.json(enquiry);
    }

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const enquiry =
            await tx.enquiry.update({
              where: {
                id,
              },

              data: {
                status,
              },

              include: enquiryInclude,
            });

          await tx.activityLog.create({
            data: {
              action: "UPDATE",

              description: `Enquiry ${enquiry.reference} changed from ${existing.status} to ${enquiry.status}`,
            },
          });

          return enquiry;
        },
      );

    await notifyPortalUsers({
      type: "ENQUIRY",

      title: "Enquiry status updated",

      message: `Enquiry ${updated.reference} changed from ${existing.status} to ${updated.status}.`,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(
      "PATCH /api/enquiries error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to update enquiry.",
      },
      {
        status: 500,
      },
    );
  }
}