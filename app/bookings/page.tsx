"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTATION_SENT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

type Booking = {
  id: string;
  reference: string;
  service: string;
  eventType: string;
  eventDate: string | null;
  location: string | null;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;

  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    companyName: string | null;
    city: string | null;
    province: string | null;
  };

  enquiry: {
    id: string;
    reference: string;
    name: string;
    email: string;
    phone: string;
  } | null;

  _count: {
    files: number;
    contracts: number;
    invoices: number;
    messages: number;
  };
};

const statusOptions: {
  value: BookingStatus;
  label: string;
}[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUOTATION_SENT", label: "Quotation Sent" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | BookingStatus
  >("ALL");

  const [selected, setSelected] = useState<Booking | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/bookings", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load bookings.",
        );
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading bookings.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        booking.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        booking.reference,
        booking.service,
        booking.eventType,
        booking.location,
        booking.status,
        booking.client.name,
        booking.client.email,
        booking.client.phone,
        booking.client.companyName,
        booking.client.city,
        booking.client.province,
        booking.enquiry?.reference,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [bookings, search, statusFilter]);

  const confirmed = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const inProgress = bookings.filter(
    (booking) => booking.status === "IN_PROGRESS",
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  async function updateStatus(
    booking: Booking,
    status: BookingStatus,
  ) {
    if (booking.status === status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: booking.id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update booking status.",
        );
      }

      setBookings((current) =>
        current.map((item) =>
          item.id === data.id ? data : item,
        ),
      );

      setSelected(data);

      setSuccess(
        `Booking status updated to ${formatStatus(
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
          : "Something went wrong while updating the booking.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.06] blur-[150px]" />

        <div className="absolute -bottom-48 -right-48 h-[550px] w-[550px] rounded-full bg-[#8a6a22]/[0.05] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
            Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Bookings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
            Manage client booking requests, confirmed work and
            connected business records.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Bookings"
            value={bookings.length}
          />

          <StatCard
            label="Confirmed"
            value={confirmed}
          />

          <StatCard
            label="In Progress"
            value={inProgress}
          />

          <StatCard
            label="Completed"
            value={completed}
          />
        </div>

        {error && !selected && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Booking Directory
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {filteredBookings.length} booking
                {filteredBookings.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
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
                  placeholder="Search bookings..."
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "ALL"
                      | BookingStatus,
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

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />

                <p className="mt-4 text-xs text-white/30">
                  Loading bookings...
                </p>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="text-center">
                <CalendarDays
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-4 text-sm font-medium text-white/60">
                  No bookings found
                </h3>

                <p className="mt-2 text-xs text-white/25">
                  Public booking requests and converted enquiries
                  will appear here.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                    <tr>
                      <TableHeading>Reference</TableHeading>
                      <TableHeading>Client</TableHeading>
                      <TableHeading>Service</TableHeading>
                      <TableHeading>Event</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading>Records</TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        onClick={() => {
                          setSelected(booking);
                          setError("");
                          setSuccess("");
                        }}
                        className="cursor-pointer border-b border-white/[0.04] transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <p className="text-xs font-medium text-[#d4b45c]">
                            {booking.reference}
                          </p>

                          {booking.enquiry && (
                            <p className="mt-1 text-[10px] text-white/20">
                              From {booking.enquiry.reference}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.05] text-[#c5a34a]">
                              <UserRound size={16} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-white/70">
                                {booking.client.companyName ||
                                  booking.client.name}
                              </p>

                              <p className="mt-1 text-xs text-white/25">
                                {booking.client.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-white/55">
                            {booking.service}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-xs text-white/45">
                            {booking.eventType}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/25">
                            <CalendarDays size={12} />

                            {booking.eventDate
                              ? formatDate(
                                  booking.eventDate,
                                )
                              : "No date"}
                          </p>

                          {booking.location && (
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/25">
                              <MapPin size={12} />
                              {booking.location}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge
                            status={booking.status}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            <RecordBadge
                              icon={FileText}
                              value={booking._count.files}
                              label="Files"
                            />

                            <RecordBadge
                              icon={FileText}
                              value={booking._count.contracts}
                              label="Contracts"
                            />

                            <RecordBadge
                              icon={Receipt}
                              value={booking._count.invoices}
                              label="Invoices"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 lg:hidden">
                {filteredBookings.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => {
                      setSelected(booking);
                      setError("");
                      setSuccess("");
                    }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-medium text-[#c5a34a]/70">
                          {booking.reference}
                        </p>

                        <h3 className="mt-2 text-sm font-medium text-white/75">
                          {booking.client.companyName ||
                            booking.client.name}
                        </h3>

                        <p className="mt-1 text-xs text-white/25">
                          {booking.service}
                        </p>
                      </div>

                      <StatusBadge
                        status={booking.status}
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-xs text-white/30">
                        <CalendarDays size={13} />

                        {booking.eventDate
                          ? formatDate(
                              booking.eventDate,
                            )
                          : "No event date"}
                      </p>

                      {booking.location && (
                        <p className="flex items-center gap-2 text-xs text-white/30">
                          <MapPin size={13} />
                          {booking.location}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-lg"
          onClick={() => {
            if (!updatingStatus) {
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
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-xs text-[#c5a34a]/70">
                  {selected.reference}
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {selected.client.companyName ||
                    selected.client.name}
                </h2>

                {selected.client.companyName && (
                  <p className="mt-1 text-xs text-white/25">
                    {selected.client.name}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                disabled={updatingStatus}
                className="rounded-xl p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">
                  <CheckCircle2 size={16} />
                  {success}
                </div>
              )}

              <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.035] p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                      Booking Status
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
                      disabled={updatingStatus}
                      onChange={(event) =>
                        updateStatus(
                          selected,
                          event.target
                            .value as BookingStatus,
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

              <div className="flex items-center gap-2 text-xs text-white/25">
                <Clock3 size={13} />

                Booking created{" "}
                {formatDateTime(
                  selected.createdAt,
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Detail
                  icon={Mail}
                  label="Email"
                  value={selected.client.email}
                />

                <Detail
                  icon={Phone}
                  label="Phone"
                  value={
                    selected.client.phone ||
                    "Not provided"
                  }
                />

                <Detail
                  icon={CalendarDays}
                  label="Event"
                  value={
                    selected.eventDate
                      ? `${selected.eventType} · ${formatDate(
                          selected.eventDate,
                        )}`
                      : selected.eventType
                  }
                />

                <Detail
                  icon={MapPin}
                  label="Location"
                  value={
                    selected.location ||
                    "Not provided"
                  }
                />
              </div>

              {(selected.client.city ||
                selected.client.province) && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                    Client Location
                  </p>

                  <p className="mt-2 text-sm text-white/55">
                    {[
                      selected.client.city,
                      selected.client.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                  Service
                </p>

                <p className="mt-2 text-sm text-white/65">
                  {selected.service}
                </p>
              </div>

              {selected.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                    Booking Notes
                  </p>

                  <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-white/40">
                      {selected.notes}
                    </p>
                  </div>
                </div>
              )}

              {selected.enquiry && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                    Related Enquiry
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#d4b45c]">
                    {selected.enquiry.reference}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
                  Connected Records
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <ConnectedRecord
                    icon={FileText}
                    label="Files"
                    value={selected._count.files}
                  />

                  <ConnectedRecord
                    icon={FileText}
                    label="Contracts"
                    value={selected._count.contracts}
                  />

                  <ConnectedRecord
                    icon={Receipt}
                    label="Invoices"
                    value={selected._count.invoices}
                  />
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
  status: BookingStatus;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a34a]/12 bg-[#c5a34a]/[0.05] px-2.5 py-1 text-[10px] font-medium text-[#d4b45c]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#c5a34a]" />

      {formatStatus(status)}
    </span>
  );
}

function RecordBadge({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof FileText;
  value: number;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] text-white/30">
      <Icon size={11} />
      {value} {label}
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

function ConnectedRecord({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <Icon
        size={16}
        className="text-[#c5a34a]/60"
      />

      <p className="mt-3 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs text-white/25">
        {label}
      </p>
    </div>
  );
}

function formatStatus(
  status: BookingStatus,
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