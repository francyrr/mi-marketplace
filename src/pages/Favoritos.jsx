import React, { useState, useEffect } from 'react';
import { productosDemo } from '../data/productos.js';
import ProductoCard from '../components/ProductoCard.jsx';
import '/src/Productos.css';

function MisFavoritos() {
  const [misFavoritos, setMisFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisFavoritos = () => {
      setLoading(true);
      const favoritosDelUsuario = productosDemo.filter(
        (producto) => producto.esFavorito === true
      );
      setMisFavoritos(favoritosDelUsuario);
      setLoading(false);
    };

    fetchMisFavoritos();
  }, []);

  if (loading) {
    return (
      <div className="productos-page">
        <h1>Mis Productos Favoritos</h1>
        <p className="loading-message">Cargando tus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="productos-page">
      <h1>Mis Productos Favoritos</h1>
      <section className="section-productos">
        {misFavoritos.length > 0 ? (
          <div className="productos-grid"> 
            {misFavoritos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="no-items-message">
            Aún no has añadido ningún producto a tus favoritos.
          </p>
        )}
      </section>
    </div>
  );
}

export default MisFavoritos;