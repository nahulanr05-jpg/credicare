"use client";

import { useEffect, useState } from "react";
import { 
  Dna, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  TrendingUp,
  Layers,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function FinancialDNAPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dnaRes, dashRes] = await Promise.all([
        fetch("/api/financial-dna"),
        fetch("/api/dashboard"),
      ]);
      const dnaData = await dnaRes.json();
      const dashData = await dashRes.json();
      setData({ ...dnaData, metrics: dashData.metrics, health: dashData.health });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Synthesizing Financial Digital Twin & DNA...</span>
        </div>
      </div>
    );
  }

  const { primaryTrait, secondaryTrait, allTraits, behaviorSignals, metrics, health } = data || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Your Financial Digital Twin & DNA
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Bi-directional Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time behavioral representation mapping cash velocity to financial risk states
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Re-synchronize Model
        </button>
      </div>

      {/* SECTION 10: THE FINANCIAL DIGITAL TWIN CENTERPIECE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950">
              <Activity className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                YOUR FINANCIAL DIGITAL TWIN
              </h2>
              <p className="text-xs text-slate-400">Autonomous Solvency State Machine</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
            Synchronized with Live Accounts
          </span>
        </div>

        {/* State Flow Pipeline: Income -> Expenses -> Savings -> Debt -> Buffer -> Health -> Risk */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
          
          {/* 1. Income */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">1. Inflow</span>
            <div className="my-3">
              <span className="text-xs text-slate-400 block">Monthly Income</span>
              <span className="text-lg font-bold text-white font-mono-num">
                ₹{(metrics?.monthlyIncome || 50000).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Baseline Stable
            </div>
          </div>

          {/* 2. Expenses */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">2. Outflow</span>
            <div className="my-3">
              <span className="text-xs text-slate-400 block">Expenses</span>
              <span className="text-lg font-bold text-rose-300 font-mono-num">
                ₹{(metrics?.monthlyExpenses || 31500).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> High Discretionary
            </div>
          </div>

          {/* 3. Savings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">3. Retention</span>
            <div className="my-3">
              <span className="text-xs text-slate-400 block">Net Savings</span>
              <span className="text-lg font-bold text-cyan-300 font-mono-num">
                ₹{(metrics?.monthlySavings || 8500).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {((metrics?.savingsRate || 0.17) * 100).toFixed(0)}% Retention
            </div>
          </div>

          {/* 4. Debt */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">4. Leverage</span>
            <div className="my-3">
              <span className="text-xs text-slate-400 block">Monthly EMI</span>
              <span className="text-lg font-bold text-orange-300 font-mono-num">
                ₹{(metrics?.debtObligations || 10000).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              20% DTI Burden
            </div>
          </div>

          {/* 5. Buffer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">5. Shield</span>
            <div className="my-3">
              <span className="text-xs text-slate-400 block">Emergency Buffer</span>
              <span className="text-lg font-bold text-teal-300 font-mono-num">
                ₹{(metrics?.emergencyBuffer || 42000).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-amber-400 font-mono">
              1.3 Mo Runway
            </div>
          </div>

          {/* 6. Health Score */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">6. Health</span>
            <div className="my-3">
              <span className="text-xs text-slate-300 block">Calculated Score</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono-num">
                {health?.score || 68} <span className="text-xs text-slate-400">/ 100</span>
              </span>
            </div>
            <div className="text-[10px] text-amber-300 font-bold">
              Early Warning
            </div>
          </div>

          {/* 7. Risk State */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">7. Risk State</span>
            <div className="my-3">
              <span className="text-xs text-slate-300 block">Intervention</span>
              <span className="text-lg font-bold text-amber-300 font-mono">
                MODERATE
              </span>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">
              Intervene Now
            </div>
          </div>

        </div>

        {/* Narrative Banner */}
        <div className="mt-6 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            <strong className="text-white">Twin Telemetry Insight: </strong>
            Your cashflow pipeline indicates that an expansion in discretionary spending (34% of earnings) combined with a steady fixed EMI obligation of ₹10,000 is causing your liquid emergency buffer to stall at 1.3 months of runway.
          </p>
          <a
            href="/future"
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-teal-500/20 border border-teal-500/30 px-3.5 py-2 text-xs font-bold text-teal-300 hover:bg-teal-500/30 transition"
          >
            Project 180 Days Forward
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* SECTION 18: FINANCIAL DNA TRAITS */}
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Your Financial DNA</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Behavioral pattern recognition evaluated across salary cycles, spending timing, and borrowing elasticity. Strict neutral framing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Primary Pattern */}
          {primaryTrait && (
            <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-amber-500 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Primary Behavioral Trait
                </span>
                <span className="text-xs text-slate-400 font-mono">Weight: 65%</span>
              </div>
              <h3 className="text-xl font-bold text-white">{primaryTrait.trait}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {primaryTrait.description}
              </p>

              <div className="mt-5 rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-2">
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Evidence: </span>
                  <span className="text-slate-200">{primaryTrait.evidence}</span>
                </div>
                <div className="text-xs">
                  <span className="text-emerald-400 font-medium">Recommended Intervention Style: </span>
                  <span className="text-slate-300">{primaryTrait.recommendedInterventionStyle}</span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Pattern */}
          {secondaryTrait && (
            <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-orange-500 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Secondary Behavioral Trait
                </span>
                <span className="text-xs text-slate-400 font-mono">Weight: 35%</span>
              </div>
              <h3 className="text-xl font-bold text-white">{secondaryTrait.trait}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {secondaryTrait.description}
              </p>

              <div className="mt-5 rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-2">
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Evidence: </span>
                  <span className="text-slate-200">{secondaryTrait.evidence}</span>
                </div>
                <div className="text-xs">
                  <span className="text-orange-300 font-medium">Recommended Intervention Style: </span>
                  <span className="text-slate-300">{secondaryTrait.recommendedInterventionStyle}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* All Detected Behavioral Signals */}
        <div className="mt-8 glass-panel rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4">
            Active Behavioral Signals & Explanations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {behaviorSignals && behaviorSignals.map((signal: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                      {signal.pattern}
                    </span>
                    <span className="text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 font-semibold">
                      {signal.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{signal.title}</h4>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{signal.evidence}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Action: </strong>
                  {signal.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
