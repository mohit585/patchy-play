import { useState } from "react";

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [eye, setEye] = useState("left");
  const [goal, setGoal] = useState("30");

  function nextStep() {
    if (step === 1 && !name.trim()) return;
    setStep((prev) => prev + 1);
  }

  function handleFinish() {
    const profile = {
      name: name.trim(),
      eye,
      dailyGoal: Number(goal) * 60,
      onboardingComplete: true,
    };

    localStorage.setItem("childProfile", JSON.stringify(profile));
    onComplete(profile);
  }

  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "40px auto",
        padding: "28px",
        borderRadius: "24px",
        background: "#ffffff",
        border: "3px solid #fde68a",
        boxShadow: "0 16px 40px rgba(14, 165, 233, 0.12)",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Welcome to Therapy Time</h1>
      <p style={{ color: "#64748b" }}>Step {step} of 3</p>

      {step === 1 && (
        <div>
          <h2>What is your name?</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Which eye needs support?</h2>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => setEye("left")}
              style={eye === "left" ? selectedButton : buttonStyle}
            >
              Left Eye
            </button>
            <button
              onClick={() => setEye("right")}
              style={eye === "right" ? selectedButton : buttonStyle}
            >
              Right Eye
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Choose your daily goal</h2>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
            }}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
      )}

      <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
        {step > 1 && (
          <button onClick={() => setStep((prev) => prev - 1)} style={buttonStyle}>
            Back
          </button>
        )}

        {step < 3 ? (
          <button onClick={nextStep} style={selectedButton}>
            Next
          </button>
        ) : (
          <button onClick={handleFinish} style={selectedButton}>
            Start App
          </button>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "700",
};

const selectedButton = {
  ...buttonStyle,
  background: "#38bdf8",
  color: "#ffffff",
  border: "1px solid #38bdf8",
};
