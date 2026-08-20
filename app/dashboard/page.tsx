"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  Menu,
  Receipt,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Contracts", icon: BriefcaseBusiness, href: "/contracts" },
  { name: "Invoices", icon: Receipt, href: "/invoices" },
  { name: "Files", icon: FileText, href: "/files" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Activity", icon: Activity, href: "/activity" },
  { name: "Members", icon: Users, href: "/members" },
];

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      activeContracts: 0,
      pendingInvoices: 0,
      documents: 0,
    },
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Active Contracts",
      value: dashboardData.stats.activeContracts,
      description:
        dashboardData.stats.activeContracts === 1
          ? "1 active contract"
          : `${dashboardData.stats.activeContracts} active contracts`,
      icon: BriefcaseBusiness,
    },
    {
      title: "Pending Invoices",
      value: dashboardData.stats.pendingInvoices,
      description:
        dashboardData.stats.pendingInvoices === 1
          ? "1 pending invoice"
          : `${dashboardData.stats.pendingInvoices} pending invoices`,
      icon: Receipt,
    },
    {
      title: "Documents",
      value: dashboardData.stats.documents,
      description:
        dashboardData.stats.documents === 1
          ? "1 uploaded document"
          : `${dashboardData.stats.documents} uploaded documents`,
      icon: FileText,
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-[260px] shrink-0 border-r border-white/[0.07] bg-[#090909]/80 backdrop-blur-xl lg:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/[0.08] bg-[#090909] lg:hidden">
              <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                <Brand />

                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <SidebarNavigation />
            </aside>
          </>
        )}

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#050505]/75 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5 text-white/60 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="hidden items-center gap-3 lg:flex">
                <div className="h-2 w-2 rounded-full bg-[#c5a34a] shadow-[0_0_12px_rgba(197,163,74,0.7)]" />

                <span className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Company Portal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button className="hidden items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm text-white/30 transition hover:border-white/[0.13] hover:text-white/60 sm:flex">
                  <Search size={16} />

                  <span>Search</span>

                  <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px]">
                    /
                  </kbd>
                </button>

                <button className="relative rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 text-white/45 transition hover:bg-white/[0.06] hover:text-white">
                  <Bell size={18} />

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />
                </button>

                <button className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 transition hover:bg-white/[0.06]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c5a34a]/15 text-xs font-semibold text-[#d4b45c]">
                    TJ
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-medium text-white/80">
                      Tshifhiwa JNR
                    </p>

                    <p className="text-[10px] text-white/30">
                      Administrator
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
                Overview
              </p>

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                    Welcome back.
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                    Manage your company documents, contracts, invoices and team
                    activity from one place.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/30">
                  <Clock3 size={14} />

                  <span>
                    {loading
                      ? "Updating dashboard..."
                      : "Dashboard updated just now"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                    }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-6 transition-colors duration-300 hover:border-[#c5a34a]/20"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a34a]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                          {stat.title}
                        </p>

                        <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
                          {loading ? (
                            <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-white/[0.06]" />
                          ) : (
                            stat.value
                          )}
                        </p>

                        <p className="mt-2 text-xs text-white/30">
                          {stat.description}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
                        <Icon size={19} strokeWidth={1.7} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Main grid */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* Activity */}
              <motion.section
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Activity overview
                    </h2>

                    <p className="mt-1 text-xs text-white/30">
                      Recent activity across your workspace
                    </p>
                  </div>

                  <a
                    href="/activity"
                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <ArrowUpRight size={17} />
                  </a>
                </div>

                <div className="p-6">
                  {loading ? (
                    <ActivityLoading />
                  ) : dashboardData.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentActivity
                        .slice(0, 5)
                        .map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.06 }}
                            className="flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition hover:border-[#c5a34a]/15 hover:bg-white/[0.03]"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05]">
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
                                · {formatRelativeTime(item.createdAt)}
                              </p>
                            </div>

                            <ChevronRight
                              size={15}
                              className="shrink-0 text-white/15"
                            />
                          </motion.div>
                        ))}
                    </div>
                  ) : (
                    <EmptyActivity />
                  )}
                </div>
              </motion.section>

              {/* Recent activity */}
              <motion.section
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Workspace status
                    </h2>

                    <p className="mt-1 text-xs text-white/30">
                      Current system overview
                    </p>
                  </div>

                  <a
                    href="/activity"
                    className="text-xs text-[#c5a34a]/70 transition hover:text-[#d4b45c]"
                  >
                    View all
                  </a>
                </div>

                <div className="space-y-3 p-6">
                  <StatusRow
                    label="Contracts"
                    value={dashboardData.stats.activeContracts}
                    icon={BriefcaseBusiness}
                  />

                  <StatusRow
                    label="Invoices"
                    value={dashboardData.stats.pendingInvoices}
                    icon={Receipt}
                  />

                  <StatusRow
                    label="Documents"
                    value={dashboardData.stats.documents}
                    icon={FileText}
                  />

                  <StatusRow
                    label="Activity events"
                    value={dashboardData.recentActivity.length}
                    icon={Activity}
                  />
                </div>
              </motion.section>
            </div>

            {/* Quick access */}
            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6"
            >
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">
                  Quick access
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Jump directly into a workspace module
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Contracts",
                    description: "Manage agreements",
                    icon: BriefcaseBusiness,
                    href: "/contracts",
                  },
                  {
                    title: "Invoices",
                    description: "Track payments",
                    icon: Receipt,
                    href: "/invoices",
                  },
                  {
                    title: "Files",
                    description: "Browse documents",
                    icon: FileText,
                    href: "/files",
                  },
                  {
                    title: "Members",
                    description: "Manage your team",
                    icon: Users,
                    href: "/members",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.title}
                      href={item.href}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b0b0b]/80 p-4 text-left transition-colors hover:border-[#c5a34a]/20 hover:bg-white/[0.025]"
                    >
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-2.5 text-white/40 transition-colors group-hover:border-[#c5a34a]/15 group-hover:text-[#c5a34a]">
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white/70">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[11px] text-white/25">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className="text-white/15 transition-transform group-hover:translate-x-1 group-hover:text-white/40"
                      />
                    </motion.a>
                  );
                })}
              </div>
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <div className="flex h-screen flex-col">
      <div className="border-b border-white/[0.07] p-6">
        <Brand />
      </div>

      <SidebarNavigation />

      <div className="mt-auto border-t border-white/[0.07] p-5">
        <a
          href="/settings"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-white/35 transition hover:bg-white/[0.04] hover:text-white/70"
        >
          <Settings size={17} />

          <span className="text-xs">Settings</span>
        </a>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5a34a]/25 bg-[#c5a34a]/10">
        <span className="text-xs font-bold tracking-tight text-[#d4b45c]">
          MC
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold tracking-[0.16em] text-white">
          MC LEGACY
        </p>

        <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/25">
          Company Portal
        </p>
      </div>
    </div>
  );
}

