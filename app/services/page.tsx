import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clapperboard,
  Layers3,
  Sparkles,
  Video,
} from "lucide-react";

const services = [
  {
    title: "Photography",
    description:
      "Professional photography for events, brands, celebrations and special occasions, delivered with a polished visual style.",
    icon: Camera,
    features: [
      "Event photography",
      "Portraits",
      "Corporate photography",
      "Lifestyle photography",
    ],
  },
  {
    title: "Films & Videography",
    description:
      "Cinematic video production designed to capture stories, atmosphere and memorable moments with professional quality.",
    icon: Video,
    features: [
      "Event videography",
      "Highlight films",
      "Corporate videos",
      "Creative productions",
    ],
  },
  {
    title: "Event Coverage",
    description:
      "Complete visual coverage for important events, combining professional planning, photography and video where required.",
    icon: Clapperboard,
    features: [
      "Weddings",
      "Corporate events",
      "Celebrations",
      "Private functions",
    ],
  },
  {
    title: "360° Services",
    description:
      "Immersive visual experiences and 360-degree media services for supported events, activations and creative productions.",
    icon: Layers3,
    features: [
      "360° event experiences",
      "Interactive media",
      "Event activations",
      "Custom creative setups",
    ],
  },
  {
    title: "Creative Production",
    description:
      "Visual concepts and media production designed for organisations, businesses, campaigns and creative projects.",
    icon: Sparkles,
    features: [
      "Creative direction",
      "Visual concepts",
      "Brand content",
      "Media production",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.06] blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[150px]" />

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
          <div className="max-w-4xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
              What We Do
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Creative services built
              <span className="block text-[#c5a34a]">around your story.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
              MC Legacy Media provides professional visual services for
              events, brands and organisations, combining creativity,
              reliability and attention to detail.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b]/85 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c5a34a]/20"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a34a]/30 to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c5a34a]/12 bg-[#c5a34a]/[0.06] text-[#c5a34a]">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>

                    <span className="text-[10px] font-medium text-white/15">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="mt-7 text-xl font-semibold tracking-[-0.025em] text-white">
                    {service.title}
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/35">
                    {service.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-xs text-white/40"
                      >
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-[#c5a34a]/65"
                        />

                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-[#c5a34a]/70 transition hover:text-[#d4b45c]"
                  >
                    Enquire about this service

                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
                How It Works
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                From enquiry to delivery.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/35">
                The process is designed to keep communication clear from the
                first conversation through to project completion.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ProcessCard
                number="01"
                title="Tell us about it"
                description="Submit an enquiry with the service, date, location and project details."
              />

              <ProcessCard
                number="02"
                title="We plan"
                description="MC Legacy reviews the request and confirms the next steps with you."
              />

              <ProcessCard
                number="03"
                title="We create"
                description="The team delivers the agreed service with professional production and communication."
              />
            </div>
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
                  Start Your Project
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Ready to create something memorable?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                  Send us your project or event details and the MC Legacy team
                  will get back to you.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
              >
                Make an Enquiry

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

function ProcessCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/80 p-6">
      <p className="text-[10px] font-medium tracking-[0.15em] text-[#c5a34a]/60">
        {number}
      </p>

      <h3 className="mt-5 text-base font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/30">
        {description}
      </p>
    </div>
  );
}