import { Link } from "react-router-dom";
import { getSessions } from "../utils/dashboardStorage";

function formatMinutes(seconds) {
  return `${Math.floor(seconds / 60)} min`;
}

function getWeeklySummary() {
  const sessions = getSessions();
  const last7 = sessions.slice(-7);
  const total = last7.reduce((sum, session) => sum + session.duration, 0);
  const average = last7.length ? Math.round(total / last7.length) : 0;

  return {
    total,
    average,
    sessions: last7,
  };
}

function getTodayAlert(goalSeconds = 1800) {
  const today = new Date().toISOString().split("T")[0];
  const sessions = getSessions();
  const todaySession = sessions.find((session) => session.date === today);
  const todayDuration = todaySession ? todaySession.duration : 0;

  return {
    todayDuration,
    isBelowGoal: todayDuration < goalSeconds,
    goalSeconds,
  };
}

function exportSessionsAsCsv() {
  const sessions = getSessions();
  const rows = [
    ["Date", "Duration (sec)"],
    ...sessions.map((session) => [session.date, session.duration]),
  ];

  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "therapy-data.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export default function ParentPortal() {
  const weekly = getWeeklySummary();
  const alert = getTodayAlert();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Parent Portal</h1>
        <Link to="/" style={{ color: "#2563eb", textDecoration: "none" }}>
          Back to App
        </Link>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={cardStyle}>
          <p style={labelStyle}>Weekly Total</p>
          <h2 style={valueStyle}>{formatMinutes(weekly.total)}</h2>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Daily Average</p>
          <h2 style={valueStyle}>{formatMinutes(weekly.average)}</h2>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "18px",
          borderRadius: "14px",
          background: alert.isBelowGoal ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${alert.isBelowGoal ? "#fca5a5" : "#86efac"}`,
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {alert.isBelowGoal ? "Today's goal not met" : "Today's goal achieved"}
        </h3>
        <p style={{ marginBottom: 0 }}>
          Today: {formatMinutes(alert.todayDuration)} / Goal: {formatMinutes(alert.goalSeconds)}
        </p>
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          background: "#fff",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Last 7 Sessions</h3>

        <div style={{ display: "grid", gap: "10px" }}>
          {weekly.sessions.map((session) => (
            <div
              key={session.date}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#f8fafc",
              }}
            >
              <span>{session.date}</span>
              <span>{formatMinutes(session.duration)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={exportSessionsAsCsv}
          style={{
            marginTop: "20px",
            padding: "12px 18px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Export Data as CSV
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  background: "#ffffff",
};

const labelStyle = {
  margin: 0,
  fontSize: "14px",
  color: "#64748b",
};

const valueStyle = {
  margin: "10px 0 0",
  fontSize: "28px",
  color: "#0f172a",
};
