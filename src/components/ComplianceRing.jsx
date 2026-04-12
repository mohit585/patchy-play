export default function ComplianceRing({
  currentSeconds,
  goalSeconds = 1800,
}) {
  const safeProgress = Math.min(currentSeconds / goalSeconds, 1);
  const percentage = Math.round((currentSeconds / goalSeconds) * 100);

  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeProgress);

  let progressColor = "#ef4444";
  if (percentage >= 100) {
    progressColor = "#22c55e";
  } else if (percentage >= 50 && percentage < 80) {
    progressColor = "#eab308";
  } else if (percentage >= 80) {
    progressColor = "#84cc16";
  }

  function formatMinutes(seconds) {
    return `${Math.floor(seconds / 60)} min`;
  }

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Daily Goal Progress</h2>

      <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#0f172a",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>{percentage}%</div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            {formatMinutes(currentSeconds)} / {formatMinutes(goalSeconds)}
          </div>
        </div>
      </div>

      <p style={{ marginTop: "16px", color: "#475569" }}>
        Daily Goal: {formatMinutes(goalSeconds)}
      </p>
    </div>
  );
}
