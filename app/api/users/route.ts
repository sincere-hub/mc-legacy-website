import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type UserRole = "ADMIN" | "STAFF";

const validRoles: UserRole[] = ["ADMIN", "STAFF"];

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json(
        {
          error: "Administrator access required.",
        },
        {
          status: 403,
        },
      ),
    };
  }

  return {
    session,
    response: null,
  };
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * GET /api/users
 *
 * ADMIN ONLY
 */
export async function GET() {
  try {
    const auth = await requireAdmin();

    if (auth.response) {
      return auth.response;
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: userSelect,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        error: "Failed to load users.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/users
 *
 * ADMIN ONLY
 *
 * Creates a STAFF or ADMIN account.
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const phone = String(body.phone ?? "").trim();

    const role = String(body.role ?? "STAFF")
      .trim()
      .toUpperCase() as UserRole;

    // Supports both names temporarily so your current UI
    // still works while we clean it up.
    const password = String(
      body.password ?? body.passwordHash ?? "",
    );

    if (!name) {
      return NextResponse.json(
        {
          error: "Name is required.",
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

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Only STAFF and ADMIN accounts can be created.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "A user with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      12,
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role,
        isActive: true,
      },

      select: userSelect,
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",

        description: `Administrator created ${role.toLowerCase()} account ${
          user.name ?? user.email
        }`,

        userId: auth.session!.user.id,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/users error:", error);

    return NextResponse.json(
      {
        error: "Failed to create user.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * PATCH /api/users
 *
 * ADMIN ONLY
 *
 * Supports:
 * - changing name
 * - changing phone
 * - changing role
 * - activating/deactivating account
 */
export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin();

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();

    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        {
          error: "User ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updateData: {
      name?: string;
      phone?: string | null;
      role?: UserRole;
      isActive?: boolean;
    } = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();

      if (!name) {
        return NextResponse.json(
          {
            error: "Name cannot be empty.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.name = name;
    }

    if (typeof body.phone === "string") {
      updateData.phone =
        body.phone.trim() || null;
    }

    if (typeof body.role === "string") {
      const role = body.role
        .trim()
        .toUpperCase() as UserRole;

      if (!validRoles.includes(role)) {
        return NextResponse.json(
          {
            error: "Invalid user role.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        id === auth.session!.user.id &&
        role !== "ADMIN"
      ) {
        return NextResponse.json(
          {
            error:
              "You cannot remove your own administrator role.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.role = role;
    }

    if (typeof body.isActive === "boolean") {
      if (
        id === auth.session!.user.id &&
        body.isActive === false
      ) {
        return NextResponse.json(
          {
            error:
              "You cannot deactivate your own account.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.isActive = body.isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error: "No changes were provided.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },

      data: updateData,

      select: userSelect,
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",

        description: `Administrator updated user ${
          updatedUser.name ?? updatedUser.email
        }`,

        userId: auth.session!.user.id,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH /api/users error:", error);

    return NextResponse.json(
      {
        error: "Failed to update user.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * DELETE /api/users?id=USER_ID
 *
 * ADMIN ONLY
 */
export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin();

    if (auth.response) {
      return auth.response;
    }

    const url = new URL(request.url);

    const id =
      url.searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json(
        {
          error: "User ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (id === auth.session!.user.id) {
      return NextResponse.json(
        {
          error:
            "You cannot delete your own administrator account.",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Log before deleting so the activity record belongs
     * to the administrator performing the action, not the
     * account being removed.
     */
    await prisma.activityLog.create({
      data: {
        action: "DELETE",

        description: `Administrator deleted user ${
          existingUser.name ?? existingUser.email
        }`,

        userId: auth.session!.user.id,
      },
    });

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/users error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete user.",
      },
      {
        status: 500,
      },
    );
  }
}