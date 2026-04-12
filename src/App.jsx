import WebcamFeed from "./components/WebcamFeed";
import SimpleGame from "./components/SimpleGame";

export default function App() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Amblyopia Therapy App</h1>
      <p>Step 6: Webcam patch check and simple game</p>

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
        <WebcamFeed />
        <SimpleGame />
      </div>
    </div>
  );
}
