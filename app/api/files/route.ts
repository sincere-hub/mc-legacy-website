import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const uploadDirectory = path.join(process.cwd(), "uploads");

function getFileType(mimeType: string): "PHOTO" | "VIDEO" | "DOCUMENT" | "OTHER" {
  if (mimeType.startsWith("image/")) {
    return "PHOTO";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("word") ||
    mimeType.includes("text") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel")
  ) {
    return "DOCUMENT";
  }

  return "OTHER";
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * GET /api/files
 *
 * Returns all files with their uploader, client and booking.
 */
export async function GET() {
  try {
    const files = await prisma.file.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            reference: true,
            service: true,
          },
        },
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("GET /api/files error:", error);

    return NextResponse.json(
      {
        error: "Failed to load files.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/files
 *
 * Uploads a file and creates its Prisma record.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          error: "No file was provided.",
        },
        {
          status: 400,
        },
      );
    }

    if (uploadedFile.size === 0) {
      return NextResponse.json(
        {
          error: "The uploaded file is empty.",
        },
        {
          status: 400,
        },
      );
    }

    const clientIdValue = formData.get("clientId");
    const bookingIdValue = formData.get("bookingId");

    const clientId =
      typeof clientIdValue === "string" && clientIdValue.trim()
        ? clientIdValue.trim()
        : null;

    const bookingId =
      typeof bookingIdValue === "string" && bookingIdValue.trim()
        ? bookingIdValue.trim()
        : null;

    if (clientId) {
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
    }

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

      if (!booking) {
        return NextResponse.json(
          {
            error: "Selected booking was not found.",
          },
          {
            status: 404,
          },
        );
      }
    }

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    const originalName = uploadedFile.name;
    const cleanedName = safeFileName(originalName);
    const extension = path.extname(cleanedName);

    const uniqueName = `${crypto.randomUUID()}${extension}`;
    const storageKey = uniqueName;

    const filePath = path.join(uploadDirectory, uniqueName);

    const bytes = await uploadedFile.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(bytes));

    /*
     * Until authentication is connected to this route,
     * uploadedById remains null.
     */
    const createdFile = await prisma.file.create({
      data: {
        name: cleanedName,
        originalName,
        storageKey,
        mimeType: uploadedFile.type || "application/octet-stream",
        size: uploadedFile.size,
        type: getFileType(uploadedFile.type),
        visibility: "PRIVATE",
        clientId,
        bookingId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            reference: true,
            service: true,
          },
        },
      },
    });

    return NextResponse.json(createdFile, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/files error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload file.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * DELETE /api/files?id=FILE_ID
 *
 * Deletes the physical file and its Prisma record.
 */
export async function DELETE(request: NextRequest) {
  try {
    const fileId = request.nextUrl.searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        {
          error: "File ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingFile = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!existingFile) {
      return NextResponse.json(
        {
          error: "File not found.",
        },
        {
          status: 404,
        },
      );
    }

    const filePath = path.join(
      uploadDirectory,
      path.basename(existingFile.storageKey),
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      const fileError = error as NodeJS.ErrnoException;

      if (fileError.code !== "ENOENT") {
        throw error;
      }
    }

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/files error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete file.",
      },
      {
        status: 500,
      },
    );
  }
}