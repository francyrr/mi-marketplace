import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProductoCard from '../components/ProductoCard.jsx'; 
import '/src/styles/Productos.css'; 

function MisPublicaciones() {
  const { user } = useContext(AuthContext);
  const [misProductos, setMisProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisPublicaciones = async () => {
      if (!user) return; 
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mis-publicaciones?usuario_id=${user.id}`
        );
        setMisProductos(response.data);
      } catch (error) {
        console.error("Error al cargar tus publicaciones:", error);
      }
      setLoading(false);
    };

    fetchMisPublicaciones();
  }, [user]);

  if (loading) {
    return (
      <div className="productos-page">
        <h1>Mis Publicaciones</h1>
        <p className="loading-message">Cargando tus publicaciones...</p>
      </div>
    );
  }

  return (
    <div className="productos-page"> 
      <h1>Mis Publicaciones</h1>
      <section className="section-productos">
        {misProductos.length > 0 ? (
          <div className="productos-grid"> 
            {misProductos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="no-items-message">
            Aún no has publicado ningún producto.
          </p>
        )}
      </section>
    </div>
  );
}

export default MisPublicaciones;
