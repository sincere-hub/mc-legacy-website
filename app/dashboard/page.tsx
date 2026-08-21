"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  Receipt,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type ActivityItem = {
  id: string;
  action: string;
  description: string | null;
  createdAt: string;

  user: {
    name: string | null;
    email: string;
  } | null;
};

type DashboardData = {
  stats: {
    activeContracts: number;
    pendingInvoices: number;
    documents: number;
  };

  recentActivity: ActivityItem[];
};

export default function DashboardPage() {
  const { data: session } = useSession();

  const [dashboardData, setDashboardData] =
    useState<DashboardData>({
      stats: {
        activeContracts: 0,
        pendingInvoices: 0,
        documents: 0,
      },
      recentActivity: [],
    });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load dashboard.",
        );
      }

      setDashboardData({
        stats: {
          activeContracts:
            Number(data.stats?.activeContracts) || 0,

          pendingInvoices:
            Number(data.stats?.pendingInvoices) || 0,

          documents:
            Number(data.stats?.documents) || 0,
        },

        recentActivity: Array.isArray(
          data.recentActivity,
        )
          ? data.recentActivity
          : [],
      });
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0];

  const stats = [
    {
      title: "Active Contracts",
      value: dashboardData.stats.activeContracts,
      description:
        dashboardData.stats.activeContracts === 1
          ? "1 active contract"
          : `${dashboardData.stats.activeContracts} active contracts`,
      icon: BriefcaseBusiness,
      href: "/contracts",
    },
    {
      title: "Pending Invoices",
      value: dashboardData.stats.pendingInvoices,
      description:
        dashboardData.stats.pendingInvoices === 1
          ? "1 pending invoice"
          : `${dashboardData.stats.pendingInvoices} pending invoices`,
      icon: Receipt,
      href: "/invoices",
    },
    {
      title: "Documents",
      value: dashboardData.stats.documents,
      description:
        dashboardData.stats.documents === 1
          ? "1 uploaded document"
          : `${dashboardData.stats.documents} uploaded documents`,
      icon: FileText,
      href: "/files",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-10"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              {/* Brand */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0">
                  <Image
                    src="/images/mc-legacy-logo.png"
                    alt="MC Legacy Media"
                    fill
                    priority
                    sizes="64px"
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
                    MC Legacy Media
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    Management Portal
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Welcome back
                {firstName ? `, ${firstName}.` : "."}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                Manage bookings, enquiries, documents,
                contracts, invoices and workspace activity
                from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/notifications"
                title="Notifications"
                className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/40 transition hover:border-[#c5a34a]/20 hover:bg-[#c5a34a]/[0.05] hover:text-[#d4b45c]"
              >
                <Bell size={18} />
              </Link>

              <div className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-xs text-white/30">
                <Clock3 size={14} />

                <span>
                  {loading
                    ? "Updating..."
                    : "Updated just now"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            <div className="flex items-center justify-between gap-4">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadDashboard}
                className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs text-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -4,
                }}
              >
                <Link
                  href={stat.href}
                  className="group relative block overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-6 transition-colors hover:border-[#c5a34a]/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                        {stat.title}
                      </p>

                      <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                        {loading ? "—" : stat.value}
                      </p>

                      <p className="mt-2 text-xs text-white/30">
                        {stat.description}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
                      <Icon size={19} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-white/15 transition group-hover:text-[#c5a34a]/60">
                    View module

                    <ChevronRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Activity */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
              <div>
                <h2 className="text-sm font-semibold">
                  Recent activity
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Latest changes across the workspace
                </p>
              </div>

              <Link
                href="/activity"
                className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-[#d4b45c]"
              >
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex min-h-[220px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />
                </div>
              ) : dashboardData.recentActivity.length >
                0 ? (
                <div className="space-y-3">
                  {dashboardData.recentActivity
                    .slice(0, 5)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05]">
                          <Activity
                            size={16}
                            className="text-[#c5a34a]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white/70">
                            {item.description ||
                              formatAction(item.action)}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {item.user?.name ||
                              item.user?.email ||
                              "System"}{" "}
                            ·{" "}
                            {formatRelativeTime(
                              item.createdAt,
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center text-center">
                  <div>
                    <Activity
                      size={24}
                      className="mx-auto text-white/20"
                    />

                    <p className="mt-4 text-sm text-white/50">
                      No activity yet
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Workspace */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
            <div className="border-b border-white/[0.06] p-6">
              <h2 className="text-sm font-semibold">
                Workspace status
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Current system overview
              </p>
            </div>

            <div className="space-y-3 p-6">
              <StatusRow
                label="Active Contracts"
                value={
                  dashboardData.stats.activeContracts
                }
                icon={BriefcaseBusiness}
              />

              <StatusRow
                label="Pending Invoices"
                value={
                  dashboardData.stats.pendingInvoices
                }
                icon={Receipt}
              />

              <StatusRow
                label="Documents"
                value={dashboardData.stats.documents}
                icon={FileText}
              />

              <StatusRow
                label="Activity Events"
                value={
                  dashboardData.recentActivity.length
                }
                icon={Activity}
              />
            </div>
          </section>
        </div>

        {/* Quick access */}
        <section className="mt-6">
          <h2 className="text-sm font-semibold">
            Quick access
          </h2>

          <p className="mt-1 text-xs text-white/30">
            Jump directly into a workspace module
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickCard
              title="Bookings"
              description="Manage client bookings"
              icon={CalendarDays}
              href="/bookings"
            />

            <QuickCard
              title="Enquiries"
              description="Review public enquiries"
              icon={Users}
              href="/enquiries"
            />

            <QuickCard
              title="Files"
              description="Browse documents"
              icon={FileText}
              href="/files"
            />

            <QuickCard
              title="Invoices"
              description="Track payments"
              icon={Receipt}
              href="/invoices"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function QuickCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: typeof Activity;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b0b0b]/80 p-4 transition hover:border-[#c5a34a]/20"
    >
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-2.5 text-white/40 group-hover:text-[#c5a34a]">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white/70">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-white/25">
          {description}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="text-white/15"
      />
    </Link>
  );
}

function StatusRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-2 text-white/35">
        <Icon size={16} />
      </div>

      <span className="flex-1 text-xs text-white/45">
        {label}
      </span>

      <span className="text-sm font-semibold text-white/75">
        {value}
      </span>
    </div>
  );
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (letter) =>
      letter.toUpperCase(),
    );
}

function formatRelativeTime(date: string) {
  const difference =
    Date.now() - new Date(date).getTime();

  const minutes = Math.floor(
    difference / 60000,
  );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}