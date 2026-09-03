"use client";

import { useState, useEffect } from "react";
import { 
  Compass, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  LifeBuoy, 
  TrendingDown, 
  Flame, 
  CreditCard,
  Layers,
  Info
} from "lucide-react";

export default function DebtRecoveryPage() {
  const [data, setData] = useState<any>(null);
  const [selectedStrategy, setSelectedStrategy] = useState("BALANCED_RECOVERY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/debt")
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Loading Debt Recovery Optimization Matrix...</span>
        </div>
      </div>
    );
  }

  const { summary, debts, strategies, activePlan } = data || {};
  const currentStrategy = strategies?.find((s: any) => s.strategyType === selectedStrategy) || strategies?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Financial Recovery Mode
            </h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
              Responsible De-Leveraging
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic liability repayment pathways balanced against liquidity retention to prevent relapse.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1.5 text-xs text-emerald-300 flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-emerald-400" />
          <span>Core Rule: Never drain emergency reserves to settle debt</span>
        </div>
      </div>

      {/* Summary KPI Cards (Section 16) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Debt</span>
          <span className="block text-xl font-bold text-white font-mono-num mt-1">
            ₹{(summary?.totalDebt || 110000).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{debts?.length || 1} Active account</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly EMI Outflow</span>
          <span className="block text-xl font-bold text-orange-400 font-mono-num mt-1">
            ₹{(summary?.monthlyDebtPayments || 10000).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">20% of net income</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Annual Interest</span>
          <span className="block text-xl font-bold text-rose-400 font-mono-num mt-1">
            ₹{(summary?.estimatedAnnualInterest || 15950).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Calculated financing cost</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Essential Expenses</span>
          <span className="block text-xl font-bold text-slate-200 font-mono-num mt-1">
            ₹{(summary?.essentialExpenses || 20700).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Non-negotiable burn</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Available Cashflow</span>
          <span className="block text-xl font-bold text-cyan-300 font-mono-num mt-1">
            ₹{(summary?.availableCash || 8500).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Surplus after all outlays</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Emergency Cushion</span>
          <span className="block text-xl font-bold text-teal-300 font-mono-num mt-1">
            ₹{(summary?.emergencyBuffer || 42000).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Protected liquidity shield</span>
        </div>
      </div>

      {/* Strategies Comparison Matrix (Strategy A, B, C) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Compare Recovery Strategies</h3>
            <p className="text-xs text-slate-400">Select an optimization model tailored to your psychological and mathematical profile</p>
          </div>
          <span className="text-xs font-mono text-purple-400">3 Models Generated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies && strategies.map((s: any) => {
            const isSelected = selectedStrategy === s.strategyType;
            return (
              <div
                key={s.strategyType}
                onClick={() => setSelectedStrategy(s.strategyType)}
                className={`cursor-pointer rounded-3xl p-6 transition-all border flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900/90 border-purple-400 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/20"
                    : "glass-panel-interactive border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300">
                      {s.strategyType.replace(/_/g, " ")}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] text-purple-400 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active Plan
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white">{s.name}</h4>
                  <p className="text-xs text-purple-200/90 font-medium mt-1">{s.tagline}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.description}</p>

                  <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-950/70 p-4 border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Timeline:</span>
                      <strong className="text-white font-mono">{s.estimatedMonths} Months</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Interest Saved:</span>
                      <strong className="text-emerald-400 font-mono">₹{s.estimatedInterestSaved.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Pressure:</span>
                      <span className="text-slate-300 font-semibold">{s.monthlyRepaymentPressure}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-teal-300">
                      {s.emergencyBufferPreservation}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Priority: {s.priorityOrder[0]}
                  </span>
                  <button
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      isSelected
                        ? "bg-purple-500 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Model"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Execution Plan for the Selected Strategy */}
      {currentStrategy && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Compass className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                Detailed Execution Architecture
              </span>
              <h3 className="text-lg font-bold text-white">{currentStrategy.name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Payment Priority Sequence
              </h4>
              {currentStrategy.priorityOrder.map((item: string, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 font-bold font-mono text-xs">
                    #{idx + 1}
                  </div>
                  <span className="text-xs font-bold text-white">{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-2">
                  Prudential Rationale
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentStrategy.rationale}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <strong>Liquidity Protection Guarantee: </strong>
                Under this strategy, at no point will your liquid emergency buffer drop below ₹35,000, ensuring life surprises do not trigger secondary borrowing.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
