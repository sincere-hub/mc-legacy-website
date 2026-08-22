"use client";

import {
  Bell,
  Building2,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

export default function SettingsPage() {
  const { data: session, status, update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState<MessageState>(null);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState<MessageState>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  async function saveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setProfileSaving(true);
      setProfileMessage(null);

      const response = await fetch(
        "/api/settings/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update your profile.",
        );
      }

      await update({
        name: data.name,
      });

      setProfileMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      setProfileMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to update your profile.",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  async function changePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "The new passwords do not match.",
      });

      return;
    }

    try {
      setPasswordSaving(true);

      const response = await fetch(
        "/api/settings/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to change your password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully.",
      });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to change your password.",
      });
    } finally {
      setPasswordSaving(false);
    }
  }

  const role =
    session?.user?.role === "ADMIN"
      ? "Administrator"
      : session?.user?.role === "STAFF"
        ? "Staff"
        : "Portal User";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
            Account
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
            Manage your account, profile and security
            settings for the MC Legacy company portal.
          </p>
        </div>

        {/* Account overview */}
        <section className="mb-6 rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.07] text-lg font-semibold text-[#d4b45c]">
              {getInitials(session?.user?.name ?? null)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="truncate text-lg font-semibold text-white/85">
                  {status === "loading"
                    ? "Loading..."
                    : session?.user?.name ||
                      "Portal User"}
                </h2>

                <span className="rounded-full border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#d4b45c]">
                  {role}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-white/30">
                <Mail size={13} />

                <span className="truncate">
                  {session?.user?.email || "No email"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-green-500/10 bg-green-500/[0.04] px-3 py-2 text-xs text-green-400/70">
              <ShieldCheck size={15} />
              Authenticated
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Profile */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
            <div className="border-b border-white/[0.06] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-2.5 text-[#c5a34a]">
                  <UserRound size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Profile
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Your personal account information
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={saveProfile}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-xs font-medium text-white/45">
                  Full name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#c5a34a]/40 focus:bg-white/[0.035]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-white/45">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.015] py-3 pl-11 pr-4 text-sm text-white/30 outline-none"
                  />
                </div>

                <p className="mt-2 text-[11px] leading-5 text-white/20">
                  Your login email cannot be changed from
                  this page.
                </p>
              </div>

              <MessageBox message={profileMessage} />

              <button
                type="submit"
                disabled={
                  profileSaving ||
                  status === "loading"
                }
                className="flex items-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-xs font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {profileSaving ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={15} />
                )}

                {profileSaving
                  ? "Saving..."
                  : "Save profile"}
              </button>
            </form>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
            <div className="border-b border-white/[0.06] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-2.5 text-[#c5a34a]">
                  <KeyRound size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Security
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Update your account password
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={changePassword}
              className="space-y-5 p-6"
            >
              <PasswordInput
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrentPassword}
                setVisible={setShowCurrentPassword}
              />

              <PasswordInput
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNewPassword}
                setVisible={setShowNewPassword}
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-white/45">
                  Confirm new password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#c5a34a]/40"
                  />
                </div>
              </div>

              <p className="text-[11px] leading-5 text-white/20">
                Use at least 8 characters for your new
                password.
              </p>

              <MessageBox message={passwordMessage} />

              <button
                type="submit"
                disabled={passwordSaving}
                className="flex items-center gap-2 rounded-xl border border-[#c5a34a]/25 bg-[#c5a34a]/[0.07] px-5 py-3 text-xs font-semibold text-[#d4b45c] transition hover:bg-[#c5a34a]/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {passwordSaving ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <KeyRound size={15} />
                )}

                {passwordSaving
                  ? "Changing..."
                  : "Change password"}
              </button>
            </form>
          </section>
        </div>

        {/* Company */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
              <Building2 size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                MC Legacy Media
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">
                Company-wide configuration can be added
                here later, including business contact
                information, invoice details and branding.
              </p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Notification preferences
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">
                Notification preference controls can be
                connected once the notification system is
                fully wired to bookings, enquiries,
                contracts, invoices and files.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  setVisible,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/45">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          required
          autoComplete={
            label === "Current password"
              ? "current-password"
              : "new-password"
          }
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 pl-11 pr-12 text-sm text-white outline-none transition focus:border-[#c5a34a]/40"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={
            visible ? "Hide password" : "Show password"
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
        >
          {visible ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

function MessageBox({
  message,
}: {
  message: MessageState;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${
        message.type === "success"
          ? "border-green-500/20 bg-green-500/[0.06] text-green-300"
          : "border-red-500/20 bg-red-500/[0.06] text-red-300"
      }`}
    >
      {message.type === "success" && (
        <Check size={14} />
      )}

      {message.text}
    </div>
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

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}