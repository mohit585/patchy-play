import { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

export default function WebcamFeed({ onPatchStatusChange }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const [patchDetected, setPatchDetected] = useState(false);

  useEffect(() => {
    let stream;

    async function startWebcam() {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let animationId;

    async function setupLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      detectFrame();
    }

    function detectFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && landmarkerRef.current && video.readyState >= 2) {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const result = landmarkerRef.current.detectForVideo(
          video,
          performance.now()
        );

        const landmarks = result.faceLandmarks?.[0];
        if (landmarks) {
          const leftEye = landmarks[159];
          const rightEye = landmarks[386];

          const leftBrightness = getBrightness(
            ctx,
            leftEye.x * canvas.width,
            leftEye.y * canvas.height
          );

          const rightBrightness = getBrightness(
            ctx,
            rightEye.x * canvas.width,
            rightEye.y * canvas.height
          );

          const diff = Math.abs(leftBrightness - rightBrightness);
          const detected = diff > 40;

          setPatchDetected(detected);

          if (onPatchStatusChange) {
            onPatchStatusChange(detected);
          }
        }
      }

      animationId = requestAnimationFrame(detectFrame);
    }

    function getBrightness(ctx, x, y) {
      const size = 20;
      const startX = Math.max(0, x - size / 2);
      const startY = Math.max(0, y - size / 2);
      const imageData = ctx.getImageData(startX, startY, size, size).data;

      let total = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        total += (r + g + b) / 3;
      }

      return total / (imageData.length / 4);
    }

    setupLandmarker();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onPatchStatusChange]);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "400px", borderRadius: "12px" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <h2>{patchDetected ? "Patch Detected" : "No Patch Detected"}</h2>
    </div>
  );
}
