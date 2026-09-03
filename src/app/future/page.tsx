"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Clock, 
  ArrowRight, 
  TrendingDown, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle,
  LifeBuoy,
  PiggyBank,
  CreditCard,
  ChevronRight,
  Flame
} from "lucide-react";

export default function FutureTimeMachinePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(3); // Default to 90 DAYS for hackathon flow

  useEffect(() => {
    fetch("/api/future")
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Calibrating Financial Time Machine...</span>
        </div>
      </div>
    );
  }

  const timeline = data?.timeline || [];
  const selectedSnapshot = timeline[selectedPeriodIndex] || timeline[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Financial Time Machine
            </h1>
            <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
              Probabilistic Projection Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Where are you headed?" Predictive cashflow simulation across 180 days based on active habits.
          </p>
        </div>

        <Link
          href="/simulator"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition"
        >
          <Flame className="h-4 w-4" />
          Test Life Shock Scenarios
        </Link>
      </div>

      {/* Primary Narrative Alert */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                180-Day Trajectory Projection
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                "{data?.summaryNarrative || "If your current financial behavior continues, your financial buffer may become significantly weaker over the next few months."}"
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Based on current monthly discretionary outflows and 1.3 months liquid emergency cushion.
              </p>
            </div>
          </div>

          <Link
            href="/simulator"
            className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            PREVENT THIS FUTURE
          </Link>
        </div>
      </div>

      {/* Interactive Timeline Selector Bar */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Temporal Step Selector
            </h3>
            <p className="text-xs text-slate-400">Click any milestone to inspect projected financial health telemetry</p>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-950/40 border border-teal-500/30 px-3 py-1 rounded-full">
            Selected: {selectedSnapshot.dayLabel}
          </span>
        </div>

        {/* Timeline Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {timeline.map((item: any, idx: number) => {
            const isSelected = selectedPeriodIndex === idx;
            return (
              <button
                key={item.period}
                onClick={() => setSelectedPeriodIndex(idx)}
                className={`rounded-2xl p-4 text-left transition-all border ${
                  isSelected
                    ? "bg-slate-900 border-teal-400 shadow-lg shadow-teal-500/10 ring-2 ring-teal-500/20"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    {item.dayLabel}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${
                    item.healthScore >= 65 ? "bg-cyan-500" :
                    item.healthScore >= 50 ? "bg-amber-500" :
                    "bg-rose-500"
                  }`}></span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white font-mono-num">
                    {item.healthScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>

                <span className={`block text-[11px] font-semibold mt-1 ${
                  item.healthScore >= 65 ? "text-cyan-400" :
                  item.healthScore >= 50 ? "text-amber-400" :
                  "text-rose-400"
                }`}>
                  {item.riskLevel} Risk
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Period Deep-Dive Telemetry */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase text-teal-400 font-bold">
                Projected Telemetry at {selectedSnapshot.dayLabel}
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                Solvency Index: {selectedSnapshot.healthScore} / 100 ({selectedSnapshot.riskLevel} Risk)
              </h4>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-300">
              <strong className="text-amber-400 font-medium">Trajectory: </strong>
              {selectedSnapshot.narrative}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <LifeBuoy className="h-3.5 w-3.5 text-teal-400" />
                Projected Emergency Buffer
              </span>
              <span className="text-2xl font-bold text-white font-mono-num">
                ₹{selectedSnapshot.projectedBuffer.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Liquid cash runway available
              </span>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <PiggyBank className="h-3.5 w-3.5 text-cyan-400" />
                Projected Monthly Savings
              </span>
              <span className="text-2xl font-bold text-cyan-300 font-mono-num">
                ₹{selectedSnapshot.projectedSavings.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Retention under current outflow pace
              </span>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <CreditCard className="h-3.5 w-3.5 text-orange-400" />
                Outstanding Liabilities
              </span>
              <span className="text-2xl font-bold text-orange-300 font-mono-num">
                ₹{selectedSnapshot.projectedDebt.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Amortized institutional debt balance
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Model Projection Disclaimer as per Section 2 & 11 */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-center">
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mx-auto">
          <strong className="text-slate-300 font-semibold">Model Projection Notice: </strong>
          Projections represent modeled behavioral scenarios based on continuing current spend-to-income velocity. Projections do not constitute guaranteed outcomes. Real-world interventions adaptively recalibrate this curve.
        </p>
      </div>

    </div>
  );
}
