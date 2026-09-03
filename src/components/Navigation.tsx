"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Receipt, 
  Dna, 
  Clock, 
  Flame, 
  Building2, 
  Compass, 
  Bot, 
  LogOut, 
  UserCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRightLeft
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const role = (session?.user as any)?.role || "CUSTOMER";
  const isBankAnalyst = role === "BANK_ANALYST" || role === "ADMIN";

  const customerNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: Receipt },
    { label: "Financial DNA", href: "/financial-dna", icon: Dna },
    { label: "Future", href: "/future", icon: Clock },
    { label: "Simulator", href: "/simulator", icon: Flame },
    { label: "Loan Readiness", href: "/loan-readiness", icon: Building2 },
    { label: "Debt Recovery", href: "/debt-recovery", icon: Compass },
    { label: "Resilience", href: "/resilience", icon: ShieldAlert },
    { label: "AI Coach", href: "/ai-coach", icon: Bot },
  ];

  const bankNavItems = [
    { label: "Bank Overview", href: "/bank", icon: Layers },
    { label: "Customer Risk Radar", href: "/bank/customers", icon: ShieldAlert },
    { label: "Interventions", href: "/bank/interventions", icon: ArrowRightLeft },
  ];

  const activeNavItems = isBankAnalyst && pathname.startsWith("/bank")
    ? bankNavItems
    : customerNavItems;

  const handleDemoSwitch = async (email: string) => {
    setDemoMenuOpen(false);
    await signIn("credentials", {
      email,
      isDemo: "true",
      redirect: false,
    });
    if (email.includes("analyst")) {
      router.push("/bank");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Financial Firewall
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  v2.0
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                Don't predict the default. Prevent it.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {session && (
            <nav className="hidden xl:flex items-center gap-1">
              {activeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Section: Demo Switcher, Bank Mode Toggle, User */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Mode Selector */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm transition hover:bg-emerald-900/40"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Demo Switcher</span>
              <span className="sm:hidden">Demo</span>
              <ChevronDown className="h-3 w-3 text-emerald-400" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
                  Instant Judge Personas
                </div>
                <button
                  onClick={() => handleDemoSwitch("earlywarning@demo.com")}
                  className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-800 transition flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-amber-300">
                    <span>Customer 2: Early Warning</span>
                    <span className="text-[10px] rounded bg-amber-500/20 px-1 text-amber-300">68 Score</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">Salary spike & declining savings (Primary Demo)</span>
                </button>

                <button
                  onClick={() => handleDemoSwitch("healthy@demo.com")}
                  className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-800 transition flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-400">
                    <span>Customer 1: Healthy</span>
                    <span className="text-[10px] rounded bg-emerald-500/20 px-1 text-emerald-300">84 Score</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">High savings rate, strong buffer</span>
                </button>

                <button
                  onClick={() => handleDemoSwitch("stress@demo.com")}
                  className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-800 transition flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-orange-400">
                    <span>Customer 3: Financial Stress</span>
                    <span className="text-[10px] rounded bg-orange-500/20 px-1 text-orange-300">45 Score</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">High EMI ratio, low reserve buffer</span>
                </button>

                <button
                  onClick={() => handleDemoSwitch("recovery@demo.com")}
                  className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-800 transition flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-cyan-400">
                    <span>Customer 4: Recovery Plan</span>
                    <span className="text-[10px] rounded bg-cyan-500/20 px-1 text-cyan-300">42 → 59</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">Active de-leveraging trajectory</span>
                </button>

                <button
                  onClick={() => handleDemoSwitch("critical@demo.com")}
                  className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-800 transition flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-rose-400">
                    <span>Customer 5: Critical Deficit</span>
                    <span className="text-[10px] rounded bg-rose-500/20 px-1 text-rose-300">27 Score</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">Deficit cashflow & immediate distress</span>
                </button>

                <div className="border-t border-slate-800/80 my-1 pt-1"></div>

                <button
                  onClick={() => handleDemoSwitch("analyst@bank.com")}
                  className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-800 transition flex flex-col bg-purple-950/20 border border-purple-500/20"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-purple-300">
                    <span>Bank Risk Analyst</span>
                    <span className="text-[10px] rounded bg-purple-500/20 px-1 text-purple-300">Bank Console</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">Portfolio early-warning & proactive interventions</span>
                </button>
              </div>
            )}
          </div>

          {/* Bank Console Toggle button if Bank Analyst */}
          {isBankAnalyst && (
            <Link
              href={pathname.startsWith("/bank") ? "/dashboard" : "/bank"}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/40 transition"
            >
              <Layers className="h-3.5 w-3.5 text-purple-400" />
              {pathname.startsWith("/bank") ? "Customer View" : "Bank Console"}
            </Link>
          )}

          {/* User Status / Login */}
          {session ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 leading-tight">
                  {session.user?.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {role === "BANK_ANALYST" ? "Risk Officer" : "Retail Customer"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign Out"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-500 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6">
          <div className="space-y-1">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-slate-800 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar for Rapid Thumb Navigation */}
      {session && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 backdrop-blur-xl">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/dashboard" ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-[10px]">Health</span>
          </Link>
          <Link
            href="/future"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/future" ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="text-[10px]">Future</span>
          </Link>
          <Link
            href="/simulator"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/simulator" ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <Flame className="h-4 w-4" />
            <span className="text-[10px]">Simulate</span>
          </Link>
          <Link
            href="/loan-readiness"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/loan-readiness" ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span className="text-[10px]">Loan</span>
          </Link>
          <Link
            href="/ai-coach"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/ai-coach" ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <Bot className="h-4 w-4" />
            <span className="text-[10px]">AI Coach</span>
          </Link>
        </div>
      )}
    </header>
  );
}
