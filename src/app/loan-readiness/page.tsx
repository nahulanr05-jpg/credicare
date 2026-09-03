"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Info,
  Calendar,
  Layers
} from "lucide-react";

export default function LoanReadinessPage() {
  const [formData, setFormData] = useState({
    desiredAmount: 500000,
    tenureMonths: 36,
    interestRate: 13.5,
    loanType: "PERSONAL",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const evaluateReadiness = async (params = formData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/loan/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    evaluateReadiness();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    evaluateReadiness(formData);
  };

  const assessment = result?.assessment;
  const metrics = result?.metrics;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Loan Readiness & Capacity Assessment
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              Prudential Risk Analysis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate borrowing solvency and compute estimated EMI obligations before formal institutional application.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400">
            Rule: Non-promissory independent assessment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Loan Input Simulator (Section 14) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-400" />
            Loan Parameters
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Desired Loan Amount (₹)
              </label>
              <input
                type="number"
                value={formData.desiredAmount}
                onChange={(e) => setFormData({ ...formData, desiredAmount: parseFloat(e.target.value) || 0 })}
                step="10000"
                min="20000"
                max="5000000"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm font-bold text-white font-mono-num focus:border-blue-500 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                ₹{formData.desiredAmount.toLocaleString('en-IN')} (e.g. ₹5,00,000)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tenure (Months)
                </label>
                <select
                  value={formData.tenureMonths}
                  onChange={(e) => setFormData({ ...formData, tenureMonths: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                  <option value={84}>84 Months (7 Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Est. Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                  step="0.25"
                  min="5"
                  max="36"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Loan Purpose
              </label>
              <select
                value={formData.loanType}
                onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
              >
                <option value="PERSONAL">Personal / Consumer Loan</option>
                <option value="HOME">Housing Property Loan</option>
                <option value="AUTO">Vehicle / Auto Loan</option>
                <option value="EDUCATION">Higher Education Loan</option>
              </select>
            </div>

            {/* Calculated Estimated EMI */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4">
              <span className="text-[11px] text-blue-300 font-semibold uppercase tracking-wider block">
                Estimated Monthly EMI
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono-num">
                  ₹{(assessment?.estimatedEMI || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Formula: Standard reducing balance amortization
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-xs font-bold text-slate-950 shadow-md hover:bg-blue-400 transition disabled:opacity-50"
            >
              {loading ? "Evaluating Solvency..." : "Rerun Capacity Assessment"}
            </button>
          </form>

          {/* Current Profile Summary */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-xs space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>Net Monthly Income:</span>
              <span className="font-mono text-white">₹{(metrics?.monthlyIncome || 50000).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Debt Obligations:</span>
              <span className="font-mono text-orange-400">₹{(metrics?.debtObligations || 10000).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Emergency Buffer:</span>
              <span className="font-mono text-teal-400">₹{(metrics?.emergencyBuffer || 42000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Assessment & Reverse Roadmap (Section 14 & 15) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Assessment Result Card */}
          {assessment && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Financial Readiness Classification
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                  assessment.status === "READY"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : assessment.status === "CAUTION"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}>
                  {assessment.status === "NOT_CURRENTLY_READY" ? "NOT CURRENTLY READY" : assessment.status}
                </span>
              </div>

              {/* Responsible Finance Headline (Section 2 & 14) */}
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  «"{assessment.headline}"»
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {assessment.preventativeAdvice}
                </p>
              </div>

              {/* Key Metrics Impact */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-[11px] text-slate-400 block">Projected Total DTI</span>
                  <span className={`text-xl font-bold font-mono-num mt-1 block ${
                    assessment.totalNewDti > 0.45 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {(assessment.totalNewDti * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500">Prudential ceiling: 40%</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-[11px] text-slate-400 block">Current Debt Ratio</span>
                  <span className="text-xl font-bold font-mono-num mt-1 text-slate-200 block">
                    {(assessment.currentDti * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500">Baseline before new EMI</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-[11px] text-slate-400 block">Free Cash After EMI</span>
                  <span className={`text-xl font-bold font-mono-num mt-1 block ${
                    assessment.remainingCashAfterEMI < 2500 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    ₹{Math.round(assessment.remainingCashAfterEMI).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500">Post-obligation liquidity</span>
                </div>
              </div>

              {/* Explainable Attribution: WHY? (Section 14) */}
              {assessment.reasons && assessment.reasons.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-2">
                    Attribution Factors (Why is this profile less suitable?)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {assessment.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SECTION 15: REVERSE LOAN PLANNER (WHAT WOULD MAKE YOU READY?) */}
          {assessment?.roadmap && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Compass className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                    Reverse Loan Planner
                  </span>
                  <h3 className="text-lg font-bold text-white">WHAT WOULD MAKE YOU READY?</h3>
                </div>
              </div>

              {/* Current vs Target State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Current State</span>
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <div>Buffer: <strong className="text-white">₹42,000</strong></div>
                    <div>Debt: <strong className="text-white">₹10,000/mo</strong></div>
                    <div>Savings Rate: <strong className="text-white">17%</strong></div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center text-blue-400">
                  <ArrowRight className="h-6 w-6" />
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <span className="text-[11px] text-emerald-400 font-bold uppercase">Target Ready State</span>
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <div>Buffer: <strong className="text-emerald-300">₹60,000+</strong></div>
                    <div>Debt Burden: <strong className="text-emerald-300">Normalized</strong></div>
                    <div>Savings Rate: <strong className="text-emerald-300">20%+</strong></div>
                  </div>
                </div>
              </div>

              {/* 5-Month Adaptive Roadmap Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  5-Month Adaptive Milestones:
                </h4>
                {assessment.roadmap.map((step: any) => (
                  <div key={step.month} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                      M{step.month}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{step.title}</span>
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">
                          Target: {step.targetMetric}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-6 italic">
                Notice: Lending criteria are set by individual financial institutions. Following this roadmap improves underlying solvency factors but does not guarantee credit extension.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
