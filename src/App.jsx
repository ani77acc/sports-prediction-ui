import { useState } from "react";

const MATCH = {
  home: "Manchester City",
  away: "Liverpool",
  homeShort: "MCI",
  awayShort: "LIV",
  homeLogo: "🔵",
  awayLogo: "🔴",
  probabilities: { home: 55, draw: 20, away: 25 },
  prediction: "Manchester City",
  confidence: "High",
};

const FACTORS = [
  { label: "Form", value: 15, positive: true },
  { label: "Head-to-Head", value: 10, positive: true },
  { label: "Home Advantage", value: 8, positive: true },
  { label: "Injuries / Squad Strength", value: 5, positive: false },
  { label: "Possession / Attacking Stats", value: 12, positive: true },
  { label: "Recent Goals Scored", value: 10, positive: true },
];

const MODELS = [
  { name: "Team Strength Model (ELO)", pick: "Manchester City", icon: "⚡" },
  { name: "Goal Probability Model (xG)", pick: "Manchester City", icon: "🎯" },
  { name: "Form & Momentum Model", pick: "Manchester City", icon: "📈" },
  { name: "Squad Strength Model", pick: "Liverpool", icon: "👥" },
  { name: "Ensemble Model (Final)", pick: "Manchester City", icon: "🏆", final: true },
];

const NAV = ["Prediction", "Explainability", "Model Breakdown"];

