import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getBestSession,
  getLast7Sessions,
  getStreakCount,
  getTodayCompliance,
  getTotalTherapyTime,
} from "../utils/dashboardStorage";

function formatMinutes(seconds) {
  return `${Math.floor(seconds / 60)} min`;
}

export default function Dashboard() {
  const todayCompliance = getTodayCompliance();
  const totalTherapyTime = getTotalTherapyTime();
  const bestSession = getBestSession();
  const streakCount = getStreakCount();
  const chartData = getLast7Sessions();

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        background: "#ffffff",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Compliance Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div style={cardStyle}>
          <p style={labelStyle}>Today's Compliance</p>
          <h3 style={valueStyle}>{todayCompliance}%</h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Total Therapy Time</p>
          <h3 style={valueStyle}>{formatMinutes(totalTherapyTime)}</h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Best Session</p>
          <h3 style={valueStyle}>{formatMinutes(bestSession)}</h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Streak Count</p>
          <h3 style={valueStyle}>{streakCount} days</h3>
        </div>
      </div>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`${Math.floor(value / 60)} min`, "Duration"]} />
            <Bar dataKey="duration" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "16px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const labelStyle = {
  margin: 0,
  fontSize: "14px",
  color: "#475569",
};

const valueStyle = {
  margin: "10px 0 0",
  fontSize: "24px",
  color: "#0f172a",
};
