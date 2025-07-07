import React, { useState, useEffect } from 'react';
import { productosDemo } from '../data/productos.js';
import ProductoCard from '../components/ProductoCard.jsx'; 
import '/src/Productos.css'; 

function MisPublicaciones() {
  const [misProductos, setMisProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisPublicaciones = () => {
      setLoading(true);
      const publicacionesDelVendedor = productosDemo.filter(
        (producto) => producto.esMiPublicacion === true
      );
      setMisProductos(publicacionesDelVendedor);
      setLoading(false);
    };

    fetchMisPublicaciones();
  }, []);

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