
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
  MessageSquare,
  Receipt,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    label: "Overview",
    href: "/",
    icon: Home,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    label: "Users",
    href: "/users",
    icon: UserRound,
  },
  {
    label: "Enquiries",
    href: "/enquiries",
    icon: ClipboardList,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Files",
    href: "/files",
    icon: FolderOpen,
  },
  {
    label: "Contracts",
    href: "/contracts",
    icon: FileText,
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: Receipt,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-white/[0.07] bg-[#080808] lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-[82px] items-center border-b border-white/[0.07] px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5a34a]/20 bg-[#c5a34a]/[0.07]">
              <span className="text-sm font-bold tracking-tight text-[#c5a34a]">
                MC
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                MC Legacy
              </p>

              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/25">
                Company Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/20">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
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

        {/* Bottom */}
        <div className="border-t border-white/[0.07] p-3">
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
              className="text-white/25 transition group-hover:text-[#c5a34a]"
            />

            <span>Settings</span>
          </Link>

          <button
            type="button"
            className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/35 transition hover:bg-red-500/[0.05] hover:text-red-400"
          >
            <LogOut size={17} className="text-white/25" />

            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#080808]/95 px-5 backdrop-blur-xl lg:hidden">
        <Link
          href="/"
          onClick={closeMobile}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c5a34a]/20 bg-[#c5a34a]/[0.07]">
            <span className="text-xs font-bold text-[#c5a34a]">MC</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">MC Legacy</p>

            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
              Company Portal
            </p>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/60 transition hover:bg-white/[0.05] hover:text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <div className="fixed left-0 right-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-white/[0.07] bg-[#080808] shadow-2xl lg:hidden">
            <nav className="px-4 py-5">
              <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/20">
                Management
              </p>

              <div className="space-y-1">
                {navigation.map((item) => {
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
                          active ? "text-[#c5a34a]" : "text-white/30"
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

              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <Link
                  href="/settings"
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <Settings size={18} className="text-white/30" />

                  <span>Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={closeMobile}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/40 transition hover:bg-red-500/[0.05] hover:text-red-400"
                >
                  <LogOut size={18} className="text-white/30" />

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

