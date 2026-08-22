"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Plus,
  Receipt,
  Search,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  city: string | null;
  province: string | null;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  description: string | null;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
  amountPaid: string | number;
  currency: string;
  status:
    | "DRAFT"
    | "SENT"
    | "PARTIALLY_PAID"
    | "PAID"
    | "OVERDUE"
    | "CANCELLED";
  dueDate: string | null;
  createdAt: string;

  client: Client;

  booking?: {
    id: string;
    reference: string;
    service: string;
    status: string;
  } | null;
};

type InvoiceForm = {
  clientId: string;
  invoiceNumber: string;
  description: string;
  subtotal: string;
  tax: string;
  dueDate: string;
};

const emptyForm: InvoiceForm = {
  clientId: "",
  invoiceNumber: "",
  description: "",
  subtotal: "",
  tax: "",
  dueDate: "",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<InvoiceForm>(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [invoiceResponse, clientResponse] = await Promise.all([
        fetch("/api/invoices", {
          cache: "no-store",
        }),
        fetch("/api/clients", {
          cache: "no-store",
        }),
      ]);

      const invoiceData = await invoiceResponse.json();
      const clientData = await clientResponse.json();

      if (!invoiceResponse.ok) {
        throw new Error(
          invoiceData.error || "Failed to load invoices.",
        );
      }

      if (!clientResponse.ok) {
        throw new Error(
          clientData.error || "Failed to load clients.",
        );
      }

      setInvoices(
        Array.isArray(invoiceData) ? invoiceData : [],
      );

      setClients(
        Array.isArray(clientData) ? clientData : [],
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load invoice data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return invoices;
    }

    return invoices.filter((invoice) => {
      const text = [
        invoice.invoiceNumber,
        invoice.description,
        invoice.client.name,
        invoice.client.email,
        invoice.client.phone,
        invoice.client.companyName,
        invoice.client.city,
        invoice.client.province,
        invoice.status,
        invoice.booking?.reference,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [invoices, search]);

  const totalOutstanding = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      const total = Number(invoice.total);
      const paid = Number(invoice.amountPaid);

      return sum + Math.max(total - paid, 0);
    }, 0);
  }, [invoices]);

  const totalPaid = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      return sum + Number(invoice.amountPaid);
    }, 0);
  }, [invoices]);

  const pendingInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "SENT" ||
      invoice.status === "PARTIALLY_PAID" ||
      invoice.status === "OVERDUE",
  ).length;

  function updateField(
    field: keyof InvoiceForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openModal() {
    const nextNumber = `INV-${String(
      invoices.length + 1,
    ).padStart(4, "0")}`;

    setForm({
      ...emptyForm,
      invoiceNumber: nextNumber,
    });

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
    setError("");
    setSuccess("");
  }

  async function createInvoice(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create invoice.",
        );
      }

      setInvoices((current) => [
        data,
        ...current,
      ]);

      setSuccess(
        "Invoice created successfully.",
      );

      window.setTimeout(() => {
        setModalOpen(false);
        setForm(emptyForm);
        setSuccess("");
      }, 900);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create invoice.",
      );
    } finally {
      setSaving(false);
    }
  }

  const subtotalNumber =
    Number(form.subtotal) || 0;

  const taxNumber =
    Number(form.tax) || 0;

  const calculatedTotal =
    subtotalNumber + taxNumber;

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
              Invoices
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Create, track and manage invoices for your clients.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
          >
            <Plus size={17} />

            Create Invoice
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Invoices"
            value={String(invoices.length)}
            icon={<Receipt size={19} />}
          />

          <StatCard
            title="Pending"
            value={String(pendingInvoices)}
            icon={<CalendarDays size={19} />}
          />

          <StatCard
            title="Outstanding"
            value={formatCurrency(
              totalOutstanding,
            )}
            icon={<FileText size={19} />}
          />

          <StatCard
            title="Paid"
            value={formatCurrency(totalPaid)}
            icon={<Check size={19} />}
          />
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Invoice Management
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {filteredInvoices.length} invoice
                {filteredInvoices.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            <div className="relative w-full sm:w-[300px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search invoices..."
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
                  Loading invoices...
                </p>
              </div>
            </div>
          ) : filteredInvoices.length ===
            0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <Receipt
                  size={28}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-5 text-sm font-medium text-white/70">
                  {search
                    ? "No invoices found"
                    : "No invoices yet"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  {search
                    ? "Try a different invoice number or client."
                    : "Create your first invoice to start tracking client payments."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                    <tr>
                      <TableHeading>
                        Invoice
                      </TableHeading>

                      <TableHeading>
                        Client
                      </TableHeading>

                      <TableHeading>
                        Amount
                      </TableHeading>

                      <TableHeading>
                        Due
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInvoices.map(
                      (invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                        >
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-white/75">
                              {
                                invoice.invoiceNumber
                              }
                            </p>

                            <p className="mt-1 max-w-[240px] truncate text-xs text-white/25">
                              {invoice.description ||
                                "No description"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-sm text-white/60">
                              {invoice.client
                                .companyName ||
                                invoice.client
                                  .name}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              {
                                invoice.client
                                  .email
                              }
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-white/70">
                              {formatCurrency(
                                Number(
                                  invoice.total,
                                ),
                              )}
                            </p>

                            {Number(
                              invoice.amountPaid,
                            ) > 0 && (
                              <p className="mt-1 text-xs text-green-400/70">
                                {formatCurrency(
                                  Number(
                                    invoice.amountPaid,
                                  ),
                                )}{" "}
                                paid
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-5 text-xs text-white/40">
                            {formatDate(
                              invoice.dueDate,
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                invoice.status
                              }
                            />
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 lg:hidden">
                {filteredInvoices.map(
                  (invoice) => (
                    <div
                      key={invoice.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white/80">
                            {
                              invoice.invoiceNumber
                            }
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {invoice.client
                              .companyName ||
                              invoice.client
                                .name}
                          </p>

                          <p className="mt-1 text-[11px] text-white/20">
                            {
                              invoice.client
                                .email
                            }
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            invoice.status
                          }
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-medium text-white/70">
                            {formatCurrency(
                              Number(
                                invoice.total,
                              ),
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">
                            Due
                          </p>

                          <p className="mt-1 text-sm text-white/50">
                            {formatDate(
                              invoice.dueDate,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
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
                  Finance
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Create Invoice
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl p-2 text-white/30 hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createInvoice}>
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

                {clients.length === 0 ? (
                  <div className="rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.05] p-5">
                    <p className="text-sm font-medium text-[#d4b45c]">
                      No clients available
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                      You need to create a client
                      before creating an invoice.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-medium text-white/45">
                          Client
                          <span className="ml-1 text-[#c5a34a]">
                            *
                          </span>
                        </span>

                        <div className="relative">
                          <select
                            required
                            value={
                              form.clientId
                            }
                            onChange={(
                              event,
                            ) =>
                              updateField(
                                "clientId",
                                event.target
                                  .value,
                              )
                            }
                            className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3 pr-10 text-sm text-white outline-none focus:border-[#c5a34a]/30"
                          >
                            <option value="">
                              Select a client
                            </option>

                            {clients.map(
                              (client) => (
                                <option
                                  key={
                                    client.id
                                  }
                                  value={
                                    client.id
                                  }
                                >
                                  {client.companyName ||
                                    client.name}{" "}
                                  —{" "}
                                  {
                                    client.email
                                  }
                                </option>
                              ),
                            )}
                          </select>

                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                          />
                        </div>
                      </label>
                    </div>

                    <FormField
                      label="Invoice Number"
                      required
                      value={
                        form.invoiceNumber
                      }
                      onChange={(value) =>
                        updateField(
                          "invoiceNumber",
                          value,
                        )
                      }
                      placeholder="INV-0001"
                    />

                    <FormField
                      label="Due Date"
                      type="date"
                      value={
                        form.dueDate
                      }
                      onChange={(value) =>
                        updateField(
                          "dueDate",
                          value,
                        )
                      }
                    />

                    <div className="sm:col-span-2">
                      <FormField
                        label="Description"
                        value={
                          form.description
                        }
                        onChange={(value) =>
                          updateField(
                            "description",
                            value,
                          )
                        }
                        placeholder="Photography services..."
                      />
                    </div>

                    <FormField
                      label="Subtotal"
                      required
                      type="number"
                      value={
                        form.subtotal
                      }
                      onChange={(value) =>
                        updateField(
                          "subtotal",
                          value,
                        )
                      }
                      placeholder="0.00"
                    />

                    <FormField
                      label="Tax"
                      type="number"
                      value={form.tax}
                      onChange={(value) =>
                        updateField(
                          "tax",
                          value,
                        )
                      }
                      placeholder="0.00"
                    />

                    <div className="sm:col-span-2 rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.05] p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-white/30">
                            Invoice Total
                          </p>

                          <p className="mt-2 text-2xl font-semibold">
                            {formatCurrency(
                              calculatedTotal,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/10 p-3 text-[#c5a34a]">
                          <Receipt
                            size={20}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm text-white/50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    clients.length === 0
                  }
                  className="rounded-xl bg-[#c5a34a] px-6 py-3 text-sm font-semibold text-black disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-white/30">
            {title}
          </p>

          <p className="mt-1 truncate text-2xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
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
          <span className="ml-1 text-[#c5a34a]">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        required={required}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        step={
          type === "number"
            ? "0.01"
            : undefined
        }
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
      />
    </label>
  );
}

function StatusBadge({
  status,
}: {
  status: Invoice["status"];
}) {
  const styles: Record<
    Invoice["status"],
    string
  > = {
    DRAFT:
      "border-white/[0.08] bg-white/[0.03] text-white/40",
    SENT:
      "border-blue-500/15 bg-blue-500/[0.06] text-blue-400",
    PARTIALLY_PAID:
      "border-yellow-500/15 bg-yellow-500/[0.06] text-yellow-400",
    PAID:
      "border-green-500/15 bg-green-500/[0.06] text-green-400",
    OVERDUE:
      "border-red-500/15 bg-red-500/[0.06] text-red-400",
    CANCELLED:
      "border-white/[0.08] bg-white/[0.03] text-white/25",
  };

  const labels: Record<
    Invoice["status"],
    string
  > = {
    DRAFT: "Draft",
    SENT: "Sent",
    PARTIALLY_PAID:
      "Partially Paid",
    PAID: "Paid",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    },
  ).format(value);
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Not set";
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