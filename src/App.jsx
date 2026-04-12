import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import WebcamFeed from "./components/WebcamFeed";
import SimpleGame from "./components/SimpleGame";
import Dashboard from "./components/Dashboard";
import Badges from "./components/Badges";
import ComplianceRing from "./components/ComplianceRing";
import Onboarding from "./components/Onboarding";
import StoryMode from "./components/StoryMode";
import IntroLanding from "./components/IntroLanding";
import ParentPortal from "./pages/ParentPortal";

function HomePage() {
  const savedProfile = JSON.parse(localStorage.getItem("childProfile") || "null");
  const introSeen = localStorage.getItem("introSeen") === "true";

  const [profile, setProfile] = useState(savedProfile);
  const [hasSeenIntro, setHasSeenIntro] = useState(introSeen);
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

  function handleIntroContinue() {
    localStorage.setItem("introSeen", "true");
    setHasSeenIntro(true);
  }

  if (!hasSeenIntro) {
    return <IntroLanding onContinue={handleIntroContinue} />;
  }

  if (!profile?.onboardingComplete) {
    return <Onboarding onComplete={setProfile} />;
  }

  return (
    <div className="app-shell">
      <div className="page-card">
        <div className="topbar">
          <h1 className="app-title">PatchyPlay</h1>
          <Link to="/parent" className="nav-link">
            Parent Portal
          </Link>
        </div>

        <div className={`status-banner ${patchDetected ? "status-on" : "status-off"}`}>
          <div className="status-emoji">{patchDetected ? "🎉😄🩹" : "😴🙈"}</div>
          <div>
            <h2 className="status-title">
              Hi {profile.name}! {patchDetected ? "Patch On! Let’s Play!" : "Patch Off. Game Paused"}
            </h2>
            <p className="status-text">
              Therapy eye: {profile.eye} | Daily goal: {Math.floor(profile.dailyGoal / 60)} min
            </p>
          </div>
        </div>

        <div className="timer-pill">Session Time: {sessionTime} sec</div>

        <StoryMode childName={profile.name} patchDetected={patchDetected} />

        <div className="play-area">
          <div className="play-panel">
            <WebcamFeed onPatchStatusChange={setPatchDetected} />
          </div>

          <div className="play-panel">
            <SimpleGame isRunning={patchDetected} />
          </div>
        </div>

        <ComplianceRing currentSeconds={sessionTime} goalSeconds={profile.dailyGoal} />
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
