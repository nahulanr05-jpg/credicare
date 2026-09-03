"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  Receipt, 
  PiggyBank, 
  CreditCard, 
  LifeBuoy, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Building2, 
  Bot, 
  CheckCircle2, 
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-400">Loading Financial Firewall telemetry...</span>
        </div>
      </div>
    );
  }

  const { metrics, health, behaviorSignals, nextActions, financialDna, user } = data || {};
  const score = health?.score ?? 68;
  const healthStatus = health?.classification ?? "EARLY_WARNING";

  // Circular gauge calculation (strokeDasharray)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Greeting & Quick Switcher Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Financial Firewall Dashboard
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring profile: <strong className="text-slate-200">{user?.name}</strong> • Account FF-1024 • Model Engine: Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/future"
            className="flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-950/20 px-3.5 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-900/30 transition shadow-sm"
          >
            <Clock className="h-3.5 w-3.5 text-teal-400" />
            Time Machine (Where are you headed?)
          </Link>
          <Link
            href="/simulator"
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-900/30 transition shadow-sm"
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            Crash Simulator
          </Link>
        </div>
      </div>

      {/* Behavioral Early-Warning Alert Banner (If Any Detected) */}
      {behaviorSignals && behaviorSignals.length > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-900/60 p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Early Warning Signal Detected
                  </span>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                    {behaviorSignals[0].severity} SEVERITY
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {behaviorSignals[0].title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {behaviorSignals[0].evidence} {behaviorSignals[0].impact}
                </p>
              </div>
            </div>
            <Link
              href="/simulator"
              className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition"
            >
              Simulate Impact & Prevent
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Primary Row: Radial Health Score & Top 5 KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Circular / Radial Financial Health Score (Section 6 & 7) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Financial Health Score
              </span>
              <p className="text-xs text-slate-400 mt-0.5">Transparent 0–100 Behavioral Solvency</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              score >= 65 ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
              score >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              score >= 30 ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
              "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>
              {health?.label ?? "Early Warning"}
            </span>
          </div>

          {/* Radial Visualization */}
          <div className="my-6 flex flex-col items-center justify-center relative">
            <div className="relative flex items-center justify-center w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Score circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={health?.color ?? "#f59e0b"}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Inside Score Label */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-white font-mono-num tracking-tight">
                  {score}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  / 100 Score
                </span>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-400">
                  <TrendingDown className="h-3 w-3" />
                  <span>Trend: Declining</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-300 max-w-sm leading-relaxed">
              {health?.primaryRecommendation}
            </p>
          </div>

          {/* Classification tiers reference */}
          <div className="border-t border-slate-800/80 pt-4 grid grid-cols-5 text-center text-[10px] font-mono font-medium">
            <div className={score >= 80 ? "text-emerald-400 font-bold" : "text-slate-400"}>80-100<br/><span className="text-[9px]">Healthy</span></div>
            <div className={score >= 65 && score < 80 ? "text-cyan-400 font-bold" : "text-slate-400"}>65-79<br/><span className="text-[9px]">Stable</span></div>
            <div className={score >= 50 && score < 65 ? "text-amber-400 font-bold" : "text-slate-400"}>50-64<br/><span className="text-[9px]">Warning</span></div>
            <div className={score >= 30 && score < 50 ? "text-orange-400 font-bold" : "text-slate-400"}>30-49<br/><span className="text-[9px]">Stress</span></div>
            <div className={score < 30 ? "text-rose-400 font-bold" : "text-slate-400"}>0-29<br/><span className="text-[9px]">Critical</span></div>
          </div>
        </div>

        {/* Card 2: Five Key Financial Cards (Income, Expenses, Savings, Debt, Buffer) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Monthly Income */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Monthly Income</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono-num">
                ₹{(metrics?.monthlyIncome ?? 50000).toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">Salaried direct credit</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Stability factor</span>
              <span className="font-semibold text-emerald-400">92% High</span>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Monthly Expenses</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono-num">
                ₹{(metrics?.monthlyExpenses ?? 31500).toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                ₹{((metrics?.essentialSpending ?? 20700)).toLocaleString('en-IN')} Essential • ₹{((metrics?.discretionarySpending ?? 10800)).toLocaleString('en-IN')} Discretionary
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Discretionary ratio</span>
              <span className="font-semibold text-amber-400">34.2% (Elevated)</span>
            </div>
          </div>

          {/* Monthly Savings */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Monthly Savings</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <PiggyBank className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono-num">
                ₹{(metrics?.monthlySavings ?? 8500).toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                Savings Rate: {((metrics?.savingsRate ?? 0.17) * 100).toFixed(1)}% (Benchmark: 20%)
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">3-Month Trend</span>
              <span className="font-semibold text-rose-400 flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" /> Declining
              </span>
            </div>
          </div>

          {/* Debt Obligations */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Debt Obligations</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-orange-300 font-mono-num">
                ₹{(metrics?.debtObligations ?? 10000).toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                DTI Ratio: 20.0% • 1 Active Loan
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Repayment Status</span>
              <span className="font-semibold text-emerald-400">100% On-Time</span>
            </div>
          </div>

          {/* Emergency Buffer (Span full row) */}
          <div className="sm:col-span-2 glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400">Emergency Buffer (Liquid Cushion)</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono-num">
                    ₹{(metrics?.emergencyBuffer ?? 42000).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400">
                    ≈ 1.3 Months Outflow Runway
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 font-semibold">
                Below 3-Month Target (₹94,500)
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Row 2: Contributing Factors Breakdown (Section 7) & Today's Most Important Actions (Section 19) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Transparent Contributing Factors (Section 7) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Contributing Factors Breakdown</h3>
              <p className="text-xs text-slate-400">Strictly transparent mathematical weights (0–100)</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              Deterministic Algorithm
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Income Stability",
                weight: "25%",
                score: health?.factors?.incomeStability?.score ?? 75,
                explanation: health?.factors?.incomeStability?.explanation ?? "Steady salary covers essential needs.",
                color: "bg-emerald-500",
              },
              {
                name: "Savings Health",
                weight: "20%",
                score: health?.factors?.savingsHealth?.score ?? 65,
                explanation: health?.factors?.savingsHealth?.explanation ?? "Savings rate declined to 17% (Target: 20%+).",
                color: "bg-cyan-500",
              },
              {
                name: "Debt Burden",
                weight: "20%",
                score: health?.factors?.debtBurden?.score ?? 65,
                explanation: health?.factors?.debtBurden?.explanation ?? "DTI currently at 20.0% of monthly income.",
                color: "bg-teal-500",
              },
              {
                name: "Spending Behavior",
                weight: "15%",
                score: health?.factors?.spendingBehavior?.score ?? 58,
                explanation: health?.factors?.spendingBehavior?.explanation ?? "Discretionary spending represents 34% of income.",
                color: "bg-amber-500",
              },
              {
                name: "Emergency Buffer",
                weight: "10%",
                score: health?.factors?.emergencyBuffer?.score ?? 62,
                explanation: health?.factors?.emergencyBuffer?.explanation ?? "1.3 months runway vs minimum 3 months recommended.",
                color: "bg-orange-500",
              },
              {
                name: "Repayment Consistency",
                weight: "10%",
                score: health?.factors?.repaymentConsistency?.score ?? 90,
                explanation: health?.factors?.repaymentConsistency?.explanation ?? "100% on-time institutional repayment history.",
                color: "bg-indigo-500",
              },
            ].map((factor) => (
              <div key={factor.name} className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{factor.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Weight: {factor.weight}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-white">{factor.score}</span>
                    <span className="text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${factor.color}`}
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>
                <span className="block text-[11px] text-slate-400 mt-1.5">
                  {factor.explanation}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Most Important Actions (Section 19) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Today's Most Important Actions</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Next Best Action Engine</span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Prioritized recommendations to actively curb financial risk before month-end.
            </p>

            <div className="space-y-3.5">
              {nextActions && nextActions.map((action: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {action.title}
                    </h4>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-slate-400 uppercase">
                      {action.badgeText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300 font-medium">Why? </strong>
                    {action.reason}
                  </p>
                  <div className="mt-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-300">
                    {action.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Coach Quick Prompt Box */}
          <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">Ask AI Financial Coach</span>
                <p className="text-[11px] text-slate-400">"Can I afford a ₹20,000 purchase right now?"</p>
              </div>
            </div>
            <Link
              href="/ai-coach"
              className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              Ask
            </Link>
          </div>
        </div>

      </div>

      {/* Row 3: Quick Navigation to Major Simulation & Planning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Link
          href="/future"
          className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-bold text-white">Financial Time Machine</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Project cashflow & buffer trajectories across 30, 60, 90, and 180 days.
            </p>
          </div>
        </Link>

        <Link
          href="/simulator"
          className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-bold text-white">Crash Simulator</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Test impact of 10% salary loss or ₹50k emergencies with Prevent This Future.
            </p>
          </div>
        </Link>

        <Link
          href="/loan-readiness"
          className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-bold text-white">Loan Readiness & Reverse Roadmap</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Assess borrowing capacity and view 5-month milestones to get ready.
            </p>
          </div>
        </Link>

        <Link
          href="/debt-recovery"
          className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CreditCard className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-bold text-white">Debt Recovery Strategies</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Compare Avalanche, Snowball, and Balanced Shield strategies.
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
}
