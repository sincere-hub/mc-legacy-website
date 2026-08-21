"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  city: string | null;
  province: string | null;
};

type Contract = {
  id: string;
  title: string;
  reference: string;
  status: "DRAFT" | "SENT" | "SIGNED" | "EXPIRED" | "CANCELLED";
  expiresAt: string | null;
  createdAt: string;

  client: Client;

  booking?: {
    id: string;
    reference: string;
    service: string;
    eventType: string;
    status: string;
  } | null;
};

const statusStyles = {
  DRAFT: "border-white/10 bg-white/[0.04] text-white/45",
  SENT: "border-blue-400/20 bg-blue-400/[0.06] text-blue-300",
  SIGNED:
    "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
  EXPIRED:
    "border-orange-400/20 bg-orange-400/[0.06] text-orange-300",
  CANCELLED:
    "border-red-400/20 bg-red-400/[0.06] text-red-300",
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    clientId: "",
    status: "DRAFT",
    expiresAt: "",
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [contractsResponse, clientsResponse] = await Promise.all([
        fetch("/api/contracts", {
          cache: "no-store",
        }),
        fetch("/api/clients", {
          cache: "no-store",
        }),
      ]);

      const contractsData = await contractsResponse.json();
      const clientsData = await clientsResponse.json();

      if (!contractsResponse.ok) {
        throw new Error(
          contractsData.error || "Failed to load contracts.",
        );
      }

      if (!clientsResponse.ok) {
        throw new Error(
          clientsData.error || "Failed to load clients.",
        );
      }

      setContracts(
        Array.isArray(contractsData) ? contractsData : [],
      );

      setClients(
        Array.isArray(clientsData) ? clientsData : [],
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load contracts.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField(field: string, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create contract.",
        );
      }

      setForm({
        title: "",
        clientId: "",
        status: "DRAFT",
        expiresAt: "",
      });

      setShowModal(false);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create contract.",
      );
    } finally {
      setSaving(false);
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const searchableText = [
      contract.title,
      contract.reference,
      contract.status,
      contract.client.name,
      contract.client.email,
      contract.client.phone,
      contract.client.companyName,
      contract.client.city,
      contract.client.province,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const signedCount = contracts.filter(
    (contract) => contract.status === "SIGNED",
  ).length;

  const pendingCount = contracts.filter(
    (contract) =>
      contract.status === "DRAFT" ||
      contract.status === "SENT",
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c5a34a]/20 bg-[#c5a34a]/[0.07]">
                <FileText
                  size={15}
                  className="text-[#c5a34a]"
                />
              </div>

              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                Legal & Agreements
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Contracts
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Create, manage and track agreements between MC
              Legacy and your clients.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-[#080808] transition hover:bg-[#d4b45c]"
          >
            <Plus size={17} />
            New Contract
          </motion.button>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            [contracts.length.toString(), "Total contracts"],
            [signedCount.toString(), "Signed"],
            [pendingCount.toString(), "Pending"],
          ].map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.08,
              }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-5 transition-colors hover:border-[#c5a34a]/20"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-white/30">
                {label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {error && !showModal && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90"
        >
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white/80">
                Contract Registry
              </h2>

              <p className="mt-1 text-xs text-white/25">
                All client agreements are stored here.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search contracts..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 hover:border-white/[0.12] focus:border-[#c5a34a]/40 focus:bg-white/[0.04]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />
            </div>
          ) : filteredContracts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs uppercase tracking-[0.12em] text-white/25">
                    <th className="px-6 py-4 font-medium">
                      Contract
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Client
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Created
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Expires
                    </th>

                    <th className="px-6 py-4" />
                  </tr>
                </thead>

                <tbody>
                  {filteredContracts.map(
                    (contract, index) => (
                      <motion.tr
                        key={contract.id}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                        className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div className="font-medium text-white/80">
                            {contract.title}
                          </div>

                          <div className="mt-1 font-mono text-[11px] text-white/25">
                            {contract.reference}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
                              <User
                                size={15}
                                className="text-white/30"
                              />
                            </div>

                            <div>
                              <div className="text-sm text-white/65">
                                {contract.client
                                  .companyName ||
                                  contract.client.name}
                              </div>

                              <div className="mt-1 text-xs text-white/25">
                                {contract.client
                                  .companyName
                                  ? contract.client.name
                                  : contract.client.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] ${
                              statusStyles[
                                contract.status
                              ]
                            }`}
                          >
                            {contract.status.replace(
                              "_",
                              " ",
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-white/40">
                          {formatDate(
                            contract.createdAt,
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-white/40">
                          {contract.expiresAt
                            ? formatDate(
                                contract.expiresAt,
                              )
                            : "No expiry"}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-white/25 transition hover:bg-white/[0.05] hover:text-[#c5a34a]"
                          >
                            <ChevronRight size={17} />
                          </button>
                        </td>
                      </motion.tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center p-8">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="max-w-sm text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.05]"
                >
                  <FileText
                    size={25}
                    strokeWidth={1.4}
                    className="text-[#c5a34a]/70"
                  />
                </motion.div>

                <h2 className="mt-6 text-base font-semibold text-white/80">
                  {search
                    ? "No contracts found"
                    : "No contracts yet"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/30">
                  {search
                    ? "Try searching with another contract or client name."
                    : "Create your first agreement and assign it to an existing client."}
                </p>

                {!search && (
                  <motion.button
                    type="button"
                    onClick={() =>
                      setShowModal(true)
                    }
                    whileHover={{ y: -2 }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#c5a34a]/20 bg-[#c5a34a]/[0.07] px-4 py-2.5 text-xs font-medium text-[#d4b45c] transition hover:bg-[#c5a34a]/[0.12]"
                  >
                    Create your first contract

                    <ChevronRight size={14} />
                  </motion.button>
                )}
              </motion.div>
            </div>
          )}
        </motion.section>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowModal(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    New Contract
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Create an agreement for an
                    existing client.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={saving}
                  className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6"
              >
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/45">
                      Contract title
                      <span className="ml-1 text-[#c5a34a]">
                        *
                      </span>
                    </label>

                    <input
                      required
                      value={form.title}
                      onChange={(event) =>
                        updateField(
                          "title",
                          event.target.value,
                        )
                      }
                      placeholder="Service Agreement"
                      className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#c5a34a]/40"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/45">
                      Client
                      <span className="ml-1 text-[#c5a34a]">
                        *
                      </span>
                    </label>

                    <select
                      required
                      value={form.clientId}
                      onChange={(event) =>
                        updateField(
                          "clientId",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#111] px-4 text-sm text-white outline-none transition focus:border-[#c5a34a]/40"
                    >
                      <option value="">
                        Select a client
                      </option>

                      {clients.map(
                        (client) => (
                          <option
                            key={client.id}
                            value={client.id}
                          >
                            {client.companyName ||
                              client.name}
                            {client.companyName
                              ? ` — ${client.name}`
                              : ` — ${client.email}`}
                          </option>
                        ),
                      )}
                    </select>

                    {clients.length === 0 && (
                      <p className="mt-2 text-xs text-orange-300/70">
                        You need to create a
                        client before creating a
                        contract.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/45">
                        Status
                      </label>

                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateField(
                            "status",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#111] px-4 text-sm text-white outline-none transition focus:border-[#c5a34a]/40"
                      >
                        <option value="DRAFT">
                          Draft
                        </option>

                        <option value="SENT">
                          Sent
                        </option>

                        <option value="SIGNED">
                          Signed
                        </option>

                        <option value="EXPIRED">
                          Expired
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/45">
                        Expiry date
                      </label>

                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                        />

                        <input
                          type="date"
                          value={
                            form.expiresAt
                          }
                          onChange={(event) =>
                            updateField(
                              "expiresAt",
                              event.target
                                .value,
                            )
                          }
                          className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#c5a34a]/40"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    disabled={saving}
                    className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    disabled={
                      saving ||
                      clients.length === 0
                    }
                    type="submit"
                    className="rounded-xl bg-[#c5a34a] px-6 py-3 text-sm font-semibold text-[#080808] transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Creating..."
                      : "Create Contract"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}