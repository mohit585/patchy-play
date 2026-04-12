import { useEffect, useState } from "react";
import WebcamFeed from "./components/WebcamFeed";
import SimpleGame from "./components/SimpleGame";
import Dashboard from "./components/Dashboard";
import Badges from "./components/Badges";
import ComplianceRing from "./components/ComplianceRing";

export default function App() {
  const [patchDetected, setPatchDetected] = useState(false);
  const [sessionTime, setSessionTime] = useState(() => {
    const savedTime = localStorage.getItem("sessionTime");
    return savedTime ? Number(savedTime) : 0;
  });

  useEffect(() => {
    let intervalId;

    if (patchDetected) {
      intervalId = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [patchDetected]);

  useEffect(() => {
    localStorage.setItem("sessionTime", sessionTime);
  }, [sessionTime]);

  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Amblyopia Therapy App</h1>
      <p>{patchDetected ? "Patch on: Game running" : "Patch off: Game paused"}</p>
      <h2>Session Time: {sessionTime} sec</h2>

      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <WebcamFeed onPatchStatusChange={setPatchDetected} />
        <SimpleGame isRunning={patchDetected} />
      </div>

      <ComplianceRing currentSeconds={sessionTime} goalSeconds={1800} />
      <Dashboard />
      <Badges />
    </div>
  );
}
