import { useEffect, useRef, useState } from "react";

function createBubble(canvas, speedBoost = 0) {
  const radius = 18 + Math.random() * 22;

  return {
    x: radius + Math.random() * (canvas.width - radius * 2),
    y: canvas.height + radius + Math.random() * 120,
    radius,
    speed: 0.8 + Math.random() * 1.2 + speedBoost,
    color: `hsl(${180 + Math.random() * 120}, 80%, 60%)`,
  };
}

export default function SimpleGame({ isRunning }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const bubblesRef = useRef([]);
  const spawnTimerRef = useRef(0);
  const startTimeRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    if (bubblesRef.current.length === 0) {
      bubblesRef.current = Array.from({ length: 5 }, () => createBubble(canvas));
    }

    function drawBubble(bubble) {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        bubble.x - bubble.radius / 3,
        bubble.y - bubble.radius / 3,
        bubble.radius / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fill();
    }

    function draw(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#eff6ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const elapsedSeconds = (timestamp - startTimeRef.current) / 1000;
      const speedBoost = Math.min(elapsedSeconds / 20, 3);

      if (isRunning) {
        spawnTimerRef.current += 1;

        if (spawnTimerRef.current > Math.max(50 - elapsedSeconds, 18)) {
          bubblesRef.current.push(createBubble(canvas, speedBoost * 0.35));
          spawnTimerRef.current = 0;
        }

        bubblesRef.current = bubblesRef.current
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed - speedBoost * 0.03,
          }))
          .filter((bubble) => bubble.y + bubble.radius > 0);
      }

      if (bubblesRef.current.length < 4) {
        bubblesRef.current.push(createBubble(canvas, speedBoost * 0.35));
      }

      bubblesRef.current.forEach(drawBubble);

      if (!isRunning) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Paused", canvas.width / 2, canvas.height / 2);
        ctx.font = "18px Arial";
        ctx.fillText("Wear the patch to play", canvas.width / 2, canvas.height / 2 + 32);
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  function handleClick(event) {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const hitIndex = bubblesRef.current.findIndex((bubble) => {
      const dx = clickX - bubble.x;
      const dy = clickY - bubble.y;
      return Math.sqrt(dx * dx + dy * dy) <= bubble.radius;
    });

    if (hitIndex !== -1) {
      bubblesRef.current.splice(hitIndex, 1);
      setScore((prev) => prev + 1);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Score: {score}</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={320}
        onClick={handleClick}
        style={{
          border: "2px solid #334155",
          borderRadius: "16px",
          cursor: isRunning ? "pointer" : "not-allowed",
          background: "#eff6ff",
        }}
      />
    </div>
  );
}
