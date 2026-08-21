import { prisma } from "@/lib/prisma";

export type PortalNotificationType =
  | "ENQUIRY"
  | "BOOKING_UPDATE"
  | "FILE_AVAILABLE"
  | "FILE_DOWNLOAD"
  | "CONTRACT"
  | "INVOICE"
  | "PAYMENT"
  | "MESSAGE"
  | "SYSTEM";

type CreatePortalNotificationInput = {
  type: PortalNotificationType;
  title: string;
  message: string;
  excludeUserId?: string;
};

export async function notifyPortalUsers({
  type,
  title,
  message,
  excludeUserId,
}: CreatePortalNotificationInput) {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,

      role: {
        in: ["ADMIN", "STAFF"],
      },

      ...(excludeUserId
        ? {
            id: {
              not: excludeUserId,
            },
          }
        : {}),
    },

    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      type,
      title,
      message,
    })),
  });
}