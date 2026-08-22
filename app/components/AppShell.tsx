"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import PublicNavBar from "./PublicNavBar";

const managementRoutes = [
  "/dashboard",
  "/clients",
  "/users",
  "/files",
  "/contracts",
  "/invoices",
  "/notifications",
  "/activity",
  "/members",
  "/bookings",
  "/enquiries",
  "/messages",
  "/settings",
];

function isManagementPath(pathname: string) {
  return managementRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
}

function isStandalonePath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/")
  );
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login / authentication pages:
  // no public navbar and no management navbar.
  if (isStandalonePath(pathname)) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        {children}
      </main>
    );
  }

  // Staff / administrator management area.
  if (isManagementPath(pathname)) {
    return (
      <>
        <NavBar />

        <div className="min-h-screen lg:pl-[250px]">
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </>
    );
  }

  // Public website.
  return (
    <>
      <PublicNavBar />

      <div className="min-h-screen pt-[76px]">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </>
  );
}