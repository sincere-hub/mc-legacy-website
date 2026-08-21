"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTATION_SENT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

type Enquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  eventType: string;
  eventDate: string | null;
  location: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;

  client: {
    id: string;
    companyName: string | null;

    user: {
      name: string | null;
      email: string;
      phone: string | null;
    };
  } | null;

  booking: {
    id: string;
    reference: string;
    status: EnquiryStatus;
  } | null;
};

const statusOptions: {
  value: EnquiryStatus;
  label: string;
}[] = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
  },
  {
    value: "QUOTATION_SENT",
    label: "Quotation Sent",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | EnquiryStatus
  >("ALL");

  const [selected, setSelected] = useState<Enquiry | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [convertingBooking, setConvertingBooking] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/enquiries", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load enquiries.",
        );
      }

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading enquiries.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        enquiry.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        enquiry.reference,
        enquiry.name,
        enquiry.email,
        enquiry.phone,
        enquiry.service,
        enquiry.eventType,
        enquiry.location,
        enquiry.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [enquiries, search, statusFilter]);

  const counts = {
    total: enquiries.length,

    new: enquiries.filter(
      (item) => item.status === "NEW",
    ).length,

    contacted: enquiries.filter(
      (item) => item.status === "CONTACTED",
    ).length,

    confirmed: enquiries.filter(
      (item) => item.status === "CONFIRMED",
    ).length,
  };

  async function updateStatus(
    enquiry: Enquiry,
    status: EnquiryStatus,
  ) {
    if (enquiry.status === status) {
      return;
    }

    try {
      setUpdatingStatus(true);

      setError("");
      setSuccess("");

      const response = await fetch("/api/enquiries", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: enquiry.id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update enquiry status.",
        );
      }

      setEnquiries((current) =>
        current.map((item) =>
          item.id === data.id ? data : item,
        ),
      );

      setSelected(data);

      setSuccess(
        `Status updated to ${formatStatus(
          data.status,
        )}.`,
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the enquiry.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function convertToBooking(enquiry: Enquiry) {
    if (enquiry.status !== "CONFIRMED") {
      setError(
        "The enquiry must be confirmed before it can be converted to a booking.",
      );

      return;
    }

    if (enquiry.booking) {
      setError(
        "This enquiry has already been converted to a booking.",
      );

      return;
    }

    try {
      setConvertingBooking(true);

      setError("");
      setSuccess("");

      const response = await fetch("/api/bookings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          enquiryId: enquiry.id,
        }),
      });

      const booking = await response.json();

      if (!response.ok) {
        throw new Error(
          booking.error ||
            "Failed to convert enquiry to booking.",
        );
      }

      const updatedEnquiry: Enquiry = {
        ...enquiry,

        booking: {
          id: booking.id,
          reference: booking.reference,
          status: booking.status,
        },
      };

      setSelected(updatedEnquiry);

      setEnquiries((current) =>
        current.map((item) =>
          item.id === enquiry.id
            ? updatedEnquiry
            : item,
        ),
      );

      setSuccess(
        `Booking ${booking.reference} created successfully.`,
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the booking.",
      );
    } finally {
      setConvertingBooking(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.06] blur-[150px]" />

        <div className="absolute -bottom-48 -right-48 h-[550px] w-[550px] rounded-full bg-[#8a6a22]/[0.05] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
            Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Enquiries
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
            Review enquiries submitted from the public
            website and manage their progress.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total"
            value={counts.total}
          />

          <StatCard
            label="New"
            value={counts.new}
          />

          <StatCard
            label="Contacted"
            value={counts.contacted}
          />

          <StatCard
            label="Confirmed"
            value={counts.confirmed}
          />
        </div>

        {/* Page error */}
        {error && !selected && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Enquiry directory */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Enquiry Directory
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {filteredEnquiries.length} result
                {filteredEnquiries.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-[280px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search enquiries..."
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "ALL"
                      | EnquiryStatus,
                  )
                }
                className="rounded-xl border border-white/[0.07] bg-[#111] px-4 py-2.5 text-sm text-white/60 outline-none focus:border-[#c5a34a]/30"
              >
                <option value="ALL">
                  All Statuses
                </option>

                {statusOptions.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />

                <p className="mt-4 text-xs text-white/30">
                  Loading enquiries...
                </p>
              </div>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            /* Empty state */
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="text-center">
                <UserRound
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-4 text-sm font-medium text-white/60">
                  No enquiries found
                </h3>

                <p className="mt-2 text-xs text-white/25">
                  Public enquiries will appear here.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                    <tr>
                      <TableHeading>
                        Reference
                      </TableHeading>

                      <TableHeading>
                        Customer
                      </TableHeading>

                      <TableHeading>
                        Service
                      </TableHeading>

                      <TableHeading>
                        Event
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>

                      <TableHeading>
                        Received
                      </TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEnquiries.map((enquiry) => (
                      <tr
                        key={enquiry.id}
                        onClick={() => {
                          setSelected(enquiry);
                          setError("");
                          setSuccess("");
                        }}
                        className="cursor-pointer border-b border-white/[0.04] transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <p className="text-xs font-medium text-[#d4b45c]">
                            {enquiry.reference}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-white/75">
                            {enquiry.name}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {enquiry.email}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-white/55">
                            {enquiry.service}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-xs text-white/45">
                            {enquiry.eventType}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {enquiry.eventDate
                              ? formatDate(
                                  enquiry.eventDate,
                                )
                              : "No date"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge
                            status={enquiry.status}
                          />
                        </td>

                        <td className="px-6 py-5 text-xs text-white/30">
                          {formatDate(
                            enquiry.createdAt,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-4 lg:hidden">
                {filteredEnquiries.map((enquiry) => (
                  <button
                    key={enquiry.id}
                    type="button"
                    onClick={() => {
                      setSelected(enquiry);
                      setError("");
                      setSuccess("");
                    }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-medium text-[#c5a34a]/70">
                          {enquiry.reference}
                        </p>

                        <h3 className="mt-2 text-sm font-medium text-white/75">
                          {enquiry.name}
                        </h3>

                        <p className="mt-1 text-xs text-white/25">
                          {enquiry.service}
                        </p>
                      </div>

                      <StatusBadge
                        status={enquiry.status}
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-xs text-white/30">
                        <MapPin size={13} />
                        {enquiry.location}
                      </p>

                      <p className="flex items-center gap-2 text-xs text-white/30">
                        <CalendarDays size={13} />

                        {enquiry.eventDate
                          ? formatDate(
                              enquiry.eventDate,
                            )
                          : "No date supplied"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Enquiry modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-lg"
          onClick={() => {
            if (
              !updatingStatus &&
              !convertingBooking
            ) {
              setSelected(null);
            }
          }}
        >
          <div
            className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b] shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-xs text-[#c5a34a]/70">
                  {selected.reference}
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {selected.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                disabled={
                  updatingStatus ||
                  convertingBooking
                }
                className="rounded-xl p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Modal error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Modal success */}
              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">
                  <CheckCircle2 size={16} />

                  {success}
                </div>
              )}

              {/* Status */}
              <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.035] p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                      Enquiry Status
                    </p>

                    <div className="mt-2">
                      <StatusBadge
                        status={selected.status}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={selected.status}
                      disabled={
                        updatingStatus ||
                        convertingBooking
                      }
                      onChange={(event) =>
                        updateStatus(
                          selected,
                          event.target
                            .value as EnquiryStatus,
                        )
                      }
                      className="min-w-[190px] appearance-none rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-[#c5a34a]/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {statusOptions.map(
                        (status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ),
                      )}
                    </select>

                    {updatingStatus && (
                      <Loader2
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#c5a34a]"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Convert to booking */}
              {selected.status ===
                "CONFIRMED" &&
                !selected.booking && (
                  <div className="rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.04] p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-medium text-white/70">
                          Ready to book
                        </p>

                        <p className="mt-1 max-w-md text-xs leading-5 text-white/30">
                          This enquiry is confirmed.
                          Convert it into a booking to
                          begin managing files,
                          contracts and invoices.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          convertingBooking ||
                          updatingStatus
                        }
                        onClick={() =>
                          convertToBooking(
                            selected,
                          )
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {convertingBooking ? (
                          <>
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />

                            Creating...
                          </>
                        ) : (
                          <>
                            <CalendarDays
                              size={15}
                            />

                            Convert to Booking
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              {/* Existing booking */}
              {selected.booking && (
                <div className="flex items-center gap-3 rounded-xl border border-green-500/15 bg-green-500/[0.04] p-4">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-green-400"
                  />

                  <div>
                    <p className="text-xs font-medium text-green-300">
                      Booking created
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                      {
                        selected.booking
                          .reference
                      }
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/20">
                      {formatStatus(
                        selected.booking
                          .status,
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Received */}
              <div className="flex items-center gap-2 text-xs text-white/25">
                <Clock3 size={13} />

                Received{" "}
                {formatDateTime(
                  selected.createdAt,
                )}
              </div>

              {/* Contact details */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail
                  icon={Mail}
                  label="Email"
                  value={selected.email}
                />

                <Detail
                  icon={Phone}
                  label="Phone"
                  value={selected.phone}
                />

                <Detail
                  icon={CalendarDays}
                  label="Event"
                  value={
                    selected.eventDate
                      ? `${
                          selected.eventType
                        } · ${formatDate(
                          selected.eventDate,
                        )}`
                      : selected.eventType
                  }
                />

                <Detail
                  icon={MapPin}
                  label="Location"
                  value={selected.location}
                />
              </div>

              {/* Service */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                  Service
                </p>

                <p className="mt-2 text-sm text-white/65">
                  {selected.service}
                </p>
              </div>

              {/* Customer message */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                  Customer Message
                </p>

                <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/40">
                    {selected.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
      {children}
    </th>
  );
}

function StatusBadge({
  status,
}: {
  status: EnquiryStatus;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a34a]/12 bg-[#c5a34a]/[0.05] px-2.5 py-1 text-[10px] font-medium text-[#d4b45c]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />

      {formatStatus(status)}
    </span>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-white/25">
        <Icon size={14} />

        <span className="text-[10px] uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm text-white/55">
        {value}
      </p>
    </div>
  );
}

function formatStatus(
  status: EnquiryStatus,
) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}