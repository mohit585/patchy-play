import { useEffect, useRef, useState } from "react";

export default function SimpleGame({ isRunning }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const targetRef = useRef({ x: 50, y: 50, size: 40 });

  useEffect(() => {
    let animationId;
    let intervalId;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function moveTarget() {
      targetRef.current.x = Math.random() * (canvas.width - targetRef.current.size);
      targetRef.current.y = Math.random() * (canvas.height - targetRef.current.size);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isRunning) {
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(
          targetRef.current.x,
          targetRef.current.y,
          targetRef.current.size,
          targetRef.current.size
        );
      } else {
        ctx.fillStyle = "#999";
        ctx.font = "24px Arial";
        ctx.fillText("Game Paused", 170, 150);
      }

      animationId = requestAnimationFrame(draw);
    }

    if (isRunning) {
      intervalId = setInterval(moveTarget, 1000);
    }

    draw();

    return () => {
      if (intervalId) clearInterval(intervalId);
      cancelAnimationFrame(animationId);
    };
  }, [isRunning]);

  function handleClick(event) {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const { x, y, size } = targetRef.current;

    const hit =
      clickX >= x &&
      clickX <= x + size &&
      clickY >= y &&
      clickY <= y + size;

    if (hit) {
      setScore((prev) => prev + 1);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Score: {score}</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        onClick={handleClick}
        style={{ border: "2px solid #333", borderRadius: "12px", cursor: "pointer" }}
      />
    </div>
  );
}
