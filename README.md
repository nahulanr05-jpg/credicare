# Financial Firewall

> **"Don't predict the default. Prevent it."**

Financial Firewall is an AI-powered financial early-warning and adaptive intervention platform designed around one core principle:
*Detect financial distress early, explain why it is happening, simulate what happens next, and provide an adaptive intervention plan before the situation becomes a crisis.*

This is **NOT** just an expense tracker. It combines continuous behavioral analytics, a real-time Financial Digital Twin, future financial projections, stress crash simulations, responsible loan readiness assessments, debt recovery roadmaps, and an institutional bank-side risk console.

---

## 3-Minute Hackathon Demo Flow

| Step | Screen / Feature | What Judges Will See |
|---|---|---|
| **Step 1** | **Customer Dashboard** (`/dashboard`) | Financial Health Score: **68 / 100** (Early Warning) circular radial visualization with live telemetry across Income (₹50k), Expenses (₹31.5k), Savings (₹8.5k), Debt (₹10k), and Buffer (₹42k). |
| **Step 2** | **Early Warning Banner** | Behavioral radar flags: *"Your spending is 24% higher during the first 7 days after salary credit"* & *"Savings rate compressed for 3 consecutive review cycles"*. |
| **Step 3** | **Financial Time Machine** (`/future`) | Interactive temporal slider (Today → 30 → 60 → **90 Days** → 180 Days). Projects solvency deteriorating from 68 to **51** as buffer erodes. |
| **Step 4** | **Prevent This Future** (`/simulator`) | Click **PREVENT THIS FUTURE** to view the adaptive 5-step mitigation protocol: projected health recovers from 47 (without intervention) to **61** (with intervention). |
| **Step 5** | **Loan Readiness** (`/loan-readiness`) | Enter loan amount **₹5,00,000** (36 months @ 13.5%). Computes estimated EMI (₹16,971) and outputs: **NOT CURRENTLY READY** with transparent attribution (DTI reaches 54%, post-EMI liquidity drops below safe buffer). |
| **Step 6** | **Reverse Loan Planner** | Click **WHAT WOULD MAKE YOU READY?** to view the dynamic 5-month milestone roadmap to transition from *Not Ready* to *Ready*. |
| **Step 7** | **Crash Simulator** (`/simulator`) | Simulate a **10% income reduction** or ₹50k emergency expense. Observe immediate before/after delta and deterministic attribution. |
| **Step 8** | **Bank Intervention Console** (`/bank`) | Switch to **Bank Analyst mode**. Observe 1,240 customer cohorts: 🟢 Healthy (872), 🟡 Early Warning (238), 🟠 Stress (96), 🔴 Critical (34). |
| **Step 9** | **Customer Risk Radar & Interventions** (`/bank/customers`, `/bank/interventions`) | Inspect Customer #1024. View explainable risk breakdown, historical timeline, and trigger a structured pre-delinquency intervention (Counselling, Restructuring, Assistance) with outcome tracking (48 → 59 Health). |

---

## Key Modules

1. **Customer Dashboard (`/dashboard`)**: Radial 0–100 Financial Health score with transparent contributing factor weights (Income Stability 25%, Savings Health 20%, Debt Burden 20%, Spending Behavior 15%, Emergency Buffer 10%, Repayment Consistency 10%).
2. **Daily Financial Tracker (`/transactions`)**: Inflow/outflow management with automated calculations for income, burn, savings rate, discretionary share, and category charts.
3. **Financial Digital Twin (`/financial-dna`)**: Real-time state machine tracking *Income → Expenses → Savings → Debt → Buffer → Health → Risk*.
4. **Financial DNA (`/financial-dna`)**: Behavioral pattern identification (Salary-Cycle Spender, Steady Saver, Impulse Spender, Subscription Heavy, Debt-Conservative, Credit Dependent) with neutral, non-shaming language.
5. **Financial Time Machine (`/future`)**: 180-day forward projection of liquid cushion and default vulnerability.
6. **Financial Crash Simulator (`/simulator`)**: Stress-testing against salary reductions, emergency outlays, rent hikes, and new debt, coupled with the "PREVENT THIS FUTURE" adaptive plan.
7. **Loan Readiness & Reverse Planner (`/loan-readiness`)**: Responsible borrowing capacity analysis and 5-month milestone roadmap to achieve readiness.
8. **Financial Recovery Mode (`/debt-recovery`)**: Comparative strategy engine (Avalanche / Highest Cost, Snowball / Smallest Balance, and Balanced Shield) that never empties emergency reserves.
9. **Financial Resilience Score (`/resilience`)**: Non-credit-score metric measuring household shock absorption across multi-month disruptions.
10. **AI Financial Coach (`/ai-coach`)**: Persistent context-aware assistant grounded in actual account telemetry with fallback offline mode.
11. **Bank Early-Warning Console (`/bank`)**: Institutional risk radar, explainable attribution, and pre-delinquency intervention registry.

---

## Responsible Finance Rules

- **Zero Guaranteed Claims**: Does NOT guarantee loan approval, statutory credit score changes, or debt elimination.
- **Prudential Language**: Employs *"Financial readiness assessment"*, *"Credit-health factors"*, *"Estimated repayment capacity"*, *"Projected risk"*, and *"Recommended action"*.
- **No Sensitive Characteristics**: Recommendations are derived strictly from objective cashflow velocity and balance sheet ratios, never sensitive demographic factors.
- **Explainable Attribution**: Every score, warning signal, and risk classification features explicit mathematical attribution.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Design Aesthetic**: Bloomberg Terminal × Apple Financial Neobank (Dark glassmorphism, tabular figures, emerald/cyan/amber/rose financial status indicators)
- **Backend**: Next.js Server-Side API Routes with Zod schema validation
- **Database & ORM**: PostgreSQL / SQLite with Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider + 1-Click Instant Demo Persona Switcher)
- **AI Abstraction Layer**: `AIService` supporting OpenAI-compatible endpoints with robust deterministic offline fallback

---

## 1-Click Instant Demo Mode Personas

No account registration is required to evaluate Financial Firewall:

1. **Customer 2: Early Warning** (`earlywarning@demo.com`) — Health: **68** (Primary Demo Persona: Salary spike & declining savings)
2. **Customer 1: Healthy** (`healthy@demo.com`) — Health: **84** (Low debt, strong 32.5% savings rate)
3. **Customer 3: Financial Stress** (`stress@demo.com`) — Health: **45** (High EMI burden 42%, low buffer)
4. **Customer 4: Recovery Plan** (`recovery@demo.com`) — Health: **59** (De-leveraging trajectory: 42 → 47 → 53 → 59)
5. **Customer 5: Critical Deficit** (`critical@demo.com`) — Health: **27** (Net cashflow deficit, imminent distress)
6. **Bank Risk Officer** (`analyst@bank.com`) — Accesses Institutional Bank Risk Console & Interventions

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npx prisma db push

# 3. Seed realistic customer profiles and bank portfolio
npm run seed

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser