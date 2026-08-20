"use client";

import {
  Check,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type UserRole = "ADMIN" | "STAFF" | "CLIENT";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  client: {
    id: string;
    companyName: string | null;
    city: string | null;
    province: string | null;
  } | null;
};

type UserForm = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  role: "CLIENT",
  passwordHash: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load users.");
      }

      setUsers(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading users.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const searchableText = [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.client?.companyName,
        user.client?.city,
        user.client?.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [users, search]);

  function updateField(
    field: keyof UserForm,
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

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user.");
      }

      setUsers((current) => [data, ...current]);

      setSuccess("User created successfully.");

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
          : "Something went wrong while creating the user.",
      );
    } finally {
      setSaving(false);
    }
  }

  const activeUsers = users.filter((user) => user.isActive).length;
  const admins = users.filter((user) => user.role === "ADMIN").length;
  const staff = users.filter((user) => user.role === "STAFF").length;
  const clients = users.filter((user) => user.role === "CLIENT").length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />

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

      <div className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
              Company Portal
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Users
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Manage administrators, staff members and client users.
            </p>
          </div>

          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] active:scale-[0.98]"
          >
            <Plus size={17} />
            Add User
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={<UsersIcon size={19} />}
            title="Total Users"
            value={users.length}
          />

          <StatCard
            icon={<Check size={19} />}
            title="Active"
            value={activeUsers}
          />

          <StatCard
            icon={<Shield size={19} />}
            title="Admins"
            value={admins}
          />

          <StatCard
            icon={<UsersIcon size={19} />}
            title="Staff"
            value={staff}
          />

          <StatCard
            icon={<UsersIcon size={19} />}
            title="Clients"
            value={clients}
          />
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                User Directory
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {filteredUsers.length} user
                {filteredUsers.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="relative w-full sm:w-[320px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users..."
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-[#c5a34a]/30"
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
                  Loading users...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  <UsersIcon
                    size={25}
                    strokeWidth={1.5}
                    className="text-white/25"
                  />
                </div>

                <h3 className="mt-5 text-sm font-medium text-white/70">
                  {search ? "No users found" : "No users yet"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  {search
                    ? "Try a different name, email or role."
                    : "Add your first user to start managing your company portal."}
                </p>

                {!search && (
                  <button
                    onClick={openModal}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-[#d4b45c]"
                  >
                    <Plus size={15} />
                    Add First User
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      User
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      Role
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      Client
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] text-xs font-semibold text-[#d4b45c]">
                            {getInitials(user.name)}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-white/80">
                              {user.name || "Unnamed User"}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-xs text-white/40">
                            <Mail size={13} />
                            {user.email}
                          </p>

                          {user.phone && (
                            <p className="flex items-center gap-2 text-xs text-white/25">
                              <Phone size={13} />
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-6 py-5">
                        {user.client ? (
                          <div>
                            <p className="text-sm text-white/60">
                              {user.client.companyName ||
                                "Private Client"}
                            </p>

                            {(user.client.city ||
                              user.client.province) && (
                              <p className="mt-1 text-xs text-white/25">
                                {[
                                  user.client.city,
                                  user.client.province,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-white/20">
                            Not linked
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge active={user.isActive} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
          <div className="my-8 w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#c5a34a]/70">
                  User Management
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Add New User
                </h2>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createUser}>
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
                    onChange={(value) =>
                      updateField("name", value)
                    }
                    placeholder="John Smith"
                  />

                  <FormField
                    label="Email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                    placeholder="john@example.com"
                  />

                  <FormField
                    label="Phone"
                    value={form.phone}
                    onChange={(value) =>
                      updateField("phone", value)
                    }
                    placeholder="+27 82 123 4567"
                  />

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium text-white/45">
                      Role
                    </span>

                    <select
                      value={form.role}
                      onChange={(event) =>
                        updateField(
                          "role",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c5a34a]/30"
                    >
                      <option value="CLIENT">Client</option>
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </label>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Password"
                      required
                      type="password"
                      value={form.passwordHash}
                      onChange={(value) =>
                        updateField(
                          "passwordHash",
                          value,
                        )
                      }
                      placeholder="Enter temporary password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#c5a34a] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create User"}
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

          <p className="mt-1 text-2xl font-semibold">
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
          <span className="ml-1 text-[#c5a34a]">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-[#c5a34a]/30 focus:bg-white/[0.035]"
      />
    </label>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const labels = {
    ADMIN: "Administrator",
    STAFF: "Staff",
    CLIENT: "Client",
  };

  return (
    <span className="inline-flex rounded-full border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] px-2.5 py-1 text-[10px] font-medium text-[#d4b45c]">
      {labels[role]}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
        active
          ? "border-green-500/15 bg-green-500/[0.06] text-green-400"
          : "border-white/[0.08] bg-white/[0.03] text-white/30"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-green-400" : "bg-white/25"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function getInitials(name: string | null) {
  if (!name) {
    return "MC";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}