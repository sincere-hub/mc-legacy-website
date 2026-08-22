"use client";

import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";

type SubmissionType = "BOOKING" | "ENQUIRY" | null;

type PublicForm = {
  name: string;
  email: string;
  phone: string;
  service: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
};

const emptyForm: PublicForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  eventType: "",
  eventDate: "",
  location: "",
  message: "",
};

const services = [
  "Photography",
  "Videography",
  "Event Coverage",
  "360° Services",
  "Creative Production",
  "Other",
];

export default function ContactPage() {
  const [submissionType, setSubmissionType] =
    useState<SubmissionType>(null);

  const [form, setForm] = useState<PublicForm>(emptyForm);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField(field: keyof PublicForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function chooseType(type: Exclude<SubmissionType, null>) {
    setSubmissionType(type);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  function changeType() {
    setSubmissionType(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!submissionType) {
      setError("Please choose Booking or Enquiry first.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const endpoint =
        submissionType === "BOOKING"
          ? "/api/bookings/public"
          : "/api/enquiries";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to submit your request.",
        );
      }

      if (submissionType === "BOOKING") {
        setSuccess(
          `Your booking request has been submitted successfully. Reference: ${data.reference}. MC Legacy will review the request and contact you.`,
        );
      } else {
        setSuccess(
          `Your enquiry has been submitted successfully. Reference: ${data.reference}. MC Legacy will contact you.`,
        );
      }

      setForm(emptyForm);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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
      <section className="px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pb-16 lg:pt-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-4xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c5a34a]/70">
              Book / Contact MC Legacy
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              What would you
              <span className="block text-[#c5a34a]">
                like to do?
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
              Choose whether you want to request a booking or simply send an
              enquiry. Your request will be routed to the correct MC Legacy
              management area.
            </p>
          </div>
        </div>
      </section>

      {/* Selection */}
      {!submissionType && (
        <section className="px-5 pb-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-5 md:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseType("BOOKING")}
                className="group rounded-[1.75rem] border border-white/[0.07] bg-[#0b0b0b]/85 p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#c5a34a]/30 hover:bg-[#c5a34a]/[0.04]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.07] text-[#c5a34a]">
                  <CalendarCheck2 size={23} />
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-[-0.03em]">
                  Make a Booking
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/35">
                  Choose this if you already know the service, event or project
                  you want and would like MC Legacy to review a booking request.
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-medium text-[#c5a34a]/70">
                  Continue to booking form
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() => chooseType("ENQUIRY")}
                className="group rounded-[1.75rem] border border-white/[0.07] bg-[#0b0b0b]/85 p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#c5a34a]/30 hover:bg-[#c5a34a]/[0.04]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.07] text-[#c5a34a]">
                  <HelpCircle size={23} />
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-[-0.03em]">
                  Send an Enquiry
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/35">
                  Choose this if you have questions, want more information or
                  would like to discuss your requirements before booking.
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-medium text-[#c5a34a]/70">
                  Continue to enquiry form
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
              <p className="text-center text-xs leading-6 text-white/25">
                A booking request is not automatically confirmed. MC Legacy
                will review the request and contact you before confirming the
                booking.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Form */}
      {submissionType && (
        <section className="px-5 pb-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            {/* Selected type */}
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.04] p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.07] text-[#c5a34a]">
                  {submissionType === "BOOKING" ? (
                    <CalendarCheck2 size={18} />
                  ) : (
                    <HelpCircle size={18} />
                  )}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/20">
                    You selected
                  </p>

                  <p className="mt-1 text-sm font-medium text-white/70">
                    {submissionType === "BOOKING"
                      ? "Make a Booking"
                      : "Send an Enquiry"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={changeType}
                disabled={submitting}
                className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/40 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
              >
                Change Selection
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
              {/* Information */}
              <div className="space-y-4">
                <InfoCard
                  icon={Mail}
                  title="Email"
                  value="Company email will be added here"
                />

                <InfoCard
                  icon={Phone}
                  title="Phone / WhatsApp"
                  value="Company contact number will be added here"
                />

                <InfoCard
                  icon={MapPin}
                  title="Service Area"
                  value="South Africa"
                />

                <div className="rounded-[1.5rem] border border-[#c5a34a]/10 bg-[#c5a34a]/[0.04] p-6">
                  {submissionType === "BOOKING" ? (
                    <CalendarCheck2
                      size={20}
                      className="text-[#c5a34a]"
                    />
                  ) : (
                    <HelpCircle size={20} className="text-[#c5a34a]" />
                  )}

                  <h2 className="mt-5 text-base font-semibold">
                    {submissionType === "BOOKING"
                      ? "Booking request"
                      : "Enquiry"}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    {submissionType === "BOOKING"
                      ? "Once submitted, this request will appear directly in the private Booking Management area for staff/admin review."
                      : "Once submitted, your enquiry will appear directly in the private Enquiry Management area for staff/admin review."}
                  </p>
                </div>
              </div>

              {/* Actual form */}
              <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#0b0b0b]/90">
                <div className="border-b border-white/[0.06] p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a34a]/70">
                      {submissionType === "BOOKING"
                        ? "Booking Form"
                        : "Enquiry Form"}
                    </p>

                    <span className="rounded-full border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#c5a34a]/70">
                      {submissionType}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                    {submissionType === "BOOKING"
                      ? "Request your booking"
                      : "Send your enquiry"}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/30">
                    Fields marked with an asterisk are required.
                  </p>
                </div>

                <form onSubmit={submitForm}>
                  <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
                    {error && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300 sm:col-span-2">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="flex gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300 sm:col-span-2">
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0"
                        />

                        <span>{success}</span>
                      </div>
                    )}

                    <FormField
                      label="Full Name"
                      required
                      value={form.name}
                      onChange={(value) => updateField("name", value)}
                      placeholder="Your full name"
                    />

                    <FormField
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(value) => updateField("email", value)}
                      placeholder="you@example.com"
                    />

                    <FormField
                      label="Phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(value) => updateField("phone", value)}
                      placeholder="+27..."
                    />

                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-white/45">
                        Service
                        <span className="ml-1 text-[#c5a34a]">*</span>
                      </span>

                      <select
                        required
                        value={form.service}
                        onChange={(event) =>
                          updateField("service", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c5a34a]/30"
                      >
                        <option value="">Select a service</option>

                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </label>

                    <FormField
                      label="Event / Project Type"
                      required
                      value={form.eventType}
                      onChange={(value) =>
                        updateField("eventType", value)
                      }
                      placeholder="Wedding, corporate event..."
                    />

                    <FormField
                      label="Preferred Date"
                      type="date"
                      value={form.eventDate}
                      onChange={(value) =>
                        updateField("eventDate", value)
                      }
                    />

                    <div className="sm:col-span-2">
                      <FormField
                        label="Location"
                        required
                        value={form.location}
                        onChange={(value) =>
                          updateField("location", value)
                        }
                        placeholder="Event or project location"
                      />
                    </div>

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-xs font-medium text-white/45">
                        {submissionType === "BOOKING"
                          ? "Additional Information"
                          : "Message"}

                        {submissionType === "ENQUIRY" && (
                          <span className="ml-1 text-[#c5a34a]">*</span>
                        )}
                      </span>

                      <textarea
                        required={submissionType === "ENQUIRY"}
                        rows={6}
                        value={form.message}
                        onChange={(event) =>
                          updateField("message", event.target.value)
                        }
                        placeholder={
                          submissionType === "BOOKING"
                            ? "Tell us anything else we should know about your booking..."
                            : "Tell us what you'd like to know..."
                        }
                        className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-[#c5a34a]/30 focus:bg-white/[0.035]"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-white/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <p className="max-w-md text-[11px] leading-5 text-white/20">
                      {submissionType === "BOOKING"
                        ? "Your booking request will be reviewed before it is confirmed."
                        : "Your enquiry will be reviewed and MC Legacy will respond using the details provided."}
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                          Sending...
                        </>
                      ) : (
                        <>
                          {submissionType === "BOOKING" ? (
                            <CalendarCheck2 size={15} />
                          ) : (
                            <Send size={15} />
                          )}

                          {submissionType === "BOOKING"
                            ? "Submit Booking Request"
                            : "Submit Enquiry"}

                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function FormField({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-white/45">
        {label}

        {required && <span className="ml-1 text-[#c5a34a]">*</span>}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-[#c5a34a]/30 focus:bg-white/[0.035]"
      />
    </label>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b]/80 p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05] text-[#c5a34a]">
        <Icon size={18} />
      </div>

      <p className="mt-5 text-[10px] uppercase tracking-[0.17em] text-white/20">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/55">
        {value}
      </p>
    </div>
  );
}