"use client";

import {
  ArrowUpRight,
  Camera,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Category =
  | "ALL"
  | "EVENTS"
  | "BRANDS"
  | "DESIGN";

type PortfolioItem = {
  id: number;
  title: string;
  category: Exclude<Category, "ALL">;
  image: string;
  description: string;
};

const items: PortfolioItem[] = [
  {
    id: 1,
    title: "Zion Afrika Event Coverage",
    category: "EVENTS",
    image: "/images/zion-afrika-event.jpg",
    description:
      "Professional event coverage capturing the atmosphere, audience and memorable moments.",
  },
  {
    id: 2,
    title: "Outdoor Campaign Branding",
    category: "BRANDS",
    image: "/images/outdoor-campaign.jpg",
    description:
      "Outdoor promotional branding and campaign visuals produced by MC Legacy Media.",
  },
  {
    id: 3,
    title: "Brand Activation",
    category: "EVENTS",
    image: "/images/brand-activation.jpg",
    description:
      "Professional visual coverage for brand activations and promotional events.",
  },
  {
    id: 4,
    title: "Promotional Campaign",
    category: "DESIGN",
    image: "/images/birthday-promotion.png",
    description:
      "Creative promotional artwork designed for an entertainment campaign.",
  },
  {
    id: 5,
    title: "Phalaphala FM Vehicle Branding",
    category: "BRANDS",
    image: "/images/phalaphala-vehicle.jpg",
    description:
      "Vehicle branding and visual identity application for Phalaphala FM.",
  },
];

const categories: {
  label: string;
  value: Category;
}[] = [
  {
    label: "All Work",
    value: "ALL",
  },
  {
    label: "Events",
    value: "EVENTS",
  },
  {
    label: "Brands",
    value: "BRANDS",
  },
  {
    label: "Design",
    value: "DESIGN",
  },
];

export default function PortfolioPage() {
  const [category, setCategory] =
    useState<Category>("ALL");

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState<PortfolioItem | null>(null);

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        category === "ALL" ||
        item.category === category;

      const matchesSearch =
        !query ||
        `${item.title} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [category, search]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.06] blur-[150px]" />

        <div className="absolute -bottom-48 -right-48 h-[550px] w-[550px] rounded-full bg-[#8a6a22]/[0.05] blur-[150px]" />

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

      {/* Hero */}
      <section className="px-5 pb-16 pt-24 sm:px-8 lg:px-12 lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
            <div className="max-w-4xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
                Portfolio
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Stories told through
                <span className="block text-[#c5a34a]">
                  real creative work.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
                Explore selected event coverage, brand activations,
                promotional campaigns and visual branding projects by
                MC Legacy Media.
              </p>
            </div>

            {/* Logo */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="absolute h-72 w-72 rounded-full bg-[#c5a34a]/[0.08] blur-[100px]" />

              <div className="relative flex h-[260px] w-full max-w-[400px] items-center justify-center rounded-[2rem] border border-white/[0.07] bg-white/[0.015] p-10">
                <Image
                  src="/images/mc-legacy-logo.png"
                  alt="MC Legacy Media"
                  width={500}
                  height={300}
                  priority
                  className="h-auto max-h-[190px] w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/85 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active =
                  category === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCategory(item.value)
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                      active
                        ? "bg-[#c5a34a] text-black"
                        : "border border-white/[0.07] bg-white/[0.02] text-white/35 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-[300px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search portfolio..."
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          {filtered.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/70">
              <div className="text-center">
                <Camera
                  size={25}
                  strokeWidth={1.5}
                  className="mx-auto text-white/20"
                />

                <h2 className="mt-4 text-sm font-medium text-white/60">
                  No portfolio items found
                </h2>

                <p className="mt-2 text-xs text-white/25">
                  Try another category or search.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(
                (item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSelected(item)
                    }
                    className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b] text-left transition duration-300 hover:-translate-y-1 hover:border-[#c5a34a]/20"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute left-5 top-5 flex items-center gap-2">
                      <span className="rounded-full border border-white/[0.15] bg-black/50 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
                        {item.category}
                      </span>

                      <span className="text-[10px] text-white/50">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-24">
                      <h2 className="text-lg font-semibold tracking-[-0.02em]">
                        {item.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-white/40">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#c5a34a]/70">
                        View project
                        <ArrowUpRight
                          size={12}
                        />
                      </div>
                    </div>
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px] rounded-[2rem] border border-[#c5a34a]/10 bg-[#0b0b0b] p-8 sm:p-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a34a]/70">
            Work With Us
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Your next project could be here.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
            From events and campaigns to visual branding and creative
            production, MC Legacy Media helps turn ideas into memorable
            visual experiences.
          </p>

          <a
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
          >
            Start a project

            <ArrowUpRight
              size={16}
            />
          </a>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-xl"
          onClick={() =>
            setSelected(null)
          }
        >
          <div
            className="relative my-8 w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#090909]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() =>
                setSelected(null)
              }
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-black/60 text-white/60 backdrop-blur transition hover:bg-black hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-video bg-[#0d0d0d]">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#c5a34a]/70">
                {selected.category}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {selected.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/35">
                {selected.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}