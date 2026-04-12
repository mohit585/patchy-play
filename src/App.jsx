import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import WebcamFeed from "./components/WebcamFeed";
import SimpleGame from "./components/SimpleGame";
import Dashboard from "./components/Dashboard";
import Badges from "./components/Badges";
import ComplianceRing from "./components/ComplianceRing";
import ParentPortal from "./pages/ParentPortal";

function HomePage() {
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
    <div className="app-shell">
      <div className="page-card">
        <div className="topbar">
          <h1 className="app-title">Amblyopia Therapy App</h1>
          <Link to="/parent" className="nav-link">
            Parent Portal
          </Link>
        </div>

        <div className={`status-banner ${patchDetected ? "status-on" : "status-off"}`}>
          <div className="status-emoji">{patchDetected ? "🎉😄🩹" : "😴🙈"}</div>
          <div>
            <h2 className="status-title">
              {patchDetected ? "Patch On! Let’s Play!" : "Patch Off. Game Paused"}
            </h2>
            <p className="status-text">
              {patchDetected
                ? "Awesome job wearing the patch. Keep going!"
                : "Wear the patch to continue your game and therapy session."}
            </p>
          </div>
        </div>

        <div className="timer-pill">Session Time: {sessionTime} sec</div>

        <div className="play-area">
          <WebcamFeed onPatchStatusChange={setPatchDetected} />
          <SimpleGame isRunning={patchDetected} />
        </div>

        <ComplianceRing currentSeconds={sessionTime} goalSeconds={1800} />
        <Dashboard />
        <Badges />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/parent" element={<ParentPortal />} />
    </Routes>
  );
}
