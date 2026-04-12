import { useEffect, useRef } from "react";

export default function WebcamFeed() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  return <video ref={videoRef} autoPlay playsInline />;
}
