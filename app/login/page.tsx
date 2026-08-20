"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ThreeDBackground from "@/components/ui/ThreeDBackground";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <ThreeDBackground>
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[440px]"
          style={{ perspective: 1200 }}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0d0d0d]/90 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10">
            {/* Gold accent */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a34a] to-transparent" />

            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c5a34a]/30 bg-[#c5a34a]/10">
                    <span className="text-sm font-bold tracking-tight text-[#d4b45c]">
                      MC
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold tracking-[0.18em] text-white">
                      MC LEGACY
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Member Portal
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Sign in to securely access your MC Legacy account.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/45"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@mclegacy.co.za"
                  required
                  className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/[0.15] focus:border-[#c5a34a]/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-[#c5a34a]/[0.07]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/45"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/[0.15] focus:border-[#c5a34a]/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-[#c5a34a]/[0.07]"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="relative h-12 w-full overflow-hidden rounded-xl bg-[#c5a34a] text-sm font-semibold text-[#090909] transition-all duration-300 hover:bg-[#d4b45c] hover:shadow-[0_10px_30px_rgba(197,163,74,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Signing in...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Sign in
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            {/* Footer */}
            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <p className="text-center text-[11px] tracking-wide text-white/25">
                Secure member access
              </p>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-white/20"
          >
            MC Legacy
          </motion.p>
        </motion.div>
      </main>
    </ThreeDBackground>
  );
}