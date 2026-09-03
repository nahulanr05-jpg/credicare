/**
 * AIService: Unified AI Abstraction Layer
 * Supports OpenAI-compatible APIs (OpenAI, DeepSeek, Groq, Ollama, vLLM)
 * Includes robust, explainable deterministic fallbacks when OPENAI_API_KEY is not configured.
 * Guarantees zero downtime and 100% demo-mode functionality.
 */

import { FinancialProfileMetrics, HealthScoreResult, LoanReadinessResult, CrashSimulationResult } from "./financialMath";
import { SpendingEngineResult } from "./ruleEngine";

export interface AIAnalysisContext {
  profileName?: string;
  metrics: FinancialProfileMetrics;
  health: HealthScoreResult;
  spendingAnalysis?: SpendingEngineResult;
}

export class AIService {
  private apiKey: string | undefined;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY?.trim();
    this.baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    this.model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  }

  private isAIConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  private async callProvider(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.isAIConfigured()) {
      return "";
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        console.warn(`[AIService] Provider call failed (${response.status}). Engaging deterministic fallback.`);
        return "";
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || "";
    } catch (err) {
      console.warn("[AIService] Network or API error. Engaging deterministic fallback:", err);
      return "";
    }
  }

  /**
   * 1. Analyze Spending Behavior
   */
  async analyzeSpending(context: AIAnalysisContext): Promise<string> {
    const { metrics, health } = context;
    const systemPrompt = `You are a Senior Banking Risk and Intelligence Officer at Financial Firewall. Provide a 2-3 sentence neutral, objective assessment of spending behavior. Strictly adhere to responsible-finance rules: avoid guaranteed outcomes; use terms like 'projected risk' and 'recommended action'.`;
    const userPrompt = `Monthly Income: ₹${metrics.monthlyIncome}, Monthly Expenses: ₹${metrics.monthlyExpenses}, Discretionary Spending: ₹${metrics.discretionarySpending}, Savings Rate: ${(metrics.savingsRate * 100).toFixed(1)}%, Health Score: ${health.score}/100 (${health.label}).`;

    const aiResponse = await this.callProvider(systemPrompt, userPrompt);
    if (aiResponse) return aiResponse;

    // Deterministic Fallback
    const discRatio = metrics.monthlyIncome > 0 ? (metrics.discretionarySpending / metrics.monthlyIncome) * 100 : 0;
    if (discRatio > 35) {
      return `Discretionary expenses are currently tracking at ${discRatio.toFixed(0)}% of net monthly earnings, which is compressing the active savings buffer. Channeling ₹${Math.round(metrics.discretionarySpending * 0.20).toLocaleString('en-IN')} toward emergency reserves would materially reinforce liquidity runway.`;
    } else if (metrics.savingsRate >= 0.20) {
      return `Spending distribution exhibits disciplined allocation with a ${(metrics.savingsRate * 100).toFixed(0)}% savings rate. Core living outlays remain well proportioned, supporting sustained capital resilience.`;
    } else {
      return `Current monthly outlays remain stable, but lower-than-average monthly savings ${(metrics.savingsRate * 100).toFixed(0)}% leaves limited leeway for sudden financial spikes. Establishing a structured sweep mechanism is recommended.`;
    }
  }

  /**
   * 2. Explain Financial Risk for Bank Analysts or Customer
   */
  async explainRisk(context: AIAnalysisContext): Promise<{
    headline: string;
    primaryDrivers: string[];
    recommendedIntervention: string;
  }> {
    const { metrics, health } = context;
    const dti = metrics.monthlyIncome > 0 ? (metrics.debtObligations / metrics.monthlyIncome) * 100 : 0;
    const bufferMonths = (metrics.monthlyExpenses + metrics.debtObligations) > 0
      ? (metrics.emergencyBuffer / (metrics.monthlyExpenses + metrics.debtObligations)).toFixed(1)
      : "0";

    const drivers: string[] = [];
    if (dti > 35) drivers.push(`Debt-to-income servicing ratio at ${dti.toFixed(0)}% (threshold: 30%).`);
    if (Number(bufferMonths) < 2) drivers.push(`Liquid emergency cushion stands at ${bufferMonths} months of essential burn.`);
    if (metrics.savingsRate < 0.12) drivers.push(`Savings retention compressed to ${(metrics.savingsRate * 100).toFixed(0)}% of compensation.`);
    if (drivers.length === 0) drivers.push("Baseline cashflow exhibits balanced solvency with low liability friction.");

    let intervention = "Maintain automated monitoring and continue quarterly health check-ins.";
    if (health.score < 30) {
      intervention = "Initiate immediate proactive outreach: offer restructuring review and tailored repayment holiday support.";
    } else if (health.score < 50) {
      intervention = "Provide early-stage financial counselling and suggest voluntary discretionary spending caps.";
    } else if (health.score < 65) {
      intervention = "Deliver automated liquidity nudges and alert customer to upcoming debt servicing deadlines.";
    }

    return {
      headline: `Risk Profile: ${health.label} (${health.score}/100)`,
      primaryDrivers: drivers,
      recommendedIntervention: intervention,
    };
  }

  /**
   * 3. Generate Today's Most Important Next Best Action (1 - 3 actions)
   */
  async generateNextAction(context: AIAnalysisContext): Promise<Array<{
    title: string;
    reason: string;
    recommendedAction: string;
    impactLevel: "HIGH" | "MEDIUM" | "LOW";
    badgeText: string;
  }>> {
    const { metrics, health } = context;
    const actions = [];

    // Priority 1: Emergency buffer if low
    if (metrics.emergencyBuffer < 45000) {
      actions.push({
        title: "Build Your Emergency Buffer",
        reason: "Your projected emergency coverage is currently below your target threshold of 3 months expenses.",
        recommendedAction: "Set aside ₹1,500 immediately this month into a dedicated liquid vault.",
        impactLevel: "HIGH" as const,
        badgeText: "Liquidity Shield",
      });
    }

    // Priority 2: Discretionary spending check
    if (metrics.discretionarySpending > metrics.monthlyIncome * 0.30) {
      actions.push({
        title: "Review Discretionary Outlays",
        reason: `Discretionary spend absorbed ₹${Math.round(metrics.discretionarySpending).toLocaleString('en-IN')} this month.`,
        recommendedAction: "Audit recurring subscriptions and pause non-vital lifestyle purchases for the next 14 days.",
        impactLevel: "MEDIUM" as const,
        badgeText: "Spending Guard",
      });
    }

    // Priority 3: Debt obligation check
    if (metrics.debtObligations > 0) {
      actions.push({
        title: "Maintain Scheduled EMI Transfers",
        reason: "Your active debt obligations represent a key factor in your overall Financial Health score.",
        recommendedAction: `Ensure your upcoming ₹${Math.round(metrics.debtObligations).toLocaleString('en-IN')} payment is scheduled 48h prior to due date.`,
        impactLevel: "HIGH" as const,
        badgeText: "Credit Protection",
      });
    } else if (actions.length < 2) {
      actions.push({
        title: "Increase Savings Allocation",
        reason: "Your financial stability indicators are strong.",
        recommendedAction: "Consider channeling ₹3,000 of surplus cashflow into low-risk recurring deposits.",
        impactLevel: "LOW" as const,
        badgeText: "Wealth Growth",
      });
    }

    return actions.slice(0, 3);
  }

  /**
   * 4. Explain What-If Crash Simulation
   */
  async explainSimulation(simulation: CrashSimulationResult): Promise<string> {
    const systemPrompt = `You are a Financial Risk Modeling specialist. In 2 concise sentences, explain why this simulated stress scenario altered the user's financial health score and state one preventative step. Use responsible finance wording.`;
    const userPrompt = `Scenario: ${simulation.scenarioTitle}. Health dropped from ${simulation.originalHealth} to ${simulation.simulatedHealth} (${simulation.healthDelta} pts). Buffer moved from ₹${simulation.originalBuffer} to ₹${simulation.simulatedBuffer}.`;

    const aiText = await this.callProvider(systemPrompt, userPrompt);
    if (aiText) return aiText;

    return `This scenario models an immediate liquidity contraction, reducing the buffer by ₹${Math.round(simulation.originalBuffer - simulation.simulatedBuffer).toLocaleString('en-IN')} and lowering the resilience margin. Implementing the adaptive protocol would recover projected stability to ${simulation.preventativePlan.withInterventionScore}/100.`;
  }

  /**
   * 5. Interactive Financial Coach Chat
   */
  async chatWithCustomer(
    userMessage: string,
    history: Array<{ role: string; content: string }>,
    context: AIAnalysisContext
  ): Promise<string> {
    const { metrics, health } = context;

    // Check if the user is asking about an affordability purchase e.g. "Can I afford a ₹20,000 purchase?"
    const amountMatch = userMessage.match(/(\d+[\d,]*)\s*(?:rupees|rs|inr|k)?/i);
    let purchaseAmount = 0;
    if (amountMatch) {
      const raw = amountMatch[1].replace(/,/g, "");
      purchaseAmount = parseInt(raw, 10);
      if (userMessage.toLowerCase().includes("k") && purchaseAmount < 1000) {
        purchaseAmount *= 1000;
      }
    }

    const systemPrompt = `You are the Financial Firewall AI Coach. 
Financial Profile:
- Monthly Income: ₹${metrics.monthlyIncome.toLocaleString('en-IN')}
- Monthly Expenses: ₹${metrics.monthlyExpenses.toLocaleString('en-IN')}
- Emergency Buffer: ₹${metrics.emergencyBuffer.toLocaleString('en-IN')}
- Debt Obligations: ₹${metrics.debtObligations.toLocaleString('en-IN')}
- Financial Health Score: ${health.score}/100 (${health.label})
- Discretionary Spending: ₹${metrics.discretionarySpending.toLocaleString('en-IN')}

Rules:
1. Ground answers strictly in this user's numbers.
2. NEVER give guaranteed financial outcomes or claim official credit rating changes.
3. Be professional, empathetic, objective, and constructive.
4. Keep answers under 120 words.`;

    if (this.isAIConfigured()) {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.slice(-5).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: userMessage }
      ];

      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: 0.4,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) return reply;
        }
      } catch (e) {
        console.warn("[AIService] Chat provider fallback:", e);
      }
    }

    // Deterministic Chat Responses based on financial context
    const lower = userMessage.toLowerCase();

    if (lower.includes("afford") || lower.includes("purchase") || lower.includes("buy") || purchaseAmount > 0) {
      const amt = purchaseAmount > 0 ? purchaseAmount : 20000;
      const willDrainBuffer = amt > metrics.emergencyBuffer * 0.5;
      const willEliminateSavings = amt > metrics.monthlySavings;

      return `Based on your current financial plan, a ₹${amt.toLocaleString('en-IN')} purchase would reduce your projected monthly savings by approximately ₹${amt.toLocaleString('en-IN')}.\n\nYour emergency buffer (${(metrics.emergencyBuffer).toLocaleString('en-IN')}) would ${willDrainBuffer ? "fall significantly below your comfort threshold" : "remain above minimum requirements"}, but your current discretionary spending is already at ₹${metrics.discretionarySpending.toLocaleString('en-IN')}.\n\nWould you like me to simulate this purchase in your Financial Time Machine?`;
    }

    if (lower.includes("loan") || lower.includes("borrow") || lower.includes("credit")) {
      return `Your current Financial Health Score stands at ${health.score}/100 (${health.label}) with a debt obligation of ₹${metrics.debtObligations.toLocaleString('en-IN')}/month. You can review your detailed capacity in the Loan Readiness tab, where you can also run custom EMI simulations without impacting institutional credit factors.`;
    }

    if (lower.includes("debt") || lower.includes("recovery") || lower.includes("pay off")) {
      return `For debt repayment, our Debt Recovery module compares three balanced approaches: Avalanche (Highest Cost First), Snowball (Smallest Balance First), and the Balanced Financial Shield. The Balanced strategy ensures you never empty your emergency savings just to accelerate debt reduction.`;
    }

    if (lower.includes("health") || lower.includes("score") || lower.includes("dna")) {
      return `Your Financial Health Score is ${health.score}/100 (${health.label}). It is transparently calculated from Income Stability (25%), Savings Health (20%), Debt Burden (20%), Spending Behavior (15%), Emergency Buffer (10%), and Repayment Consistency (10%). It serves as an early-warning signal, not a statutory credit score.`;
    }

    return `I am monitoring your Financial Firewall telemetry. Your current monthly burn is ₹${(metrics.monthlyExpenses + metrics.debtObligations).toLocaleString('en-IN')} against an income of ₹${metrics.monthlyIncome.toLocaleString('en-IN')}. How can I assist you with simulations, debt planning, or expense optimization today?`;
  }
}

export const aiService = new AIService();
export default aiService;