function SidebarNavigation() {
  return (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => {
        const Icon = item.icon;

        const active = item.name === "Dashboard";

        return (
          <a
            key={item.name}
            href={item.href}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-300 ${
              active
                ? "border border-[#c5a34a]/15 bg-[#c5a34a]/[0.08] text-[#d4b45c]"
                : "border border-transparent text-white/35 hover:bg-white/[0.035] hover:text-white/75"
            }`}
          >
            <Icon
              size={17}
              strokeWidth={active ? 2 : 1.7}
              className={
                active
                  ? "text-[#c5a34a]"
                  : "text-white/30 transition-colors group-hover:text-white/60"
              }
            />

            <span className="text-xs font-medium">{item.name}</span>

            {active && (
              <motion.div
                layoutId="active-nav"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c5a34a] shadow-[0_0_10px_rgba(197,163,74,0.6)]"
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}

function ActivityLoading() {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />
    </div>
  );
}

function EmptyActivity() {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <Activity
            size={22}
            strokeWidth={1.5}
            className="text-white/25"
          />
        </div>

        <h3 className="mt-5 text-sm font-medium text-white/70">
          No activity yet
        </h3>

        <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-white/25">
          Activity will appear here as contracts, invoices, documents and
          members are added.
        </p>
      </div>
    </div>
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

      <span className="flex-1 text-xs text-white/45">{label}</span>

      <span className="text-sm font-semibold text-white/75">{value}</span>
    </div>
  );
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatRelativeTime(date: string) {
  const difference = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(difference / 60000);

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

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}