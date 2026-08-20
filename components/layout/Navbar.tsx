"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useState } from "react";

const navigation = [
  { label: "Overview", href: "/", icon: Home },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Users", href: "/users", icon: UserRound },
  { label: "Enquiries", href: "/enquiries", icon: ClipboardList },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Files", href: "/files", icon: FolderOpen },
  { label: "Contracts", href: "/contracts", icon: FileText },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Desktop Navigation Rail */}
      <aside className="fixed left-4 top-4 bottom-4 z-50 hidden lg:block">
        <div className="group flex h-full w-[68px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:w-[230px]">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex h-[72px] shrink-0 items-center border-b border-white/[0.07] px-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/20 bg-[#c5a34a]/[0.07]">
              <span className="text-sm font-bold tracking-tight text-[#c5a34a]">
                MC
              </span>
            </div>

            <div className="ml-3 min-w-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="whitespace-nowrap text-sm font-semibold text-white">
                MC Legacy
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-white/25">
                Company Portal
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
            <p className="mb-3 px-2 text-[9px] font-medium uppercase tracking-[0.18em] text-white/20 opacity-0 transition-opacity group-hover:opacity-100">
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
                    title={item.label}
                    onClick={() => setMobileOpen(false)}
                    className={`group/item relative flex h-11 items-center rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[#c5a34a]/[0.10] text-[#d4b45c]"
                        : "text-white/35 hover:bg-white/[0.045] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 h-6 w-[2px] rounded-full bg-[#c5a34a]" />
                    )}

                    <div className="flex w-[44px] shrink-0 items-center justify-center">
                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        className={
                          active
                            ? "text-[#c5a34a]"
                            : "text-white/30 group-hover/item:text-[#c5a34a]"
                        }
                      />
                    </div>

                    <span className="whitespace-nowrap text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {item.label}
                    </span>

                    <ChevronRight
                      size={13}
                      className="ml-auto mr-3 opacity-0 transition-all duration-200 group-hover:opacity-25"
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom */}
          <div className="shrink-0 border-t border-white/[0.07] p-2">
            <Link
              href="/settings"
              title="Settings"
              className="flex h-11 items-center rounded-xl text-white/35 transition hover:bg-white/[0.045] hover:text-white"
            >
              <div className="flex w-[44px] shrink-0 items-center justify-center">
                <Settings size={18} strokeWidth={1.7} />
              </div>

              <span className="whitespace-nowrap text-sm opacity-0 transition-opacity group-hover:opacity-100">
                Settings
              </span>
            </Link>

            <button
              type="button"
              className="mt-1 flex h-11 w-full items-center rounded-xl text-white/30 transition hover:bg-red-500/[0.06] hover:text-red-400"
            >
              <div className="flex w-[44px] shrink-0 items-center justify-center">
                <LogOut size={18} strokeWidth={1.7} />
              </div>

              <span className="whitespace-nowrap text-sm opacity-0 transition-opacity group-hover:opacity-100">
                Sign out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#080808]/90 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c5a34a]/20 bg-[#c5a34a]/[0.07]">
            <span className="text-xs font-bold text-[#c5a34a]">MC</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              MC Legacy
            </p>

            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
              Company Portal
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed bottom-0 left-0 top-16 z-50 w-[280px] border-r border-white/[0.08] bg-[#090909] shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="h-full overflow-y-auto px-3 py-5">
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
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-[#c5a34a]/[0.10] text-[#d4b45c]"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white"
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

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 border-t border-white/[0.07] pt-4">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/35 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Settings size={18} />
              Settings
            </Link>

            <button
              type="button"
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/30 transition hover:bg-red-500/[0.06] hover:text-red-400"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}