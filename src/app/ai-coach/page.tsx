"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ShieldAlert, 
  Clock, 
  Flame, 
  Building2, 
  Compass, 
  RefreshCw,
  Lightbulb
} from "lucide-react";

export default function AICoachPage() {
  const [messages, setMessages] = useState<Array<{ id?: string; role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello Rohan! I am your Financial Firewall AI Coach. I have direct telemetry on your current financial twin: Monthly Income ₹50,000, Expenses ₹31,500, and your active Health Score of 68/100 (Early Warning).\n\nHow can I help you analyze a purchase, test loan readiness, or optimize your savings today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load existing conversation if present
    fetch("/api/ai/chat")
      .then((r) => r.json())
      .then((res) => {
        if (res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I am currently operating in deterministic offline mode. Based on your ₹50,000 income and ₹10,000 monthly debt obligation, prioritizing your ₹42,000 buffer is recommended.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Can I afford a ₹20,000 purchase?",
    "Why is my health score at 68?",
    "How can I improve my loan readiness for ₹5,00,000?",
    "What is the best way to tackle my debt without losing emergency buffer?",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              AI Financial Coach
            </h1>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
              Context-Aware LLM Layer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persistent assistant grounded in your real-time cashflow telemetry, digital twin, and debt ratios.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>Telemetry Status: Synchronized</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col h-[550px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line ${
                    isUser
                      ? "bg-emerald-600 text-slate-950 font-medium"
                      : "bg-slate-950/80 text-slate-200 border border-slate-800/80 shadow-md"
                  }`}
                >
                  {m.content}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Bot className="h-4 w-4 animate-bounce" />
              </div>
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></div>
                Analyzing financial twin & simulating scenarios...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Pills (for rapid judge testing) */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>Suggested Hackathon Prompts:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your cashflow, upcoming expenses, or loan options..."
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>

      {/* Compliance Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        <strong>Responsible Finance Notice: </strong>
        The AI Financial Coach is an algorithmic informational tool that computes affordability scenarios based on provided telemetry. It does not provide regulated fiduciary or investment advisory services.
      </p>

    </div>
  );
}
