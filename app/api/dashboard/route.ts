import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      activeContracts,
      pendingInvoices,
      documents,
      recentActivity,
    ] = await Promise.all([
      prisma.contract.count({
        where: {
          status: {
            in: ["DRAFT", "SENT", "SIGNED"],
          },
        },
      }),

      prisma.invoice.count({
        where: {
          status: {
            in: ["SENT", "PARTIALLY_PAID", "OVERDUE"],
          },
        },
      }),

      prisma.file.count(),

      prisma.activityLog.findMany({
        take: 8,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        activeContracts,
        pendingInvoices,
        documents,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}