import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          MC Legacy
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
        >
          Get a Quote
        </Link>
      </div>
    </header>
  );
}