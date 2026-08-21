
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  Play,
  Sparkles,
} from "lucide-react";

const services = [
  {
    title: "Event Coverage",
    description:
      "Professional coverage designed to capture the moments, atmosphere and details that matter.",
    icon: Camera,
  },
  {
    title: "Creative Production",
    description:
      "High-quality visual production for brands, organisations, events and special occasions.",
    icon: Sparkles,
  },
  {
    title: "Photography",
    description:
      "Carefully produced photography that gives your event or brand a lasting visual identity.",
    icon: Camera,
  },
];

const highlights = [
  "Professional service",
  "Reliable communication",
  "Quality-focused production",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.07] blur-[140px]" />
        <div className="absolute right-[-180px] top-[35%] h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[150px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.04] blur-[150px]" />

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
      <section className="relative flex min-h-[calc(100vh-64px)] items-center px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1400px] gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c5a34a]/15 bg-[#c5a34a]/[0.05] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#c5a34a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />
              MC Legacy
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              Creating moments
              <span className="block text-[#c5a34a]">that last.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
              Professional creative services built around memorable events,
              powerful visuals and experiences worth remembering.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c] active:scale-[0.98]"
              >
                Start an Enquiry
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.05] hover:text-white"
              >
                Explore Services
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2 text-xs text-white/35"
                >
                  <CheckCircle2 size={14} className="text-[#c5a34a]/70" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#c5a34a]/[0.04] blur-2xl" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0b0b0b]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c5a34a]/10 via-transparent to-black" />

              <div className="absolute inset-6 rounded-[1.5rem] border border-white/[0.06]" />

              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#c5a34a]/70">
                  Experience
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  Built with intention.
                </p>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                  Every project is approached with attention to detail,
                  professionalism and a commitment to quality.
                </p>
              </div>

              <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c5a34a]/25 bg-[#c5a34a]/10 text-[#c5a34a] backdrop-blur-md">
                <Play size={20} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-white/[0.06] px-5 py-24 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
                What we do
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Services built around you.
              </h2>
            </div>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
            >
              View all services
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  href="/services"
                  key={service.title}
                  className="group rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c5a34a]/20 hover:bg-[#0e0e0e]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05] text-[#c5a34a]">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs text-[#c5a34a]/70">
                    Learn more
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] border border-[#c5a34a]/10 bg-[#0b0b0b]">
          <div className="relative p-8 sm:p-12 lg:p-16">
            <div className="absolute right-[-100px] top-[-150px] h-[350px] w-[350px] rounded-full bg-[#c5a34a]/[0.07] blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a34a]/70">
                  Let's work together
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Have something in mind?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                  Tell us about your project and our team will get back to
                  you with the next steps.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
              >
                Contact MC Legacy
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">MC Legacy</p>
            <p className="mt-1 text-xs text-white/25">
              Creating experiences that last.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-white/30">
            <Link
              href="/contact"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Mail size={13} />
              Contact
            </Link>

            <span className="flex items-center gap-2">
              <MapPin size={13} />
              South Africa
            </span>

            <Link
              href="/login"
              className="flex items-center gap-2 text-[#c5a34a]/70 transition hover:text-[#c5a34a]"
            >
              Staff / Admin Login
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

