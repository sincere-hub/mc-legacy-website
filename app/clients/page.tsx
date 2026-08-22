"use client";

import {
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  notes: string | null;
  createdAt: string;
};

type ClientForm = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  province: string;
  notes: string;
};

const emptyForm: ClientForm = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  address: "",
  city: "",
  province: "",
  notes: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/clients", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load clients.");
      }

      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading clients.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) => {
      const searchableText = [
        client.name,
        client.email,
        client.phone,
        client.companyName,
        client.city,
        client.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [clients, search]);

  function updateField(
    field: keyof ClientForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openModal() {
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setForm(emptyForm);
  }

  async function createClient(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create client.");
      }

      setClients((current) => [data, ...current]);
      setSuccess("Client created successfully.");
      setForm(emptyForm);

      setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
      }, 800);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the client.",
      );
    } finally {
      setSaving(false);
    }
  }

  const companyCount = clients.filter(
    (client) => Boolean(client.companyName),
  ).length;

  const privateClientCount = clients.filter(
    (client) => !client.companyName,
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
              Company Portal
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Clients
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Manage client contact information, companies and locations.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
          >
            <Plus size={17} />
            Add Client
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Users size={19} />}
            title="Total Clients"
            value={clients.length}
          />

          <StatCard
            icon={<Building2 size={19} />}
            title="Companies"
            value={companyCount}
          />

          <StatCard
            icon={<Users size={19} />}
            title="Private Clients"
            value={privateClientCount}
          />
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Client Directory
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {filteredClients.length} client
                {filteredClients.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="relative w-full sm:w-[300px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clients..."
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
              />
            </div>
          </div>

          {error && !modalOpen && (
            <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />

                <p className="mt-4 text-xs text-white/30">
                  Loading clients...
                </p>
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <Users
                  size={28}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-5 text-sm font-medium text-white/70">
                  {search ? "No clients found" : "No clients yet"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  {search
                    ? "Try another name, email, phone number or company."
                    : "Clients created from bookings, enquiries or manually will appear here."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={openModal}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-2.5 text-xs font-semibold text-black"
                  >
                    <Plus size={15} />
                    Add First Client
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                    <tr>
                      <TableHeading>Client</TableHeading>
                      <TableHeading>Company</TableHeading>
                      <TableHeading>Contact</TableHeading>
                      <TableHeading>Location</TableHeading>
                      <TableHeading>Created</TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] text-xs font-semibold text-[#d4b45c]">
                              {getInitials(client.name)}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-white/80">
                                {client.name}
                              </p>

                              <p className="mt-1 text-xs text-white/25">
                                {client.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-white/60">
                            {client.companyName || "Private Client"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-xs text-white/40">
                              <Mail size={13} />
                              {client.email}
                            </p>

                            {client.phone && (
                              <p className="flex items-center gap-2 text-xs text-white/25">
                                <Phone size={13} />
                                {client.phone}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="flex items-center gap-2 text-xs text-white/40">
                            <MapPin size={13} />

                            {client.city || client.province
                              ? [client.city, client.province]
                                  .filter(Boolean)
                                  .join(", ")
                              : "Not provided"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-xs text-white/25">
                          {formatDate(client.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 lg:hidden">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] text-xs font-semibold text-[#d4b45c]">
                        {getInitials(client.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/80">
                          {client.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-white/25">
                          {client.email}
                        </p>

                        <div className="mt-4 space-y-2">
                          {client.companyName && (
                            <p className="flex items-center gap-2 text-xs text-white/40">
                              <Building2 size={13} />
                              {client.companyName}
                            </p>
                          )}

                          {client.phone && (
                            <p className="flex items-center gap-2 text-xs text-white/30">
                              <Phone size={13} />
                              {client.phone}
                            </p>
                          )}

                          {(client.city || client.province) && (
                            <p className="flex items-center gap-2 text-xs text-white/30">
                              <MapPin size={13} />
                              {[client.city, client.province]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <ChevronRight
                        size={16}
                        className="mt-2 text-white/15"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
          <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#c5a34a]/70">
                  Client Management
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Add New Client
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createClient}>
              <div className="max-h-[70vh] overflow-y-auto p-6">
                {error && (
                  <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">
                    {success}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                    placeholder="John Smith"
                  />

                  <FormField
                    label="Email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    placeholder="john@example.com"
                  />

                  <FormField
                    label="Phone"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    placeholder="+27 82 123 4567"
                  />

                  <FormField
                    label="Company"
                    value={form.companyName}
                    onChange={(value) =>
                      updateField("companyName", value)
                    }
                    placeholder="Company name"
                  />

                  <FormField
                    label="City"
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                    placeholder="Johannesburg"
                  />

                  <FormField
                    label="Province"
                    value={form.province}
                    onChange={(value) =>
                      updateField("province", value)
                    }
                    placeholder="Gauteng"
                  />

                  <div className="sm:col-span-2">
                    <FormField
                      label="Address"
                      value={form.address}
                      onChange={(value) =>
                        updateField("address", value)
                      }
                      placeholder="Street address"
                    />
                  </div>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-medium text-white/45">
                      Notes
                    </span>

                    <textarea
                      value={form.notes}
                      onChange={(event) =>
                        updateField("notes", event.target.value)
                      }
                      rows={4}
                      placeholder="Additional information about this client..."
                      className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#c5a34a] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/30">
            {title}
          </p>

          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
      </div>
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
        {required && (
          <span className="ml-1 text-[#c5a34a]">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
      />
    </label>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 0 || !parts[0]) {
    return "CL";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}