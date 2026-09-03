"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  ArrowRightLeft,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

export default function BankCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    fetch("/api/bank/customers")
      .then((r) => r.json())
      .then((res) => {
        setCustomers(res.customers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.accountNumber.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || c.riskCategory === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Customer Risk Radar
            </h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
              Active Portfolio
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Searchable institution radar mapping customer solvency drift, leading signals, and recommended early-warning actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bank"
            className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            ← Back to Overview
          </Link>
          <Link
            href="/bank/interventions"
            className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition"
          >
            Logged Interventions
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or account #..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: "All Cohorts" },
            { id: "EARLY_WARNING", label: "Early Warning" },
            { id: "FINANCIAL_STRESS", label: "Stress" },
            { id: "CRITICAL", label: "Critical" },
            { id: "HEALTHY", label: "Healthy" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setRiskFilter(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                riskFilter === f.id
                  ? "bg-purple-600 text-white font-semibold shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Radar Table (Section 22) */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="pb-3 pl-2">Customer / ID</th>
                <th className="pb-3">Financial Health</th>
                <th className="pb-3">Risk Tier</th>
                <th className="pb-3">Trend</th>
                <th className="pb-3">Debt Burden</th>
                <th className="pb-3">Leading Warning Signals</th>
                <th className="pb-3">Recommended Intervention</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 pl-2">
                    <span className="font-bold text-white block">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.accountNumber}</span>
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
                  <td className="py-3.5">
                    <span className={`flex items-center gap-1 text-[11px] font-medium ${
                      c.trend === "IMPROVING" ? "text-emerald-400" :
                      c.trend === "DECLINING" ? "text-rose-400" : "text-slate-400"
                    }`}>
                      {c.trend === "IMPROVING" ? <TrendingUp className="h-3.5 w-3.5" /> :
                       c.trend === "DECLINING" ? <TrendingDown className="h-3.5 w-3.5" /> : "—"}
                      {c.trend}
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
                      View Profile
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
