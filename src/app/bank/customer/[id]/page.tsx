"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  ShieldAlert, 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Compass, 
  Layers,
  Activity,
  Plus
} from "lucide-react";

export default function BankCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [interventionForm, setInterventionForm] = useState({
    type: "FINANCIAL_COUNSELLING",
    reason: "Elevated DTI and declining savings rate over consecutive billing periods.",
    status: "RECOMMENDED",
    customerResponse: "",
    outcomeNotes: "",
  });

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bank/customers/${customerId}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) fetchCustomer();
  }, [customerId]);

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/bank/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          ...interventionForm,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchCustomer();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Loading Customer Risk Telemetry...</span>
        </div>
      </div>
    );
  }

  const { customer, health, metrics, timelineData, behaviorSignals, riskExplanation, interventions } = data || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/bank/customers"
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {customer?.name}
              </h1>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
                Risk Portfolio View
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Account: <strong className="text-slate-200">{customer?.email}</strong> • {customer?.occupation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-500 transition"
          >
            <Plus className="h-4 w-4" />
            Trigger Pre-Delinquency Intervention
          </button>
        </div>
      </div>

      {/* Row 1: Health Score Status & Explainable Risk (Section 23) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score & Risk Classification */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Financial Health Index
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                {health?.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-extrabold text-white font-mono-num">
                {health?.score}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {riskExplanation?.headline}
            </p>

            <div className="mt-6 space-y-2 border-t border-slate-800 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Inflow:</span>
                <span className="font-mono text-white">₹{(metrics?.monthlyIncome || 50000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fixed Debt Servicing:</span>
                <span className="font-mono text-orange-400">₹{(metrics?.debtObligations || 10000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Liquid Emergency Buffer:</span>
                <span className="font-mono text-teal-400">₹{(metrics?.emergencyBuffer || 42000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Discretionary Ratio:</span>
                <span className="font-mono text-amber-400">34.2%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Recommended Intervention Action:
            </span>
            <div className="rounded-xl bg-purple-950/30 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
              {riskExplanation?.recommendedIntervention}
            </div>
          </div>
        </div>

        {/* Explainable Risk Attribution (Section 23) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Explainable Risk Attribution</h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Transparent Factors
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Specific mathematical and behavioral triggers contributing to this customer's risk state:
            </p>

            <div className="space-y-3">
              {riskExplanation?.primaryDrivers?.map((driver: string, idx: number) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs">
                    !
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed font-medium">
                    {driver}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Warning Signals */}
            <div className="mt-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Telemetry Signals:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {behaviorSignals && behaviorSignals.map((sig: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs">
                    <span className="font-bold text-amber-400 block">{sig.title}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{sig.evidence}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>Policy Notice: </strong>
            Analytical attribution is provided for human underwriter support. Automated adverse actions based on sensitive personal characteristics are strictly prohibited.
          </div>
        </div>

      </div>

      {/* Row 2: Financial Timeline (Section 23) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Historical Financial Health Timeline</h3>
            <p className="text-xs text-slate-400">Observed telemetry trajectory across review periods</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Score Curve</span>
        </div>

        {/* ASCII / Visual Timeline representation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {timelineData && timelineData.map((point: any, idx: number) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase">{point.date}</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-white font-mono-num">
                  {point.healthScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="mt-2 text-[11px] space-y-0.5 text-slate-400">
                <div>Buffer: <strong className="text-slate-300">₹{point.emergencyBuffer?.toLocaleString('en-IN')}</strong></div>
                <div>Savings Rate: <strong className="text-slate-300">{point.savingsRate}%</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Recorded Interventions for this customer */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Recorded Interventions History</h3>
            <p className="text-xs text-slate-400">Tracking interactions, customer response, and observed health delta</p>
          </div>
        </div>

        {interventions && interventions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs">
            No proactive interventions recorded yet. Click "Trigger Pre-Delinquency Intervention" above to start.
          </div>
        ) : (
          <div className="space-y-3">
            {interventions?.map((inv: any) => (
              <div key={inv.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase font-mono">
                      {inv.type.replace(/_/g, " ")}
                    </span>
                    <span className="rounded bg-purple-500/20 text-purple-300 px-2 py-0.5 text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Logged by {inv.analyst?.name || "Senior Risk Officer"} • {new Date(inv.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2">
                  <strong className="text-slate-400">Reason: </strong>
                  {inv.reason}
                </p>

                {inv.customerResponse && (
                  <p className="text-xs text-slate-300 mb-2">
                    <strong className="text-purple-400">Customer Response: </strong>
                    {inv.customerResponse}
                  </p>
                )}

                {inv.healthBefore && inv.healthAfter && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300 font-mono font-bold">
                    <span>Outcome: {inv.healthBefore} → {inv.healthAfter} Health Score (+{inv.healthAfter - inv.healthBefore} pts)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to Log Intervention */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Trigger Pre-Delinquency Intervention
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Engage customer proactively with structured support before missed obligations occur.
            </p>

            <form onSubmit={handleCreateIntervention} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Intervention Type</label>
                <select
                  value={interventionForm.type}
                  onChange={(e) => setInterventionForm({ ...interventionForm, type: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                >
                  <option value="FINANCIAL_COUNSELLING">Offer Financial Counselling</option>
                  <option value="PROACTIVE_CONTACT">Contact Customer Proactively</option>
                  <option value="REPAYMENT_ASSISTANCE">Discuss Repayment Assistance</option>
                  <option value="BUDGETING_SUPPORT">Provide Budgeting Support</option>
                  <option value="RESTRUCTURING_REVIEW">Review Restructuring Options</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Trigger Signals</label>
                <textarea
                  rows={2}
                  value={interventionForm.reason}
                  onChange={(e) => setInterventionForm({ ...interventionForm, reason: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Initial Status</label>
                <select
                  value={interventionForm.status}
                  onChange={(e) => setInterventionForm({ ...interventionForm, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                >
                  <option value="RECOMMENDED">Recommended (Flagged for outreach)</option>
                  <option value="CONTACTED">Contacted (Outreach initiated)</option>
                  <option value="ACCEPTED">Accepted (Customer opted in)</option>
                  <option value="MONITORING">Monitoring (Active observation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Customer Notes (Optional)</label>
                <input
                  type="text"
                  value={interventionForm.customerResponse}
                  onChange={(e) => setInterventionForm({ ...interventionForm, customerResponse: e.target.value })}
                  placeholder="e.g. Customer receptive; requested 3-month tenure extension"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 transition"
                >
                  Record Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
