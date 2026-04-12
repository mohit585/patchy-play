import { useEffect, useState } from "react";
import { getBadgeList } from "../utils/badgeStorage";

export default function Badges() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    setBadges(getBadgeList());
  }, []);

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
      <h2 style={{ marginBottom: "20px" }}>Rewards & Badges</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: badge.unlocked ? "#22c55e" : "#cbd5e1",
              background: badge.unlocked ? "#f0fdf4" : "#f8fafc",
              color: "#0f172a",
            }}
          >
            <p style={{ fontSize: "28px", margin: "0 0 8px" }}>
              {badge.unlocked ? "Unlocked" : "Locked"}
            </p>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>{badge.title}</h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#475569" }}>
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
