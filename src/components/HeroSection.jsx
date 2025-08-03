import "/src/styles/HeroSection.css";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slidesData = [
  {
    image: '/assets/img/hogar.webp', 
    title: 'Todo para tu hogar',
    subtitle: 'interior exterior jardinería decoración',
    buttonText: 'Explorar',
    buttonLink: '/productos'
  },
  {
    image: '/assets/img/tecnologia.webp', 
    title: 'Tecnología de Vanguardia',
    subtitle: 'Innovación que simplifica tu día a día',
    buttonText: 'Ver Productos',
    buttonLink: '/productos'
  },
  {
    image: '/assets/img/moda.webp', 
    title: 'Lo último en Moda',
    subtitle: 'moda mujer niños hombre.',
    buttonText: 'Ver Colección',
    buttonLink: '/productos'
  },
  {
    image: '/assets/img/ofertas.webp', 
    title: 'Envío gratis',
    subtitle: 'En tu primera compra',
    buttonText: 'Comprar Ahora',
    buttonLink: '/productos'
  }
];

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Efecto para el cambio automático de diapositivas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
    }, 5000); // Cambia cada 5 segundos (5000 milisegundos)

    // Función de limpieza para detener el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

  // Función para ir a una diapositiva específica al hacer clic en un punto
  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  // Función para ir a la diapositiva anterior
  const goToPrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slidesData.length) % slidesData.length);
  };

  // Función para ir a la diapositiva siguiente
  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
  };

  return (
    <section className="hero-section">
      <div className="carousel-container">
        {slidesData.map((slide, index) => (
          <div
            key={index} // Usa el índice como key, aunque idealmente sería un ID único del slide si viniera de una DB
            className={`carousel-slide ${index === currentSlideIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <Link to={slide.buttonLink} className="hero-button">
                {slide.buttonText}
              </Link>
              
            </div>
          </div>
        ))}
      </div>

      {/* Puntos de navegación (indicadores de diapositiva) */}
      <div className="carousel-dots">
        {slidesData.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>

      {/* Flechas de navegación (opcionales) */}
      <button className="carousel-arrow left-arrow" onClick={goToPrevSlide}>&#10094;</button> {/* Flecha izquierda */}
      <button className="carousel-arrow right-arrow" onClick={goToNextSlide}>&#10095;</button> {/* Flecha derecha */}
    </section>
  );
};

export default HeroSection;