const fallbackStories = [
  "Captain Patch needs your help. Wear your patch and pop bubbles to rescue the sky castle!",
  "Mission Bubble Hero: keep your patch on and earn points to power up your rainbow ship!",
  "The friendly eye wizard needs a brave helper. Wear your patch and pop bubbles to unlock treasure!",
];

function getFallbackStory(name = "Hero") {
  const randomIndex = Math.floor(Math.random() * fallbackStories.length);
  return `${name}, ${fallbackStories[randomIndex]}`;
}

export async function getStoryMission(name = "Hero") {
  const endpoint = import.meta.env.VITE_GROK_PROXY_URL || "/api/grok-story";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Write one short, fun mission for a child doing eye-patch therapy. Keep it under 35 words. Make it cheerful and game-like. Child name: ${name}.`,
      }),
    });

    if (!response.ok) {
      throw new Error("Story request failed");
    }

    const data = await response.json();
    return data.story || getFallbackStory(name);
  } catch {
    return getFallbackStory(name);
  }
}
