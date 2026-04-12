import { useEffect, useState } from "react";
import WebcamFeed from "./components/WebcamFeed";
import SimpleGame from "./components/SimpleGame";

export default function App() {
  const [patchDetected, setPatchDetected] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

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

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
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
    </div>
  );
}
