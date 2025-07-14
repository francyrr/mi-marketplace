import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProductoCard from '../components/ProductoCard';
import '/src/styles/Productos.css';
import { AuthContext } from '../context/AuthContext';


function MisFavoritos() {
  const { user } = useContext(AuthContext);
  const [misFavoritos, setMisFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMisFavoritos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/mis-favoritos', {
          params: { user_id: user.id }
        });
        setMisFavoritos(response.data);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
      }
      setLoading(false);
    };

    fetchMisFavoritos();
  }, [user]);

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
            {misFavoritos.map(producto => (
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
