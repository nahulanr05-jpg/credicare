"use client";

import Link from "next/link";
import { 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Clock, 
  Flame, 
  Building2, 
  Compass, 
  Bot, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  PieChart,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent blur-3xl opacity-70"></div>
      <div className="pointer-events-none absolute top-[600px] -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-emerald-600/5 to-transparent blur-3xl opacity-50"></div>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm backdrop-blur-md mb-8 animate-pulse-glow">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Next-Gen Banking Early-Warning & Adaptive Intervention</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-white">Financial Firewall</span>
            <span className="mt-2 block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Don't predict the default. Prevent it.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
            An AI-powered financial early-warning system that detects behavioral signals of financial distress, simulates your financial future, and creates personalized intervention plans before a crisis happens.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition-all transform hover:-translate-y-0.5"
            >
              Explore Your Financial Health
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/bank"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-sm backdrop-blur-md hover:bg-slate-800 hover:border-slate-600 transition"
            >
              <Layers className="h-4 w-4 text-purple-400" />
              View Bank Intelligence Console
            </Link>
          </div>

          {/* Real-time Hero Live Dashboard Teaser */}
          <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl ring-1 ring-white/5 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Live Behavioral Radar — Telemetry Stream Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded bg-slate-800 px-2 py-1 font-mono text-emerald-400 font-medium">
                  DEMO PROFILE #1024
                </span>
                <span>Rohan Kapoor (Salaried)</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <span className="text-xs text-slate-400">Financial Health Score</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-400 font-mono-num">68</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <span className="mt-1 inline-block text-[11px] font-semibold text-amber-300">
                  ⚠ Early Warning Stage
                </span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <span className="text-xs text-slate-400">Salary-Cycle Spike</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-rose-400 font-mono-num">+24%</span>
                </div>
                <span className="mt-1 inline-block text-[11px] text-slate-400">
                  First 7 days after credit
                </span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <span className="text-xs text-slate-400">Emergency Buffer</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-cyan-400 font-mono-num">₹42,000</span>
                </div>
                <span className="mt-1 inline-block text-[11px] text-slate-400">
                  1.3 Months Outflow Runway
                </span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <span className="text-xs text-slate-400">Projected 90-Day Drift</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-400 font-mono-num">68 → 51</span>
                </div>
                <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
                  Intervention Ready
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section className="border-t border-slate-800/80 bg-slate-950/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              The Fundamental Paradigm Shift
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Why Traditional Lending Systems Fail Before Defaults
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="rounded-2xl border border-rose-900/40 bg-rose-950/10 p-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-200">The Problem</h3>
                  <p className="text-xs text-slate-400">Post-Facto Reactive Banking</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Traditional credit bureaus and core banking systems react <strong className="text-rose-300">after</strong> missed payments, dishonored cheques, or formal delinquency occurs. By the time a default is registered:
              </p>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Customer liquidity has already been completely exhausted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>High-cost emergency borrowing exacerbates the distress spiral.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Banks incur heavy provision costs and contentious recovery actions.</span>
                </li>
              </ul>
            </div>

            {/* The Financial Firewall Way */}
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/10 p-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-200">The Solution</h3>
                  <p className="text-xs text-emerald-400">Financial Firewall Continuous Telemetry</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Financial Firewall continuously analyzes transaction rhythms, identifying silent leading distress indicators <strong className="text-emerald-300">60 to 90 days before</strong> any missed obligation:
              </p>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Early detection of salary-cycle spikes, savings erosion, and lifestyle inflation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Financial Time Machine projects future trajectory without shame.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Delivers automated, bilateral intervention plans that avert crisis.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Flow Pipeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              System Architecture
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              The 6-Stage Autonomous Intervention Loop
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: "01", name: "TRACK", desc: "Daily transactions, cashflow velocity, and category flows." },
              { step: "02", name: "UNDERSTAND", desc: "Extract Financial DNA traits and spending behavior signatures." },
              { step: "03", name: "PREDICT", desc: "Transparent 0-100 Financial Health & Resilience scoring." },
              { step: "04", name: "SIMULATE", desc: "Time Machine & Crash stress tests across 180 days." },
              { step: "05", name: "INTERVENE", desc: "'Prevent This Future' adaptive roadmaps and proactive alerts." },
              { step: "06", name: "RECOVER", desc: "Snowball, Avalanche, and Balanced Shield debt recovery." },
            ].map((stage, idx) => (
              <div key={stage.step} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left glass-panel">
                <span className="text-[11px] font-mono font-bold text-emerald-400">{stage.step}</span>
                <h4 className="mt-1 text-sm font-bold text-white tracking-wider">{stage.name}</h4>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="border-t border-slate-800/80 bg-slate-950/60 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              Core Capabilities
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Banking Intelligence Re-engineered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/dashboard" className="glass-panel-interactive rounded-2xl p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-5 border border-emerald-500/20">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Financial Digital Twin</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                Real-time synchronized model of your income, expenses, debt obligations, emergency buffer, and solvency score that dynamically adapts as you transact.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400">
                Open Twin <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>

            <Link href="/future" className="glass-panel-interactive rounded-2xl p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 mb-5 border border-teal-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Financial Time Machine</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                Project your financial state across 30, 60, 90, and 180 days. Visualizes buffer depletion trajectories before liquidity vanishes.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-teal-400">
                Travel Forward <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>

            <Link href="/simulator" className="glass-panel-interactive rounded-2xl p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-5 border border-amber-500/20">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Financial Crash Simulator</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                Stress-test against 10% or 20% salary reductions, ₹50,000 emergency medical expenses, or job disruption. Includes 1-click 'Prevent This Future' action plans.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-amber-400">
                Run Simulation <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>

            <Link href="/loan-readiness" className="glass-panel-interactive rounded-2xl p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-5 border border-blue-500/20">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Loan Readiness & Reverse Planner</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                Responsible borrowing assessment. If not currently ready, automatically builds a 5-month adaptive milestone roadmap to get ready.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-400">
                Check Readiness <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>

            <Link href="/debt-recovery" className="glass-panel-interactive rounded-2xl p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-5 border border-purple-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Debt Recovery Mode</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                Comparative optimization between Avalanche (Highest Cost), Snowball (Smallest Balance), and Balanced Shield strategies without depleting core emergency reserves.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-purple-400">
                View Strategies <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>

            <Link href="/ai-coach" className="glass-panel-interactive rounded-2xl p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-5 border border-cyan-500/20">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Financial Coach</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                Context-aware AI advisor grounded in your actual income, debt obligations, and health score. Answers "Can I afford a ₹20,000 purchase?" accurately.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400">
                Chat with Coach <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-slate-950 p-10 backdrop-blur-xl shadow-2xl">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Experience the Financial Early-Warning System
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
            Instantly switch between five pre-seeded customer personas or enter the Bank Risk Console without needing an account.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
            >
              Launch Customer Dashboard
            </Link>
            <Link
              href="/bank"
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              Launch Bank Console
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
