"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type LoginRole = "ADMIN" | "STAFF";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [role, setRole] =
    useState<LoginRole>("ADMIN");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

   const result = await signIn(
  "credentials",
  {
    email: email
      .trim()
      .toLowerCase(),

    password,

    portalRole: role,

    redirect: false,
  },
);
      if (!result) {
        throw new Error(
          "Unable to complete sign in.",
        );
      }

      if (result.error) {
        throw new Error(
          "Invalid email or password.",
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2
          size={28}
          className="animate-spin text-[#c5a34a]"
        />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-12 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a34a]/[0.08] blur-[150px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.06] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize:
              "80px 80px",
          }}
        />
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 text-xs text-white/45 backdrop-blur-md transition hover:border-[#c5a34a]/20 hover:bg-white/[0.04] hover:text-white"
      >
        <ArrowLeft size={15} />

        Back to website
      </Link>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto h-28 w-56">
            <Image
              src="/images/mc-legacy-logo.png"
              alt="MC Legacy Media"
              fill
              priority
              sizes="224px"
              className="object-contain"
            />
          </div>

          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.24em] text-[#c5a34a]/70">
            Company Portal
          </p>
        </div>

        {/* Login card */}
        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0b0b0b]/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-7 py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] p-2.5 text-[#c5a34a]">
                <ShieldCheck
                  size={19}
                />
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em]">
                  Welcome back
                </h1>

                <p className="mt-1 text-xs text-white/30">
                  Sign in to the MC Legacy
                  management portal.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-7"
          >
            {/* Role selector */}
            <div>
              <label className="mb-2 block text-xs font-medium text-white/45">
                Sign in as
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setRole("ADMIN")
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-medium transition ${
                    role === "ADMIN"
                      ? "border-[#c5a34a]/30 bg-[#c5a34a]/[0.08] text-[#d4b45c]"
                      : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:bg-white/[0.04] hover:text-white/60"
                  }`}
                >
                  <ShieldCheck
                    size={15}
                  />

                  Administrator
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole("STAFF")
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-medium transition ${
                    role === "STAFF"
                      ? "border-[#c5a34a]/30 bg-[#c5a34a]/[0.08] text-[#d4b45c]"
                      : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:bg-white/[0.04] hover:text-white/60"
                  }`}
                >
                  <UserRound size={15} />

                  Staff
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mt-5">
              <label className="mb-2 block text-xs font-medium text-white/45">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  required
                  autoComplete="email"
                  placeholder={
                    role === "ADMIN"
                      ? "admin@mclegacy.co.za"
                      : "staff@mclegacy.co.za"
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#c5a34a]/40 focus:bg-white/[0.035]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-5">
              <label className="mb-2 block text-xs font-medium text-white/45">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#c5a34a]/40 focus:bg-white/[0.035]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
                >
                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign in as{" "}
                  {role === "ADMIN"
                    ? "Administrator"
                    : "Staff"}

                  <ArrowRight
                    size={17}
                  />
                </>
              )}
            </button>

            <p className="mt-6 text-center text-[11px] leading-5 text-white/20">
              Access is restricted to
              authorised MC Legacy Media
              administrators and staff
              members.
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.14em] text-white/15">
          MC Legacy Media · Secure Portal
        </p>
      </div>
    </main>
  );
}