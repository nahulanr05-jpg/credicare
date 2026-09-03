"use client";

import { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  Sparkles, 
  LifeBuoy, 
  Activity, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Zap
} from "lucide-react";

export default function ResiliencePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resilience")
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Evaluating Shock Resilience Matrix...</span>
        </div>
      </div>
    );
  }

  const { resilience, metrics } = data || {};
  const score = resilience?.resilienceScore || 64;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Financial Resilience Index
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Shock-Absorption Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Measures how well your financial structure can absorb sudden economic friction without incurring default.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-400">
          Responsible Finance: <strong className="text-white font-medium">Non-Bureau Resilience Metric</strong>
        </div>
      </div>

      {/* Resilience Score Hero Card (Section 17) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Resilience Score
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-white font-mono-num">
                {score}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <span className={`mt-2 rounded-full px-3 py-1 text-xs font-bold ${
              score >= 75 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
              score >= 55 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
              "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {resilience?.rating || "Moderate Resilience"}
            </span>
            <span className="text-[11px] text-slate-400 mt-3 text-center">
              Estimated capacity: Absorbs ~45 days of comprehensive burn
            </span>
          </div>

          <div className="md:col-span-8 space-y-3">
            <h3 className="text-base font-bold text-white">Resilience Determinants</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike a statutory credit score that only looks backward at historical debt, Financial Resilience calculates current structural elasticity across your buffer, income stability, discretionary flexibility, and debt commitments.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Liquid Runway</span>
                <span className="text-base font-bold text-teal-300 font-mono-num block mt-0.5">1.3 Months</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Expense Flexibility</span>
                <span className="text-base font-bold text-amber-300 font-mono-num block mt-0.5">34% Compressible</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Fixed DTI Drag</span>
                <span className="text-base font-bold text-orange-300 font-mono-num block mt-0.5">20% Inflexible</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stress & Shock Simulations (Section 17) */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white">Shock Absorption Stress Tests</h3>
          <p className="text-xs text-slate-400">Simulation of distinct macroeconomic and personal crisis events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resilience?.shocks?.map((shock: any, idx: number) => (
            <div key={idx} className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{shock.shockTitle}</h4>
                  <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${
                    shock.recoveryDifficulty === "LOW" ? "bg-emerald-500/20 text-emerald-300" :
                    shock.recoveryDifficulty === "MODERATE" ? "bg-amber-500/20 text-amber-300" :
                    "bg-rose-500/20 text-rose-300"
                  }`}>
                    {shock.recoveryDifficulty} DIFFICULTY
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{shock.scenario}</p>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs">
                  <span className="text-slate-400 font-medium block">Financial Impact:</span>
                  <span className="text-slate-200 mt-0.5 block">{shock.financialImpact}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Runway Survival:</span>
                <strong className="text-teal-300 font-mono">{shock.survivalRunwayDays} Days</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
