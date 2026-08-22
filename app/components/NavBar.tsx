"use client";

import {
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderOpen,
  Home,
  LogOut,
  Menu,
  Receipt,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: Home,
    adminOnly: false,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
    adminOnly: false,
  },
  {
    label: "Users",
    href: "/users",
    icon: UserRound,
    adminOnly: true,
  },
  {
    label: "Enquiries",
    href: "/enquiries",
    icon: ClipboardList,
    adminOnly: false,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
    adminOnly: false,
  },
  {
    label: "Files",
    href: "/files",
    icon: FolderOpen,
    adminOnly: false,
  },
  {
    label: "Contracts",
    href: "/contracts",
    icon: FileText,
    adminOnly: false,
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: Receipt,
    adminOnly: false,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    adminOnly: false,
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";

  const visibleNavigation = useMemo(() => {
    return navigation.filter(
      (item) => !item.adminOnly || isAdmin,
    );
  }, [isAdmin]);

  function isActive(href: string) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  async function handleSignOut() {
    setMobileOpen(false);

    await signOut({
      callbackUrl: "/login",
    });
  }

  const displayName =
    session?.user?.name ||
    session?.user?.email ||
    "Portal User";

  const initials = getInitials(
    session?.user?.name ?? null,
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-white/[0.07] bg-[#080808] lg:flex lg:flex-col">
        {/* BRAND / LOGO */}
        <div className="flex h-[118px] items-center border-b border-white/[0.07] px-4">
          <Link
            href="/dashboard"
            className="group flex w-full items-center"
          >
            <div className="relative h-[84px] w-[220px]">
              <Image
                src="/images/mc-legacy-logo.png"
                alt="MC Legacy Media"
                fill
                priority
                sizes="220px"
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/20">
            Management
          </p>

          <div className="space-y-1">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-[#c5a34a]/[0.09] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.7}
                    className={`shrink-0 transition ${
                      active
                        ? "text-[#c5a34a]"
                        : "text-white/25 group-hover:text-[#c5a34a]"
                    }`}
                  />

                  <span>{item.label}</span>

                  <ChevronRight
                    size={13}
                    className={`ml-auto transition ${
                      active
                        ? "translate-x-0.5 text-[#c5a34a]/50"
                        : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-30"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* USER */}
        <div className="border-t border-white/[0.07] p-3">
          <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c5a34a]/15 bg-[#c5a34a]/[0.07] text-xs font-semibold text-[#d4b45c]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white/70">
                  {status === "loading"
                    ? "Loading..."
                    : displayName}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                  {role === "ADMIN"
                    ? "Administrator"
                    : role === "STAFF"
                      ? "Staff"
                      : "Portal User"}
                </p>
              </div>
            </div>
          </div>

          {/* SETTINGS */}
          <Link
            href="/settings"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              isActive("/settings")
                ? "bg-[#c5a34a]/[0.09] text-white"
                : "text-white/35 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Settings
              size={17}
              className={`transition ${
                isActive("/settings")
                  ? "text-[#c5a34a]"
                  : "text-white/25 group-hover:text-[#c5a34a]"
              }`}
            />

            <span>Settings</span>
          </Link>

          {/* SIGN OUT */}
          <button
            type="button"
            onClick={handleSignOut}
            className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/35 transition hover:bg-red-500/[0.05] hover:text-red-400"
          >
            <LogOut
              size={17}
              className="text-white/25 transition group-hover:text-red-400"
            />

            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080808]/95 px-5 backdrop-blur-xl lg:hidden">
        <Link
          href="/dashboard"
          onClick={closeMobile}
          className="group flex items-center"
        >
          <div className="relative h-[56px] w-[160px]">
            <Image
              src="/images/mc-legacy-logo.png"
              alt="MC Legacy Media"
              fill
              priority
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen((current) => !current)
          }
          aria-label={
            mobileOpen
              ? "Close navigation"
              : "Open navigation"
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/60 transition hover:border-[#c5a34a]/20 hover:bg-white/[0.05] hover:text-white"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <div className="fixed left-0 right-0 top-[76px] z-50 max-h-[calc(100vh-76px)] overflow-y-auto border-b border-white/[0.07] bg-[#080808] shadow-2xl lg:hidden">
            <nav className="px-4 py-5">
              {/* MOBILE USER */}
              <div className="mb-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c5a34a]/15 bg-[#c5a34a]/[0.07] text-xs font-semibold text-[#d4b45c]">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/70">
                      {status === "loading"
                        ? "Loading..."
                        : displayName}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                      {role === "ADMIN"
                        ? "Administrator"
                        : role === "STAFF"
                          ? "Staff"
                          : "Portal User"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/20">
                Management
              </p>

              <div className="space-y-1">
                {visibleNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                        active
                          ? "bg-[#c5a34a]/[0.09] text-white"
                          : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        className={
                          active
                            ? "text-[#c5a34a]"
                            : "text-white/30"
                        }
                      />

                      <span>{item.label}</span>

                      <ChevronRight
                        size={14}
                        className="ml-auto text-white/20"
                      />
                    </Link>
                  );
                })}
              </div>

              {/* MOBILE SETTINGS / SIGNOUT */}
              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <Link
                  href="/settings"
                  onClick={closeMobile}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive("/settings")
                      ? "bg-[#c5a34a]/[0.09] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Settings
                    size={18}
                    className={
                      isActive("/settings")
                        ? "text-[#c5a34a]"
                        : "text-white/30"
                    }
                  />

                  <span>Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/40 transition hover:bg-red-500/[0.05] hover:text-red-400"
                >
                  <LogOut
                    size={18}
                    className="text-white/30"
                  />

                  <span>Sign out</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

function getInitials(
  name: string | null,
) {
  if (!name) {
    return "MC";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}