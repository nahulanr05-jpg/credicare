"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Layers, 
  ShieldAlert, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  PieChart, 
  Activity,
  Search,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function BankOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bank/customers")
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Loading Bank Portfolio Telemetry...</span>
        </div>
      </div>
    );
  }

  const { portfolioStats, customers } = data || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Bank Early-Warning Intervention Console
            </h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
              Institutional Risk Radar
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactive default prevention, explainable behavioral signals, and pre-delinquency support workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bank/customers"
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-500 transition"
          >
            <Users className="h-4 w-4" />
            Customer Risk Radar
          </Link>
          <Link
            href="/bank/interventions"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            Track Interventions
          </Link>
        </div>
      </div>

      {/* Main Screen: Customer Financial Health (Section 21) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono uppercase text-purple-400 font-bold">
              Portfolio Health Telemetry
            </span>
            <h2 className="text-xl font-bold text-white">CUSTOMER FINANCIAL HEALTH</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Total Monitored: <strong className="text-white font-mono">1,240 Customers</strong></span>
          </div>
        </div>

        {/* 4 Risk Cohort Cards (Healthy, Early Warning, Stress, Critical) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Healthy */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                Healthy
              </span>
              <span className="text-xs font-mono text-emerald-300 font-semibold">70.3%</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-white font-mono-num">
                {portfolioStats?.healthy || 872}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">Customers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Score 80–100. Robust buffers and balanced DTI ratios.
            </p>
          </div>

          {/* Early Warning */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                Early Warning
              </span>
              <span className="text-xs font-mono text-amber-300 font-semibold">19.2%</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-amber-400 font-mono-num">
                {portfolioStats?.earlyWarning || 238}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">Customers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Score 50–64. Salary spikes & savings compression detected.
            </p>
          </div>

          {/* Stress */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400"></span>
                Financial Stress
              </span>
              <span className="text-xs font-mono text-orange-300 font-semibold">7.7%</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-orange-400 font-mono-num">
                {portfolioStats?.stress || 96}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">Customers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Score 30–49. High EMI burden & credit dependency.
            </p>
          </div>

          {/* Critical */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                Critical Deficit
              </span>
              <span className="text-xs font-mono text-rose-300 font-semibold">2.8%</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-rose-400 font-mono-num">
                {portfolioStats?.critical || 34}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">Customers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Score 0–29. Imminent default risk. Proactive contact required.
            </p>
          </div>

        </div>

        {/* Portfolio Cohort Stacked Visualizer Bar */}
        <div className="mt-6 space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: "70.3%" }} title="Healthy: 872"></div>
            <div className="bg-amber-500 h-full" style={{ width: "19.2%" }} title="Early Warning: 238"></div>
            <div className="bg-orange-500 h-full" style={{ width: "7.7%" }} title="Stress: 96"></div>
            <div className="bg-rose-500 h-full" style={{ width: "2.8%" }} title="Critical: 34"></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Portfolio Exposure at Risk: <strong className="text-amber-400">₹4.82 Cr</strong></span>
            <span>Preventative Intervention Success Rate: <strong className="text-emerald-400">84.6%</strong></span>
          </div>
        </div>
      </div>

      {/* Priority At-Risk Accounts (Quick Table) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Priority At-Risk Accounts Requiring Intervention</h3>
            <p className="text-xs text-slate-400">Pre-delinquency behavioral indicators flagged by automated early warning engine</p>
          </div>
          <Link
            href="/bank/customers"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            View All Radar Accounts <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="pb-3 pl-2">Customer / Account</th>
                <th className="pb-3">Health Score</th>
                <th className="pb-3">Risk Status</th>
                <th className="pb-3">Debt Burden</th>
                <th className="pb-3">Leading Warning Signals</th>
                <th className="pb-3">Recommended Intervention</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers && customers.slice(0, 5).map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 pl-2">
                    <span className="font-bold text-white block">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.accountNumber} • {c.occupation}</span>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-sm">
                    <span className={
                      c.financialHealth >= 80 ? "text-emerald-400" :
                      c.financialHealth >= 65 ? "text-cyan-400" :
                      c.financialHealth >= 50 ? "text-amber-400" :
                      c.financialHealth >= 30 ? "text-orange-400" : "text-rose-400"
                    }>
                      {c.financialHealth} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      c.riskCategory === "HEALTHY" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      c.riskCategory === "EARLY_WARNING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      c.riskCategory === "FINANCIAL_STRESS" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                      "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {c.riskLabel}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-300">
                    {c.debtBurden}
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {c.warningSignals.map((sig: string, idx: number) => (
                        <span key={idx} className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    {c.recommendedAction}
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <Link
                      href={`/bank/customer/${c.id}`}
                      className="rounded-xl border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-900/40 transition"
                    >
                      Inspect Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
