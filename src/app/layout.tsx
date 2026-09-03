import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Financial Firewall | Don't predict the default. Prevent it.",
  description:
    "AI-powered early-warning financial intervention platform that detects distress, simulates future cashflow scenarios, and provides adaptive recovery pathways.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 pb-16 sm:pb-8">{children}</main>
            
            {/* Responsible Finance Footer */}
            <footer className="border-t border-slate-800/60 bg-slate-950/40 py-6 text-center text-xs text-slate-400">
              <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-400">Financial Firewall Intelligence Core</span>
                </div>
                <p className="max-w-2xl text-[11px] leading-relaxed text-slate-400">
                  <strong className="text-slate-400">Responsible Finance Notice:</strong> Financial Health scores and simulations represent predictive analytical projections and not statutory credit bureau ratings or guaranteed loan approvals. Actual decisions rest solely with regulated lending institutions.
                </p>
                <div className="text-[11px] text-slate-400">
                  Hackathon Edition 2026
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
