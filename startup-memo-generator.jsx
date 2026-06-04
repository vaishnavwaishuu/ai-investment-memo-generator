import { useState, useRef } from "react";

const SECTIONS = [
  "Executive Summary",
  "Problem & Market Opportunity",
  "Product & Solution",
  "Business Model & Revenue",
  "Team & Founders",
  "Traction & Key Metrics",
  "Competitive Landscape",
  "Key Risks & Mitigations",
  "Investment Thesis",
  "Recommended Next Steps",
];

const SAMPLE_STARTUPS = [
  { name: "Zepto", domain: "Quick Commerce", country: "India" },
  { name: "Razorpay", domain: "Fintech / Payments", country: "India" },
  { name: "Darwinbox", domain: "HR Tech / SaaS", country: "India" },
  { name: "Monzo", domain: "Neobank / Fintech", country: "UK" },
  { name: "Wayve", domain: "Autonomous Vehicles / AI", country: "UK" },
];

const RATINGS = ["Strong Buy", "Buy", "Hold", "Pass"];
const RATING_COLORS = {
  "Strong Buy": { bg: "#d1fae5", text: "#065f46", border: "#34d399" },
  "Buy": { bg: "#dbeafe", text: "#1e40af", border: "#60a5fa" },
  "Hold": { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  "Pass": { bg: "#fee2e2", text: "#991b1b", border: "#f87171" },
};

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#c8a96e",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: "'DM Mono', monospace" }}>{score}/10</span>
      </div>
      <div style={{ height: 4, background: "#1e293b", borderRadius: 2 }}>
        <div style={{
          height: "100%", borderRadius: 2,
          width: `${score * 10}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

function MemoSection({ title, content, index }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      borderBottom: "1px solid #1e293b",
      animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "14px 0", display: "flex", alignItems: "center", gap: 12,
          textAlign: "left",
        }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: "50%",
          background: "#0f172a", border: "1px solid #334155",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "#c8a96e", fontFamily: "'DM Mono', monospace",
          flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", letterSpacing: "0.04em", flex: 1, textTransform: "uppercase" }}>
          {title}
        </span>
        <span style={{ color: "#475569", fontSize: 16, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 16, paddingLeft: 34 }}>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
            {content}
          </p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [startupName, setStartupName] = useState("");
  const [domain, setDomain] = useState("");
  const [country, setCountry] = useState("");
  const [stage, setStage] = useState("Series A");
  const [extraContext, setExtraContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState(null);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const memoRef = useRef(null);

  const LOADING_MSGS = [
    "Scanning startup signals…",
    "Analyzing market landscape…",
    "Profiling founders & team…",
    "Assessing competitive moat…",
    "Stress-testing the thesis…",
    "Drafting investment memo…",
  ];

  const handleSample = (s) => {
    setStartupName(s.name);
    setDomain(s.domain);
    setCountry(s.country);
  };

  const generateMemo = async () => {
    if (!startupName.trim()) return;
    setLoading(true);
    setMemo(null);
    setError("");

    let msgIdx = 0;
    setLoadingMsg(LOADING_MSGS[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[msgIdx]);
    }, 2000);

    const prompt = `You are a senior VC analyst at a top-tier venture capital firm. Generate a comprehensive, professional investment memo for the following startup.

Startup: ${startupName}
Domain/Sector: ${domain || "Unknown"}
Country/Region: ${country || "Unknown"}
Funding Stage: ${stage}
Additional Context: ${extraContext || "None provided"}

Generate a detailed investment memo as a JSON object with EXACTLY this structure:
{
  "startupName": "name",
  "tagline": "one punchy line describing what they do",
  "memoDate": "current month year",
  "analystNote": "2-sentence analyst note on why this memo was generated",
  "rating": "one of: Strong Buy, Buy, Hold, Pass",
  "scores": {
    "market": 8,
    "team": 7,
    "product": 8,
    "traction": 6,
    "risk": 5
  },
  "keyStats": [
    {"label": "Market Size", "value": "$X billion"},
    {"label": "Stage", "value": "Series X"},
    {"label": "Founded", "value": "YYYY"},
    {"label": "Sector", "value": "sector name"}
  ],
  "sections": {
    "Executive Summary": "3-4 sentences covering the opportunity, product, and recommendation",
    "Problem & Market Opportunity": "Detailed paragraph covering the pain point, TAM/SAM/SOM estimates, market timing, and tailwinds",
    "Product & Solution": "Detailed paragraph on the product, core features, technology differentiator, and moat",
    "Business Model & Revenue": "Paragraph on how they make money, unit economics, pricing model, and margin profile",
    "Team & Founders": "Paragraph on founding team, backgrounds, domain expertise, and why them",
    "Traction & Key Metrics": "Paragraph on growth metrics, revenue run rate, customer count, key milestones, and momentum",
    "Competitive Landscape": "Paragraph naming 3-4 competitors, differentiation strategy, and defensibility",
    "Key Risks & Mitigations": "Paragraph covering top 3-4 risks with mitigation strategies for each",
    "Investment Thesis": "Strong paragraph arguing why this is a compelling investment at this stage",
    "Recommended Next Steps": "Bullet-style paragraph listing 4-5 specific due diligence actions"
  }
}

Be specific, realistic, and insightful. Use real market data where you know it. Write like a seasoned VC analyst, not a generic report. Return ONLY the JSON, no markdown, no preamble.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setMemo(parsed);
      setTimeout(() => memoRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("Failed to generate memo. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const ratingStyle = memo ? (RATING_COLORS[memo.rating] || RATING_COLORS["Hold"]) : {};

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020817",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e2e8f0",
      padding: "0 0 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.2); } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: #c8a96e !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f172a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .sample-btn:hover { background: #1e293b !important; border-color: #c8a96e !important; color: #c8a96e !important; }
        .gen-btn:hover { background: #b8963e !important; }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e293b",
        padding: "24px 32px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #c8a96e, #8b6914)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>◈</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", color: "#f1f5f9" }}>MemoForge</div>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>AI INVESTMENT MEMO GENERATOR</div>
          </div>
        </div>
        <div style={{
          fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace",
          background: "#0f172a", padding: "4px 12px", borderRadius: 20,
          border: "1px solid #1e293b",
        }}>
          POWERED BY CLAUDE
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "48px 0 36px", animation: "fadeIn 0.6s ease" }}>
          <div style={{
            display: "inline-block",
            fontSize: 11, color: "#c8a96e",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em",
            background: "#c8a96e15", border: "1px solid #c8a96e30",
            padding: "4px 14px", borderRadius: 20, marginBottom: 20,
          }}>
            VC-GRADE RESEARCH · INSTANT GENERATION
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 38, fontWeight: 700, color: "#f8fafc",
            lineHeight: 1.2, margin: "0 0 14px",
          }}>
            Generate Investment Memos<br />
            <span style={{ color: "#c8a96e" }}>Like a Senior VC Analyst</span>
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
            Enter a startup name and get a comprehensive investment memo in seconds —<br />
            structured exactly how top-tier VC firms write them.
          </p>
        </div>

        {/* Input Form */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 16, padding: "28px",
          animation: "fadeIn 0.6s ease 0.1s both",
        }}>
          {/* Sample startups */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 10 }}>
              QUICK LOAD A SAMPLE
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SAMPLE_STARTUPS.map(s => (
                <button
                  key={s.name}
                  className="sample-btn"
                  onClick={() => handleSample(s)}
                  style={{
                    background: "transparent", border: "1px solid #1e293b",
                    color: "#64748b", borderRadius: 20, padding: "5px 14px",
                    fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Startup name */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 7 }}>
                STARTUP NAME *
              </label>
              <input
                value={startupName}
                onChange={e => setStartupName(e.target.value)}
                placeholder="e.g. Zepto, Wayve, Monzo…"
                style={{
                  width: "100%", background: "#020817",
                  border: "1px solid #1e293b", borderRadius: 8,
                  padding: "10px 14px", color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 7 }}>
                DOMAIN / SECTOR
              </label>
              <input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="e.g. Fintech, SaaS, HealthTech"
                style={{
                  width: "100%", background: "#020817",
                  border: "1px solid #1e293b", borderRadius: 8,
                  padding: "10px 14px", color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 7 }}>
                COUNTRY / REGION
              </label>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. India, UK, Southeast Asia"
                style={{
                  width: "100%", background: "#020817",
                  border: "1px solid #1e293b", borderRadius: 8,
                  padding: "10px 14px", color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 7 }}>
                FUNDING STAGE
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                style={{
                  width: "100%", background: "#020817",
                  border: "1px solid #1e293b", borderRadius: 8,
                  padding: "10px 14px", color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 7 }}>
                ANALYST RATING TARGET
              </label>
              <select
                value="auto"
                disabled
                style={{
                  width: "100%", background: "#020817",
                  border: "1px solid #1e293b", borderRadius: 8,
                  padding: "10px 14px", color: "#475569", fontSize: 14,
                  fontFamily: "'DM Mono', monospace", boxSizing: "border-box",
                }}
              >
                <option>AI decides based on analysis</option>
              </select>
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 7 }}>
                ADDITIONAL CONTEXT (OPTIONAL)
              </label>
              <textarea
                value={extraContext}
                onChange={e => setExtraContext(e.target.value)}
                placeholder="Any specifics: recent funding round, product details, key metrics you know, competitors to consider…"
                rows={3}
                style={{
                  width: "100%", background: "#020817",
                  border: "1px solid #1e293b", borderRadius: 8,
                  padding: "10px 14px", color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", resize: "vertical",
                  transition: "border-color 0.2s", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            className="gen-btn"
            onClick={generateMemo}
            disabled={loading || !startupName.trim()}
            style={{
              marginTop: 20, width: "100%",
              background: "#c8a96e", border: "none", borderRadius: 10,
              padding: "14px", color: "#020817",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              letterSpacing: "0.04em", transition: "background 0.15s",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            {loading ? (
              <><LoadingDots /><span style={{ color: "#020817" }}>{loadingMsg}</span></>
            ) : (
              <><span>◈</span><span>Generate Investment Memo</span></>
            )}
          </button>

          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#fee2e215", border: "1px solid #f8717130", borderRadius: 8, fontSize: 13, color: "#f87171" }}>
              {error}
            </div>
          )}
        </div>

        {/* Memo Output */}
        {memo && (
          <div ref={memoRef} style={{ marginTop: 32, animation: "fadeIn 0.5s ease" }}>

            {/* Memo header */}
            <div style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 16, overflow: "hidden",
              marginBottom: 2,
            }}>
              <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1a1f35 100%)",
                padding: "28px 28px 20px",
                borderBottom: "1px solid #1e293b",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#c8a96e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 8 }}>
                      INVESTMENT MEMO · {memo.memoDate?.toUpperCase()}
                    </div>
                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28, fontWeight: 700, color: "#f8fafc", margin: "0 0 6px",
                    }}>
                      {memo.startupName}
                    </h2>
                    <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>
                      {memo.tagline}
                    </p>
                    <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
                      {memo.analystNote}
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      background: ratingStyle.bg + "20",
                      border: `2px solid ${ratingStyle.border}`,
                      borderRadius: 12, padding: "14px 20px", minWidth: 100,
                    }}>
                      <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>
                        RATING
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: ratingStyle.border, fontFamily: "'DM Mono', monospace" }}>
                        {memo.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key stats */}
              {memo.keyStats && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${memo.keyStats.length}, 1fr)`,
                  borderBottom: "1px solid #1e293b",
                }}>
                  {memo.keyStats.map((stat, i) => (
                    <div key={i} style={{
                      padding: "14px 20px",
                      borderRight: i < memo.keyStats.length - 1 ? "1px solid #1e293b" : "none",
                    }}>
                      <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em", marginBottom: 4 }}>
                        {stat.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Score bars */}
              {memo.scores && (
                <div style={{ padding: "20px 28px" }}>
                  <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 14 }}>
                    ANALYST SCORECARD
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px" }}>
                    {[
                      { label: "Market Opportunity", key: "market", color: "#c8a96e" },
                      { label: "Team Quality", key: "team", color: "#60a5fa" },
                      { label: "Product & Tech", key: "product", color: "#34d399" },
                      { label: "Traction & Growth", key: "traction", color: "#a78bfa" },
                      { label: "Risk Profile", key: "risk", color: "#f87171" },
                    ].map(s => (
                      <ScoreBar key={s.key} label={s.label} score={memo.scores[s.key] || 0} color={s.color} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Memo sections */}
            <div style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 16, padding: "8px 28px",
            }}>
              {SECTIONS.map((title, i) => (
                memo.sections?.[title] ? (
                  <MemoSection key={title} title={title} content={memo.sections[title]} index={i} />
                ) : null
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 16, padding: "16px 20px",
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Mono', monospace" }}>
                GENERATED BY MEMOFORGE · FOR PORTFOLIO & RESEARCH USE ONLY
              </div>
              <button
                onClick={generateMemo}
                style={{
                  background: "transparent", border: "1px solid #1e293b",
                  color: "#64748b", borderRadius: 8, padding: "6px 16px",
                  fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ↻ Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
