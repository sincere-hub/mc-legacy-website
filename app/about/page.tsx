import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";

const values = [
  {
    title: "Professionalism",
    description:
      "We approach every project with clear communication, preparation and respect for the people we work with.",
    icon: ShieldCheck,
  },
  {
    title: "Creativity",
    description:
      "Every project is treated as an opportunity to create something distinctive, meaningful and visually memorable.",
    icon: Sparkles,
  },
  {
    title: "Quality",
    description:
      "We focus on strong visual execution, thoughtful detail and work that reflects the standard our clients expect.",
    icon: CheckCircle2,
  },
  {
    title: "People First",
    description:
      "The experience matters as much as the final product, so we aim to make every collaboration clear and comfortable.",
    icon: Heart,
  },
];

const capabilities = [
  {
    title: "Photography",
    icon: Camera,
  },
  {
    title: "Films & Videography",
    icon: Video,
  },
  {
    title: "Event Coverage",
    icon: Users,
  },
  {
    title: "Creative Media",
    icon: Sparkles,
  },
];

export default function AboutPage() {
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
      <section className="px-5 pb-20 pt-24 sm:px-8 lg:px-12 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
                About MC Legacy
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                More than media.
                <span className="block text-[#c5a34a]">
                  We capture meaning.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
                MC Legacy Media is a creative media company focused on
                professional photography, videography, event coverage and
                visual storytelling for people, brands and organisations.
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/30">
                Our goal is simple: create work that feels intentional,
                professional and worth remembering while giving every client a
                clear and reliable experience from the first conversation to
                final delivery.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
                >
                  Explore Services

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Work With Us
                </Link>
              </div>
            </div>

            {/* Visual block */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[#c5a34a]/[0.04] blur-3xl" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0b0b0b]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#c5a34a]/10 via-transparent to-black" />

                <div className="absolute left-7 top-7">
                  <span className="rounded-full border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#c5a34a]/70">
                    MC Legacy Media
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Our Approach
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                    Creative. Reliable. Intentional.
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/35">
                    We combine creative thinking with professional execution to
                    produce work that reflects the importance of every project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
                Our Story
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Built around stories worth keeping.
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-white/35">
              <p>
                MC Legacy Media exists to help people and organisations preserve
                meaningful moments and communicate visually with confidence.
                Whether the project is personal, corporate or event-based, the
                work begins with understanding what matters to the client.
              </p>

              <p>
                From photography and film to broader creative media services,
                the focus remains on creating polished work while keeping the
                experience organised, responsive and professional.
              </p>

              <p>
                As the company grows, the same principle remains central:
                combine creativity, service and reliability to deliver visual
                work clients can confidently share and remember.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b]/85 p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c5a34a]/12 bg-[#c5a34a]/[0.06] text-[#c5a34a]">
              <Target size={20} />
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/20">
              Our Mission
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
              Create professional visual experiences with purpose.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/35">
              To provide dependable, creative and high-quality media services
              that help clients preserve important moments, communicate their
              stories and present themselves professionally.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b]/85 p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c5a34a]/12 bg-[#c5a34a]/[0.06] text-[#c5a34a]">
              <Eye size={20} />
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/20">
              Our Vision
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
              Become a trusted creative media partner.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/35">
              To build a recognised media brand known for memorable visual
              work, strong client relationships, consistent quality and a
              professional creative experience.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
              What We Value
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              The standard behind the work.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/35">
              The way we work matters just as much as what we deliver.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c5a34a]/20"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05] text-[#c5a34a]">
                    <Icon size={18} />
                  </div>

                  <h3 className="mt-6 text-base font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/30">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
                What We Offer
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Creative capabilities for different moments.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/35">
                MC Legacy supports a range of visual projects, from personal
                events to business and organisational media needs.
              </p>

              <Link
                href="/services"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#c5a34a]/70 transition hover:text-[#d4b45c]"
              >
                View all services

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((capability) => {
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.title}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/80 p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05] text-[#c5a34a]">
                      <Icon size={18} />
                    </div>

                    <p className="text-sm font-medium text-white/65">
                      {capability.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Areas served */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-[1400px] rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b]/80 p-7 sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/12 bg-[#c5a34a]/[0.06] text-[#c5a34a]">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                  Areas Served
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Serving clients across South Africa.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/30">
                  Availability may depend on the service, project requirements
                  and event location.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-5 py-3 text-sm text-white/55 transition hover:bg-white/[0.05] hover:text-white"
            >
              Ask About Your Location
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] border border-[#c5a34a]/10 bg-[#0b0b0b]">
          <div className="relative p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-24 -top-32 h-[340px] w-[340px] rounded-full bg-[#c5a34a]/[0.07] blur-[110px]" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#c5a34a]/70">
                  Work With MC Legacy
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Let’s create something worth remembering.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                  Tell us what you’re planning and we’ll help you figure out
                  the right next step.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
              >
                Start an Enquiry

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}