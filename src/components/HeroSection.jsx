import "/src/HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="hero-content">
        <h1>Bienvenido a mi Marketplace</h1>
        <p>Compra y vende sin complicaciones</p>
      </div>
    </div>
  );
}

export default HeroSection;
