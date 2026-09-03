"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  Users,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function BankInterventionsPage() {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bank/interventions");
      const data = await res.json();
      setInterventions(data.interventions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/bank/interventions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchInterventions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Loading Intervention Tracking Registry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Pre-Delinquency Intervention Tracking
            </h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
              Audit & Resolution Registry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking proactive customer outreach, restructuring agreements, and observed solvency outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bank/customers"
            className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            ← Risk Radar
          </Link>
          <button
            onClick={fetchInterventions}
            className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-500 transition flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Log
          </button>
        </div>
      </div>

      {/* Exemplary Intervention Outcome Card (Section 24) */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/80 to-slate-900/80 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Validated Intervention Case Study #1024
            </span>
            <h3 className="text-lg font-bold text-white">OBSERVED INTERVENTION OUTCOME</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-xs text-slate-400 font-medium">Before Intervention:</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-orange-400 font-mono-num">48</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-orange-400 mt-1 block">Risk: High</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-xs text-slate-400 font-medium">After 30 Days:</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono-num">59</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">Risk: Moderate</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-xs text-slate-400 font-medium">Resolution Action:</span>
            <div className="mt-2 text-sm font-bold text-white">
              Restructured Schedule
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              36-Month extended tenure, ₹3,500/mo cashflow recovered
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic text-center">
          Analytical Notice: Observed improvements reflect measured behavioral telemetry across active review cycles and are distinguished from guaranteed institutional causation.
        </p>
      </div>

      {/* Complete Interventions List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-6">
          Active Portfolio Intervention Registry ({interventions.length})
        </h3>

        <div className="space-y-4">
          {interventions.map((inv) => (
            <div
              key={inv.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    {inv.type.replace(/_/g, " ")}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    inv.status === "RESOLVED" ? "bg-emerald-500/20 text-emerald-300" :
                    inv.status === "ACCEPTED" ? "bg-cyan-500/20 text-cyan-300" :
                    inv.status === "CONTACTED" ? "bg-amber-500/20 text-amber-300" :
                    "bg-slate-800 text-slate-300"
                  }`}>
                    {inv.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  Customer: <strong className="text-white">{inv.customer?.name}</strong> ({inv.customer?.email})
                </div>

                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Trigger: </strong>
                  {inv.reason}
                </p>

                {inv.customerResponse && (
                  <p className="text-xs text-slate-300">
                    <strong className="text-purple-400">Notes: </strong>
                    {inv.customerResponse}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-1.5">
                  {["CONTACTED", "ACCEPTED", "RESOLVED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(inv.id, st)}
                      disabled={inv.status === st}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                        inv.status === st
                          ? "bg-purple-600 text-white"
                          : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
