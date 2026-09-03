"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Sparkles, ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, isBank: boolean = false) => {
    setLoading(true);
    setError("");

    await signIn("credentials", {
      email: demoEmail,
      isDemo: "true",
      redirect: false,
    });

    if (isBank) {
      router.push("/bank");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 mb-4">
            <ShieldAlert className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Access Financial Firewall</h1>
          <p className="text-xs text-slate-400 mt-1">Autonomous Early-Warning Financial Intelligence</p>
        </div>

        {/* Instant Judge Demo Persona Selection */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-xl mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Instant Hackathon Demo Mode
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            No credentials required. Select a pre-configured scenario to evaluate the intelligence models immediately:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin("earlywarning@demo.com")}
              className="flex flex-col text-left rounded-xl border border-amber-500/30 bg-amber-950/30 p-2.5 hover:bg-amber-900/40 transition"
            >
              <span className="text-xs font-bold text-amber-300">Early Warning (68)</span>
              <span className="text-[10px] text-slate-400">Salary spike & saving drop</span>
            </button>
            <button
              onClick={() => handleDemoLogin("healthy@demo.com")}
              className="flex flex-col text-left rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2.5 hover:bg-emerald-900/40 transition"
            >
              <span className="text-xs font-bold text-emerald-300">Healthy (84)</span>
              <span className="text-[10px] text-slate-400">High buffer, low debt</span>
            </button>
            <button
              onClick={() => handleDemoLogin("stress@demo.com")}
              className="flex flex-col text-left rounded-xl border border-orange-500/30 bg-orange-950/30 p-2.5 hover:bg-orange-900/40 transition"
            >
              <span className="text-xs font-bold text-orange-300">Stress (45)</span>
              <span className="text-[10px] text-slate-400">High DTI, low cushion</span>
            </button>
            <button
              onClick={() => handleDemoLogin("recovery@demo.com")}
              className="flex flex-col text-left rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-2.5 hover:bg-cyan-900/40 transition"
            >
              <span className="text-xs font-bold text-cyan-300">Recovery Plan</span>
              <span className="text-[10px] text-slate-400">42 → 59 Trajectory</span>
            </button>
          </div>
          <button
            onClick={() => handleDemoLogin("analyst@bank.com", true)}
            className="w-full mt-2 flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-950/40 px-3 py-2 text-xs font-bold text-purple-300 hover:bg-purple-900/40 transition"
          >
            <span>Enter as Bank Risk Officer (Portfolio Radar)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Standard Credentials Box */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In with Credentials"}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-emerald-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
