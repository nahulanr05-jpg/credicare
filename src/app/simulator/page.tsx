"use client";

import { useState, useEffect } from "react";
import { 
  Flame, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Sliders,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function SimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState("SALARY_DROP_10");
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customParams, setCustomParams] = useState({
    incomeChangePercent: -15,
    expenseAmount: 35000,
    monthlyEmi: 5000,
  });

  const runSimulation = async (scenarioId: string, custom?: any) => {
    try {
      setLoading(true);
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          ...(custom ? {
            customIncomeChangePercent: custom.incomeChangePercent,
            customExpenseAmount: custom.expenseAmount,
            customMonthlyEmi: custom.monthlyEmi,
          } : {})
        }),
      });
      const data = await res.json();
      setSimulation(data.simulation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation("SALARY_DROP_10");
  }, []);

  const scenarios = [
    { id: "SALARY_DROP_10", label: "Salary -10%", desc: "10% compensation or incentive reduction", badge: "Common" },
    { id: "SALARY_DROP_20", label: "Salary -20%", desc: "20% base pay contraction or reduction in force", badge: "Severe" },
    { id: "LOSE_PRIMARY_INCOME", label: "Lose Primary Income", desc: "Zero income for 60-day transition", badge: "Critical" },
    { id: "EMERGENCY_25K", label: "Emergency ₹25,000", desc: "Out-of-pocket medical or appliance breakdown", badge: "Moderate" },
    { id: "EMERGENCY_50K", label: "Emergency ₹50,000", desc: "Major urgent medical or family requirement", badge: "High" },
    { id: "EMERGENCY_100K", label: "Emergency ₹1,00,000", desc: "Critical capital drain exceeding buffers", badge: "Extreme" },
    { id: "RENT_INCREASE_5K", label: "Rent +₹5,000/mo", desc: "Permanent lease escalation in fixed living costs", badge: "Fixed" },
    { id: "NEW_EMI_8K", label: "New EMI ₹8,000/mo", desc: "Addition of vehicle or personal loan obligation", badge: "Debt" },
    { id: "CREDIT_CARD_DEBT_30K", label: "Credit Card Debt ₹30k", desc: "Revolving balance at high annual interest rates", badge: "High APR" },
    { id: "CUSTOM", label: "Custom Scenario", desc: "Adjust custom percentage and expense values", badge: "Interactive" },
  ];

  const handleSelect = (id: string) => {
    setSelectedScenario(id);
    if (id === "CUSTOM") {
      runSimulation(id, customParams);
    } else {
      runSimulation(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Financial Crash Simulator
            </h1>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              Stress-Testing Lab
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "What if life changes?" Stress-test your solvency against real-world economic shocks and generate an adaptive intervention plan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            Baseline: ₹50k Income • ₹31.5k Expenses • 68 Health
          </span>
        </div>
      </div>

      {/* Scenario Selection Grid */}
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-400" />
          Select Life Shock Scenario
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelect(sc.id)}
                className={`rounded-2xl p-3 text-left transition-all border ${
                  isSelected
                    ? "bg-slate-900 border-amber-400 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white block truncate">{sc.label}</span>
                  <span className="text-[9px] rounded bg-slate-800 px-1 py-0.5 text-slate-400 font-mono">
                    {sc.badge}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {sc.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Scenario Sliders (if CUSTOM selected) */}
        {selectedScenario === "CUSTOM" && (
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                Income Variance ({customParams.incomeChangePercent}%)
              </label>
              <input
                type="range"
                min="-50"
                max="25"
                value={customParams.incomeChangePercent}
                onChange={(e) => {
                  const updated = { ...customParams, incomeChangePercent: parseInt(e.target.value) };
                  setCustomParams(updated);
                  runSimulation("CUSTOM", updated);
                }}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                Lump-Sum Emergency (₹{customParams.expenseAmount.toLocaleString('en-IN')})
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={customParams.expenseAmount}
                onChange={(e) => {
                  const updated = { ...customParams, expenseAmount: parseInt(e.target.value) };
                  setCustomParams(updated);
                  runSimulation("CUSTOM", updated);
                }}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                Added Fixed Monthly EMI (₹{customParams.monthlyEmi.toLocaleString('en-IN')})
              </label>
              <input
                type="range"
                min="0"
                max="20000"
                step="1000"
                value={customParams.monthlyEmi}
                onChange={(e) => {
                  const updated = { ...customParams, monthlyEmi: parseInt(e.target.value) };
                  setCustomParams(updated);
                  runSimulation("CUSTOM", updated);
                }}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Simulation Results Screen */}
      {simulation && (
        <div className="space-y-6">
          
          {/* Comparison Cards: Before vs Simulated (Section 12) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Simulated Impact Analysis
                </span>
                <h3 className="text-xl font-bold text-white">{simulation.scenarioTitle}</h3>
              </div>
              <span className="text-xs text-slate-400">{simulation.description}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Health Score Impact */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <span className="text-xs text-slate-400 font-medium">Financial Health Score</span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-400 font-mono-num line-through">
                    {simulation.originalHealth}
                  </span>
                  <ArrowRight className="h-4 w-4 text-rose-400" />
                  <span className="text-4xl font-extrabold text-amber-400 font-mono-num">
                    {simulation.simulatedHealth}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <span className="mt-2 inline-block text-xs font-bold text-rose-400">
                  {simulation.healthDelta} Points Contraction
                </span>
              </div>

              {/* Emergency Buffer Impact */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <span className="text-xs text-slate-400 font-medium">Emergency Buffer Cushion</span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-slate-400 font-mono-num line-through">
                    ₹{simulation.originalBuffer.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="h-4 w-4 text-rose-400" />
                  <span className="text-3xl font-extrabold text-cyan-300 font-mono-num">
                    ₹{simulation.simulatedBuffer.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="mt-2 inline-block text-xs text-slate-400">
                  Deficit of ₹{(simulation.originalBuffer - simulation.simulatedBuffer).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Risk Level Classification */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <span className="text-xs text-slate-400 font-medium">Risk Classification Shift</span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-xl font-bold text-slate-400 font-mono">
                    {simulation.riskBefore}
                  </span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                  <span className="text-2xl font-extrabold text-amber-400 font-mono">
                    {simulation.riskAfter}
                  </span>
                </div>
                <span className="mt-2 inline-block text-xs text-amber-300 font-medium">
                  Early distress boundary reached
                </span>
              </div>

            </div>

            {/* Explanation of WHY the result changed (Section 12) */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
                Why Did the Result Change? (Deterministic Attribution)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {simulation.reasonsForChange.map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* SECTION 13: "PREVENT THIS FUTURE" ADAPTIVE INTERVENTION PLAN */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Adaptive Intervention Protocol
                </span>
                <h3 className="text-xl font-bold text-white">PREVENT THIS FUTURE</h3>
              </div>
            </div>

            {/* Without Intervention vs With Intervention Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4">
                <span className="text-xs text-rose-300 font-medium">Without Intervention</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-rose-400 font-mono-num">
                    {simulation.preventativePlan.withoutInterventionScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 100 projected health</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Liquidity erosion continues; risk of default rises to High within 90 days.
                </span>
              </div>

              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4">
                <span className="text-xs text-emerald-300 font-medium">With Adaptive Intervention</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono-num">
                    {simulation.preventativePlan.withInterventionScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 100 projected health</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Cushion ring-fenced; baseline solvency stabilized at Stable/Watch tier.
                </span>
              </div>
            </div>

            {/* 5 Action Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Recommended 5-Step Adaptive Mitigation Protocol:
              </h4>
              {simulation.preventativePlan.actions.map((act: any) => (
                <div key={act.step} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex items-start gap-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                    {act.step}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">{act.action}</span>
                    <span className="text-[11px] text-emerald-400/90 mt-0.5 block">
                      Estimated Impact: {act.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-center text-[11px] text-slate-400 italic">
              {simulation.preventativePlan.disclaimer}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
