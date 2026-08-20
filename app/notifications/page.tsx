"use client";

import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  FileText,
  MessageSquare,
  Receipt,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type NotificationType =
  | "ENQUIRY"
  | "BOOKING_UPDATE"
  | "FILE_AVAILABLE"
  | "FILE_DOWNLOAD"
  | "CONTRACT"
  | "INVOICE"
  | "PAYMENT"
  | "MESSAGE"
  | "SYSTEM";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

const notificationConfig: Record<
  NotificationType,
  {
    label: string;
    icon: typeof Bell;
  }
> = {
  ENQUIRY: {
    label: "Enquiry",
    icon: BellRing,
  },
  BOOKING_UPDATE: {
    label: "Booking",
    icon: RefreshCw,
  },
  FILE_AVAILABLE: {
    label: "File",
    icon: Upload,
  },
  FILE_DOWNLOAD: {
    label: "File Download",
    icon: Upload,
  },
  CONTRACT: {
    label: "Contract",
    icon: FileText,
  },
  INVOICE: {
    label: "Invoice",
    icon: Receipt,
  },
  PAYMENT: {
    label: "Payment",
    icon: Receipt,
  },
  MESSAGE: {
    label: "Message",
    icon: MessageSquare,
  },
  SYSTEM: {
    label: "System",
    icon: Bell,
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  async function loadNotifications(showSpinner = true) {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch("/api/notifications", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load notifications.",
        );
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.readAt,
      ).length,
    [notifications],
  );

  const visibleNotifications = useMemo(() => {
    if (filter === "UNREAD") {
      return notifications.filter(
        (notification) => !notification.readAt,
      );
    }

    return notifications;
  }, [notifications, filter]);

  async function markAsRead(id: string) {
    try {
      const response = await fetch(
        `/api/notifications?id=${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            read: true,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to mark notification as read.",
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                readAt:
                  data.readAt ||
                  new Date().toISOString(),
              }
            : notification,
        ),
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update notification.",
      );
    }
  }

  async function markAllAsRead() {
    if (unreadCount === 0) {
      return;
    }

    try {
      setError("");

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markAllAsRead: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to mark notifications as read.",
        );
      }

      const now = new Date().toISOString();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          readAt: notification.readAt || now,
        })),
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update notifications.",
      );
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
              Activity Center
            </p>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full border border-[#c5a34a]/20 bg-[#c5a34a]/[0.08] px-2.5 py-1 text-[10px] font-semibold text-[#d4b45c]">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Stay up to date with enquiries, bookings, files,
              contracts, invoices and messages.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadNotifications(false)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-xl bg-[#c5a34a] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck size={15} />

              Mark all read
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Bell}
            label="Total"
            value={notifications.length}
          />

          <StatCard
            icon={BellRing}
            label="Unread"
            value={unreadCount}
          />

          <StatCard
            icon={Check}
            label="Read"
            value={notifications.length - unreadCount}
          />
        </div>

        {/* Content */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Notification Center
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {visibleNotifications.length} notification
                {visibleNotifications.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                  filter === "ALL"
                    ? "bg-white/[0.07] text-white"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setFilter("UNREAD")}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                  filter === "UNREAD"
                    ? "bg-[#c5a34a]/[0.10] text-[#d4b45c]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-300/60 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />

                <p className="mt-4 text-xs text-white/30">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <EmptyState
              unreadOnly={filter === "UNREAD"}
            />
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {visibleNotifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bell;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
          <Icon size={19} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/30">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const config =
    notificationConfig[notification.type] ||
    notificationConfig.SYSTEM;

  const Icon = config.icon;
  const unread = !notification.readAt;

  return (
    <div
      className={`group flex gap-4 p-5 transition sm:p-6 ${
        unread
          ? "bg-[#c5a34a]/[0.025] hover:bg-[#c5a34a]/[0.045]"
          : "hover:bg-white/[0.02]"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
          unread
            ? "border-[#c5a34a]/20 bg-[#c5a34a]/[0.08] text-[#c5a34a]"
            : "border-white/[0.07] bg-white/[0.025] text-white/25"
        }`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-medium ${
                  unread ? "text-white/85" : "text-white/55"
                }`}
              >
                {notification.title}
              </h3>

              {unread && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />
              )}
            </div>

            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/20">
              {config.label}
            </p>
          </div>

          <span className="shrink-0 text-[10px] text-white/20">
            {formatDate(notification.createdAt)}
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/35">
          {notification.message}
        </p>

        {unread && (
          <button
            type="button"
            onClick={() => onRead(notification.id)}
            className="mt-4 flex items-center gap-2 text-xs font-medium text-[#c5a34a] transition hover:text-[#d4b45c]"
          >
            <Check size={14} />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  unreadOnly,
}: {
  unreadOnly: boolean;
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <Bell
            size={25}
            strokeWidth={1.5}
            className="text-white/25"
          />
        </div>

        <h3 className="mt-5 text-sm font-medium text-white/70">
          {unreadOnly
            ? "You're all caught up"
            : "No notifications yet"}
        </h3>

        <p className="mt-2 text-xs leading-5 text-white/25">
          {unreadOnly
            ? "There are no unread notifications right now."
            : "New enquiries, bookings, files, contracts, invoices and messages will appear here."}
        </p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}