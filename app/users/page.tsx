"use client";

import {
  Check,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCog,
  Users as UsersIcon,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserRole = "ADMIN" | "STAFF";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

type UserForm = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  role: "STAFF",
  password: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

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
        throw new Error(
          data.error || "Failed to load users.",
        );
      }

      setUsers(Array.isArray(data) ? data : []);
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
        user.isActive ? "active" : "inactive",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [users, search]);

  const activeUsers = users.filter(
    (user) => user.isActive,
  ).length;

  const admins = users.filter(
    (user) => user.role === "ADMIN",
  ).length;

  const staff = users.filter(
    (user) => user.role === "STAFF",
  ).length;

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
    setError("");
  }

  function showSuccess(message: string) {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess("");
    }, 2500);
  }

  async function createUser(
    event: FormEvent<HTMLFormElement>,
  ) {
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
        throw new Error(
          data.error || "Failed to create user.",
        );
      }

      setUsers((current) => [
        data,
        ...current,
      ]);

      setSuccess(
        `${formatRole(data.role)} account created successfully.`,
      );

      setForm(emptyForm);

      window.setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
      }, 900);
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

  async function changeRole(
    user: User,
    role: UserRole,
  ) {
    if (user.role === role) {
      return;
    }

    try {
      setUpdatingId(user.id);
      setError("");

      const response = await fetch("/api/users", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: user.id,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to change user role.",
        );
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === data.id ? data : item,
        ),
      );

      showSuccess(
        `${data.name || data.email} is now ${formatRole(
          data.role,
        )}.`,
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to change user role.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleUserStatus(user: User) {
    try {
      setUpdatingId(user.id);
      setError("");

      const response = await fetch("/api/users", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: user.id,
          isActive: !user.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update account status.",
        );
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === data.id ? data : item,
        ),
      );

      showSuccess(
        `${data.name || data.email} ${
          data.isActive
            ? "activated"
            : "deactivated"
        } successfully.`,
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update account status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteUser(user: User) {
    const confirmed = window.confirm(
      `Delete ${
        user.name || user.email
      }? This account will permanently lose access.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(user.id);
      setError("");

      const response = await fetch(
        `/api/users?id=${encodeURIComponent(user.id)}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete user.",
        );
      }

      setUsers((current) =>
        current.filter(
          (item) => item.id !== user.id,
        ),
      );

      showSuccess("User deleted successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete user.",
      );
    } finally {
      setDeletingId(null);
    }
  }

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
              Administration
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              User Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Manage administrator and staff accounts that
              have access to the MC Legacy management portal.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c]"
          >
            <Plus size={17} />
            Add Account
          </button>
        </div>

        {error && !modalOpen && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && !modalOpen && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<UsersIcon size={19} />}
            title="Total Accounts"
            value={users.length}
          />

          <StatCard
            icon={<Check size={19} />}
            title="Active"
            value={activeUsers}
          />

          <StatCard
            icon={<Shield size={19} />}
            title="Administrators"
            value={admins}
          />

          <StatCard
            icon={<UserCog size={19} />}
            title="Staff"
            value={staff}
          />
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Portal Accounts
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {filteredUsers.length} account
                {filteredUsers.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="relative w-full sm:w-[320px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search accounts..."
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />

                <p className="mt-4 text-xs text-white/30">
                  Loading accounts...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <UsersIcon
                  size={28}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-5 text-sm font-medium text-white/70">
                  {search
                    ? "No accounts found"
                    : "No accounts yet"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  {search
                    ? "Try another name, email or role."
                    : "Add an administrator or staff account to the portal."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                    <tr>
                      <TableHeading>User</TableHeading>
                      <TableHeading>Contact</TableHeading>
                      <TableHeading>Role</TableHeading>
                      <TableHeading>Status</TableHeading>

                      <th className="px-6 py-4 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        Actions
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
                          <select
                            value={user.role}
                            disabled={
                              updatingId === user.id ||
                              deletingId === user.id
                            }
                            onChange={(event) =>
                              changeRole(
                                user,
                                event.target
                                  .value as UserRole,
                              )
                            }
                            className="rounded-lg border border-white/[0.08] bg-[#111] px-3 py-2 text-xs text-white/60 outline-none focus:border-[#c5a34a]/30 disabled:opacity-40"
                          >
                            <option value="STAFF">
                              Staff
                            </option>

                            <option value="ADMIN">
                              Administrator
                            </option>
                          </select>
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge
                            active={user.isActive}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={
                                updatingId === user.id ||
                                deletingId === user.id
                              }
                              onClick={() =>
                                toggleUserStatus(user)
                              }
                              className={`rounded-lg border px-3 py-2 text-xs transition disabled:opacity-40 ${
                                user.isActive
                                  ? "border-orange-500/15 bg-orange-500/[0.05] text-orange-300 hover:bg-orange-500/[0.08]"
                                  : "border-green-500/15 bg-green-500/[0.05] text-green-300 hover:bg-green-500/[0.08]"
                              }`}
                            >
                              {updatingId === user.id
                                ? "Updating..."
                                : user.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                deletingId === user.id ||
                                updatingId === user.id
                              }
                              onClick={() =>
                                deleteUser(user)
                              }
                              className="rounded-lg border border-red-500/15 bg-red-500/[0.05] p-2 text-red-300 transition hover:bg-red-500/[0.1] disabled:opacity-40"
                              title="Delete user"
                            >
                              {deletingId === user.id ? (
                                <span className="block h-4 w-4 animate-spin rounded-full border border-red-300/20 border-t-red-300" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 lg:hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] text-xs font-semibold text-[#d4b45c]">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white/80">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="mt-1 truncate text-xs text-white/25">
                          {user.email}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <RoleBadge role={user.role} />

                          <StatusBadge
                            active={user.isActive}
                          />
                        </div>

                        <div className="mt-4 grid gap-2">
                          <select
                            value={user.role}
                            disabled={
                              updatingId === user.id ||
                              deletingId === user.id
                            }
                            onChange={(event) =>
                              changeRole(
                                user,
                                event.target
                                  .value as UserRole,
                              )
                            }
                            className="rounded-lg border border-white/[0.08] bg-[#111] px-3 py-2 text-xs text-white/60"
                          >
                            <option value="STAFF">
                              Staff
                            </option>

                            <option value="ADMIN">
                              Administrator
                            </option>
                          </select>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                toggleUserStatus(user)
                              }
                              disabled={
                                updatingId === user.id
                              }
                              className="flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/50"
                            >
                              {user.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteUser(user)
                              }
                              disabled={
                                deletingId === user.id
                              }
                              className="rounded-lg border border-red-500/15 bg-red-500/[0.05] px-3 py-2 text-red-300"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
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
          <div className="my-8 w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#c5a34a]/70">
                  Administration
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Add Portal Account
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
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
                    placeholder="john@mclegacy.co.za"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a34a]/30"
                    >
                      <option value="STAFF">
                        Staff
                      </option>

                      <option value="ADMIN">
                        Administrator
                      </option>
                    </select>
                  </label>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Temporary Password"
                      required
                      type="password"
                      value={form.password}
                      onChange={(value) =>
                        updateField(
                          "password",
                          value,
                        )
                      }
                      placeholder="Minimum 8 characters"
                    />

                    <p className="mt-2 text-xs text-white/20">
                      The password is securely hashed
                      before being stored.
                    </p>
                  </div>
                </div>
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
                  disabled={saving}
                  className="rounded-xl bg-[#c5a34a] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Account"}
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
          <span className="ml-1 text-[#c5a34a]">
            *
          </span>
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
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c5a34a]/30"
      />
    </label>
  );
}

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  return (
    <span className="inline-flex rounded-full border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] px-2.5 py-1 text-[10px] font-medium text-[#d4b45c]">
      {formatRole(role)}
    </span>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
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
          active
            ? "bg-green-400"
            : "bg-white/25"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatRole(role: UserRole) {
  return role === "ADMIN"
    ? "Administrator"
    : "Staff";
}

function getInitials(
  name: string | null,
) {
  if (!name) {
    return "MC";
  }

  const parts =
    name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}