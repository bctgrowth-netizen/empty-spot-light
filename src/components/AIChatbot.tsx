import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: `👋 Hello! I'm your **AI Warehouse Assistant**. I can help you with:

- 📊 **Compile reports** on empty space trends
- 💡 **Strategy suggestions** for space optimization
- 📈 **Trend analysis** over time periods
- 🏗️ **Space utilization** recommendations

What would you like to know?`,
};

const DUMMY_RESPONSES: Record<string, string> = {
  report: `## 📊 Empty Space Trend Report

**Period:** March 2026

### Key Findings:
- **Average empty space:** 3,420 m² (34.2% of total)
- **Peak emptiness:** Sunday at 4,500 m² (45%)
- **Lowest emptiness:** Wednesday at 2,800 m² (28%)

### Weekly Trend:
Empty space has been **increasing by 5.1%** week-over-week, suggesting improving inventory turnover.

### Recommendations:
1. Consider **consolidating zones A & C** during low-traffic periods
2. Schedule restocking for **Wednesday–Thursday** when space is minimal
3. Explore **temporary leasing** of Zone B during weekends`,

  strategy: `## 💡 Space Optimization Strategy

### Short-term (1-2 weeks):
1. **Rearrange Zone A** — Move slow-moving inventory to upper racks
2. **Consolidate pallets** in Zone C to free 200 m²
3. **Implement FIFO** in Zone B for faster turnover

### Medium-term (1-3 months):
1. **Install vertical racking** — Gain 40% more cubic capacity
2. **Dynamic slotting** — AI-driven placement based on demand
3. **Cross-docking area** — Reduce staging time by 30%

### Estimated Impact:
- 📈 **+15%** usable space
- ⏱️ **-20%** average refill time
- 💰 **SAR 45,000/month** in savings`,

  trend: `## 📈 Space Utilization Trends

### Last 30 Days:
| Metric | Value | Change |
|--------|-------|--------|
| Avg Empty Space | 3,420 m² | ↑ 5.1% |
| Peak Utilization | 72% | ↓ 2.3% |
| Avg People Count | 18 | ↑ 12% |
| Refill Time | 47 min | ↓ 8 min |

### Observations:
- Empty space is **trending upward** — good for receiving new shipments
- People density is **increasing** — consider safety audits
- Refill times are **improving** due to better zone allocation`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("report") || lower.includes("compile")) return DUMMY_RESPONSES.report;
  if (lower.includes("strateg") || lower.includes("suggest") || lower.includes("optim")) return DUMMY_RESPONSES.strategy;
  if (lower.includes("trend") || lower.includes("analy") || lower.includes("utiliz")) return DUMMY_RESPONSES.trend;
  return `I can help you with **space reports**, **optimization strategies**, and **trend analysis**. Try asking me to:

- "Compile a report on empty space trends"
- "Suggest a strategy for space optimization"
- "Analyze utilization trends"`;
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = getResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-primary text-primary-foreground flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <p className="text-sm font-display font-semibold">AI Assistant</p>
              <p className="text-[10px] opacity-80">Warehouse Intelligence</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-3 py-2 text-sm max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className="prose prose-sm max-w-none [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-1 [&_h2]:mb-1 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-1 [&_p]:my-0.5 [&_ul]:my-0.5 [&_ol]:my-0.5 [&_li]:my-0 [&_table]:text-xs">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about space trends, reports..."
              className="text-sm h-9"
            />
            <Button size="sm" className="h-9 px-3" onClick={send} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
