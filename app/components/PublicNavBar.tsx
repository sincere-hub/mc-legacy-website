"use client";

import {
  ArrowRight,
  CalendarCheck2,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const publicNavigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function PublicNavBar() {
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
      {/* PUBLIC HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Brand */}
          <Link
            href="/"
            onClick={closeMobile}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5a34a]/25 bg-[#c5a34a]/[0.07] transition group-hover:border-[#c5a34a]/40">
              <span className="text-sm font-bold tracking-tight text-[#d4b45c]">
                MC
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-white">
                MC LEGACY
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.19em] text-white/25">
                Media
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {publicNavigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-4 py-2.5 text-xs font-medium transition ${
                    active
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-px w-5 -translate-x-1/2 bg-[#c5a34a]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* Book Now */}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#c5a34a] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#d4b45c] active:scale-[0.98]"
            >
              <CalendarCheck2 size={15} />

              Book Now

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            {/* Staff/Admin Login */}
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-white/45 transition hover:border-[#c5a34a]/20 hover:bg-[#c5a34a]/[0.05] hover:text-[#d4b45c]"
            >
              <ShieldCheck size={15} />

              Staff / Admin Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label={
              mobileOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/60 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed left-4 right-4 top-[88px] z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090909]/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <nav className="p-3">
          {/* Main links */}
          <div className="space-y-1">
            {publicNavigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm transition ${
                    active
                      ? "bg-[#c5a34a]/[0.08] text-[#d4b45c]"
                      : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile actions */}
          <div className="mt-3 space-y-2 border-t border-white/[0.07] pt-3">
            {/* Book Now */}
            <Link
              href="/contact"
              onClick={closeMobile}
              className="flex items-center justify-between rounded-xl bg-[#c5a34a] px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
            >
              <span className="flex items-center gap-3">
                <CalendarCheck2 size={17} />

                Book Now
              </span>

              <ArrowRight size={15} />
            </Link>

            {/* Staff/Admin Login */}
            <Link
              href="/login"
              onClick={closeMobile}
              className="flex items-center justify-between rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.04] px-4 py-3.5 text-sm font-medium text-[#d4b45c]"
            >
              <span className="flex items-center gap-3">
                <ShieldCheck size={17} />

                Staff / Admin Login
              </span>

              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}