import { useEffect, useState } from "react";
import { getStoryMission } from "../utils/storyService";

export default function StoryMode({ childName, patchDetected }) {
  const [story, setStory] = useState("Loading your mission...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStory() {
      setLoading(true);
      const result = await getStoryMission(childName || "Hero");
      if (active) {
        setStory(result);
        setLoading(false);
      }
    }

    loadStory();

    return () => {
      active = false;
    };
  }, [childName]);

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "20px",
        background: patchDetected ? "#dcfce7" : "#ede9fe",
        border: "3px solid #c4b5fd",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Story Mission</h2>
      <p style={{ margin: 0, fontSize: "18px", color: "#334155" }}>
        {loading ? "Getting your adventure ready..." : story}
      </p>
      <p style={{ marginTop: "12px", fontWeight: "700", color: "#7c3aed" }}>
        {patchDetected ? "Patch detected. Mission unlocked!" : "Wear the patch to begin the mission."}
      </p>
    </div>
  );
}