function ProbBar({ label, value, highlight }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, textTransform: "uppercase" }}>
        <span style={{ color: highlight ? "#00f0ff" : "#8892a4" }}>{label}</span>
        <span style={{ color: highlight ? "#00f0ff" : "#c0c8d8", fontWeight: 700, fontSize: 15 }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: "#1a2236", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${value}%`, height: "100%", borderRadius: 4,
          background: highlight ? "linear-gradient(90deg, #00f0ff, #0077ff)" : "linear-gradient(90deg, #3a4560, #4a5670)",
          transition: "width 1s cubic-bezier(.4,0,.2,1)",
          boxShadow: highlight ? "0 0 12px #00f0ff55" : "none",
        }} />
      </div>
    </div>
  );
}

function FactorBar({ label, value, positive }) {
  const maxWidth = 60;
  const barWidth = (value / 15) * maxWidth;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, fontFamily: "'Bebas Neue', sans-serif" }}>
      <span style={{ width: 220, fontSize: 13, letterSpacing: 1.2, color: "#c0c8d8", textTransform: "uppercase", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: `${barWidth}%`, minWidth: 24, height: 10, borderRadius: 5,
          background: positive ? "linear-gradient(90deg, #00c97b, #00f0ff)" : "linear-gradient(90deg, #ff4466, #ff7744)",
          boxShadow: positive ? "0 0 10px #00c97b44" : "0 0 10px #ff446644",
          transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
        }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: positive ? "#00f0ff" : "#ff5566", letterSpacing: 1 }}>
          {positive ? "+" : "−"}{value}%
        </span>
      </div>
    </div>
  );
}

function ModelCard({ name, pick, icon, isFinal }) {
  const isCity = pick === "Manchester City";
  return (
    <div style={{
      background: isFinal ? "linear-gradient(135deg, #0a1628, #0d2847)" : "#0d1525",
      border: isFinal ? "2px solid #00f0ff" : "1px solid #1a2540",
      borderRadius: 14,
      padding: "20px 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      boxShadow: isFinal ? "0 0 30px #00f0ff22, inset 0 0 30px #00f0ff08" : "none",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 13, letterSpacing: 1.2, color: isFinal ? "#00f0ff" : "#8892a4", fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase" }}>
            {isFinal ? "Final Decision" : "Model"}
          </div>
          <div style={{ fontSize: 15, color: "#e4e8f0", fontWeight: 500, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{name}</div>
        </div>
      </div>
      <div style={{
        background: isCity ? "linear-gradient(135deg, #00294d, #004488)" : "linear-gradient(135deg, #4d0015, #880022)",
        padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
        color: isCity ? "#00f0ff" : "#ff8899",
        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5,
        border: isCity ? "1px solid #005599" : "1px solid #880033",
      }}>
        {pick === "Manchester City" ? "MCI" : "LIV"}
      </div>
    </div>
  );
}

function PredictionScreen() {
  const { home, away, homeLogo, awayLogo, probabilities, prediction, confidence } = MATCH;
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      {/* Match Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#5a6580", fontFamily: "'Bebas Neue', sans-serif", marginBottom: 12, textTransform: "uppercase" }}>
          Premier League — Matchday 34
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>{homeLogo}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e4e8f0", fontFamily: "'DM Sans', sans-serif" }}>{home}</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#3a4560", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, padding: "8px 16px", border: "1px solid #1a2540", borderRadius: 10 }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>{awayLogo}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e4e8f0", fontFamily: "'DM Sans', sans-serif" }}>{away}</div>
          </div>
        </div>
      </div>

      {/* Probabilities */}
      <div style={{ background: "#0d1525", borderRadius: 16, padding: "28px 32px", marginBottom: 20, border: "1px solid #1a2540" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, color: "#5a6580", fontFamily: "'Bebas Neue', sans-serif", marginBottom: 20, textTransform: "uppercase" }}>Win Probabilities</div>
        <ProbBar label={home} value={probabilities.home} highlight={true} />
        <ProbBar label="Draw" value={probabilities.draw} highlight={false} />
        <ProbBar label={away} value={probabilities.away} highlight={false} />
      </div>

      {/* Prediction Card */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628, #0d2847)",
        borderRadius: 16, padding: "28px 32px",
        border: "2px solid #00f0ff33",
        boxShadow: "0 0 40px #00f0ff11, inset 0 0 40px #00f0ff05",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, color: "#00f0ff88", fontFamily: "'Bebas Neue', sans-serif", marginBottom: 6, textTransform: "uppercase" }}>Predicted Winner</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>{prediction}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
              <span style={{ background: "#00f0ff15", color: "#00f0ff", padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, border: "1px solid #00f0ff33" }}>
                {probabilities.home}%
              </span>
              <span style={{ background: "#00c97b15", color: "#00c97b", padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, border: "1px solid #00c97b33" }}>
                {confidence} Confidence
              </span>
            </div>
          </div>
          <div style={{ fontSize: 64 }}>{homeLogo}</div>
        </div>
      </div>
    </div>
  );
}

function ExplainabilityScreen() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#5a6580", fontFamily: "'Bebas Neue', sans-serif", marginBottom: 8, textTransform: "uppercase" }}>
        Why Manchester City?
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#e4e8f0", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
        Contribution Breakdown
      </div>
      <div style={{ background: "#0d1525", borderRadius: 16, padding: "28px 32px", border: "1px solid #1a2540", marginBottom: 20 }}>
        {FACTORS.map((f, i) => <FactorBar key={i} {...f} />)}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 24, fontSize: 12, color: "#5a6580", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(90deg, #00c97b, #00f0ff)" }} />
          Positive Impact
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(90deg, #ff4466, #ff7744)" }} />
          Negative Impact
        </div>
      </div>
      {/* Net impact */}
      <div style={{
        marginTop: 20, background: "linear-gradient(135deg, #0a1628, #0d2847)",
        borderRadius: 14, padding: "20px 28px",
        border: "1px solid #00f0ff22",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 13, letterSpacing: 1.5, color: "#8892a4", fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase" }}>Net Impact Score</span>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#00f0ff", fontFamily: "'DM Sans', sans-serif" }}>+50%</span>
      </div>
    </div>
  );
}

function ModelBreakdownScreen() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#5a6580", fontFamily: "'Bebas Neue', sans-serif", marginBottom: 8, textTransform: "uppercase" }}>
        Under the Hood
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#e4e8f0", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
        Model Outputs
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MODELS.map((m, i) => <ModelCard key={i} name={m.name} pick={m.pick} icon={m.icon} isFinal={m.final} />)}
      </div>
      {/* Consensus */}
      <div style={{
        marginTop: 20, background: "#0d1525", borderRadius: 14, padding: "18px 28px",
        border: "1px solid #1a2540",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 13, letterSpacing: 1.5, color: "#8892a4", fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase" }}>Model Consensus</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#00f0ff", fontFamily: "'DM Sans', sans-serif" }}>4 / 5 → Manchester City</span>
      </div>
    </div>
  );
}

const SCREENS = [PredictionScreen, ExplainabilityScreen, ModelBreakdownScreen];

export default function App() {
  const [screen, setScreen] = useState(0);
  const Screen = SCREENS[screen];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #070c18; color: #e4e8f0; font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 40px", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 13, letterSpacing: 4, color: "#00f0ff", fontFamily: "'Bebas Neue', sans-serif", marginBottom: 2 }}>⚽ MATCHIQ</div>
          <div style={{ fontSize: 11, color: "#3a4560", fontFamily: "'DM Sans', sans-serif" }}>AI-Powered Match Prediction</div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", background: "#0d1525", borderRadius: 12, padding: 4, marginBottom: 32, border: "1px solid #1a2540" }}>
          {NAV.map((label, i) => (
            <button key={i} onClick={() => setScreen(i)} style={{
              flex: 1, padding: "10px 8px", border: "none", borderRadius: 9, cursor: "pointer",
              fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
              fontFamily: "'DM Sans', sans-serif",
              background: screen === i ? "linear-gradient(135deg, #00294d, #004488)" : "transparent",
              color: screen === i ? "#00f0ff" : "#5a6580",
              transition: "all 0.25s ease",
              boxShadow: screen === i ? "0 0 16px #00f0ff15" : "none",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Screen */}
        <Screen />
      </div>
    </>
  );
}