"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Receipt, 
  Trash2, 
  Filter, 
  Calendar, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Tag, 
  Check, 
  X,
  PieChart as PieChartIcon,
  BarChart3
} from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [filter, setFilter] = useState("all"); // all | today | week | month
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Transaction Form State
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "EXPENSE",
    categoryName: "Food",
    paymentMethod: "UPI",
    isRecurring: false,
    isEssential: false,
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions?filter=${filter}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setSummary(data.summary || {});
      setCategoryBreakdown(data.categoryBreakdown || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setForm({
          description: "",
          amount: "",
          type: "EXPENSE",
          categoryName: "Food",
          paymentMethod: "UPI",
          isRecurring: false,
          isEssential: false,
        });
        fetchTransactions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const categories = [
    "Food",
    "Transport",
    "Housing",
    "Utilities",
    "Shopping",
    "Entertainment",
    "Subscriptions",
    "Healthcare",
    "Education",
    "EMI",
    "Insurance",
    "Other",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Daily Financial Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time transaction stream with automated category intelligence and solvency impact
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Automated Calculations Summary Bar (Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Inflows</span>
          <span className="block text-base font-bold text-emerald-400 font-mono-num mt-1">
            ₹{(summary.totalIncome || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Expenses</span>
          <span className="block text-base font-bold text-rose-400 font-mono-num mt-1">
            ₹{(summary.totalExpenses || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Net Savings</span>
          <span className="block text-base font-bold text-cyan-400 font-mono-num mt-1">
            ₹{(summary.totalSavings || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Savings Rate</span>
          <span className="block text-base font-bold text-cyan-300 font-mono-num mt-1">
            {((summary.savingsRate || 0) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Debt Servicing</span>
          <span className="block text-base font-bold text-orange-400 font-mono-num mt-1">
            ₹{(summary.debtPayments || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Discretionary</span>
          <span className="block text-base font-bold text-amber-400 font-mono-num mt-1">
            ₹{(summary.discretionarySpending || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Essential Needs</span>
          <span className="block text-base font-bold text-slate-200 font-mono-num mt-1">
            ₹{(summary.essentialSpending || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Main Content: Category Breakdown + Transactions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown Sidebar */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-400" />
              Spending by Category
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Current Month</span>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No categorized expenses recorded.</p>
            ) : (
              categoryBreakdown.map((item) => {
                const pct = summary.totalExpenses > 0
                  ? Math.round((item.amount / summary.totalExpenses) * 100)
                  : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="text-slate-400 font-mono-num">
                        ₹{item.amount.toLocaleString('en-IN')}{" "}
                        <span className="text-[10px] text-slate-500">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Transactions Table with Filters */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            </div>

            <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              {["all", "today", "week", "month"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1 font-medium capitalize transition ${
                    filter === f
                      ? "bg-slate-800 text-emerald-400 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 pl-2">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      No transactions found for the selected timeframe.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            tx.type === "INCOME"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}>
                            {tx.type === "INCOME" ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{tx.description}</span>
                            {tx.isRecurring && (
                              <span className="text-[10px] text-teal-400 font-mono">Recurring Outlay</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
                          {tx.categoryName}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3 text-slate-400 text-[11px]">
                        {new Date(tx.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className={`py-3 text-right font-mono font-bold ${
                        tx.type === "INCOME" ? "text-emerald-400" : "text-slate-200"
                      }`}>
                        {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Record Transaction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "EXPENSE" })}
                  className={`rounded-xl p-2.5 text-xs font-bold transition text-center ${
                    form.type === "EXPENSE"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  Expense Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "INCOME" })}
                  className={`rounded-xl p-2.5 text-xs font-bold transition text-center ${
                    form.type === "INCOME"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  Income Inflow
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Grocery Supermarket"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 2500"
                  required
                  min="1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={form.categoryName}
                    onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500"
                  />
                  <span>Recurring monthly subscription/bill</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
