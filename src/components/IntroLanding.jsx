export default function IntroLanding({ onContinue }) {
  return (
    <div className="intro-shell">
      <div className="intro-card">
        <p className="intro-kicker">See the difference in 30 seconds</p>
        <h1 className="intro-title">Why patch therapy matters</h1>
        <p className="intro-subtitle">
          A weak eye can make the world feel blurry and harder to enjoy. With
          treatment and consistent practice, vision can become clearer.
        </p>

        <div className="vision-compare">
          <div className="vision-panel">
            <div className="vision-label weak">Weak Eye</div>
            <div className="vision-scene weak-eye">
              <div className="scene-sun" />
              <div className="scene-cloud cloud-one" />
              <div className="scene-cloud cloud-two" />
              <div className="scene-house" />
              <div className="scene-tree" />
              <div className="scene-ground" />
            </div>
            <p className="vision-text">
              Blurry details, dull colors, and trouble focusing can make daily
              activities frustrating.
            </p>
          </div>

          <div className="vision-panel">
            <div className="vision-label treated">Treated Eye</div>
            <div className="vision-scene treated-eye">
              <div className="scene-sun" />
              <div className="scene-cloud cloud-one" />
              <div className="scene-cloud cloud-two" />
              <div className="scene-house" />
              <div className="scene-tree" />
              <div className="scene-ground" />
            </div>
            <p className="vision-text">
              With treatment, the world can feel sharper, brighter, and easier
              to explore.
            </p>
          </div>
        </div>

        <div className="intro-note">
          Small daily therapy sessions can protect vision for life.
        </div>

        <button className="intro-button" onClick={onContinue}>
          Start Therapy Journey
        </button>
      </div>
    </div>
  );
}
