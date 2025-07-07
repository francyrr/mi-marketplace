import React from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/ProductoCard.css';

function ProductoCard({ producto }) {
  if (!producto) return null;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  return (
    <div className="producto-card" onClick={handleClick}>
      <img
        src={producto.imagen || '/default-placeholder.jpg'}
        alt={producto.nombre || 'Producto sin nombre'}
        className="producto-card-image"
      />
      <div className="producto-card-content">
        <h3 className="producto-card-title">{producto.nombre || 'Nombre no disponible'}</h3>
        <p className="producto-card-price">${producto.precio?.toFixed(2) || '0.00'}</p>
        <p className="producto-card-description">
          {(producto.descripcion && producto.descripcion.substring(0, 70) + '...') || 'Sin descripción disponible.'}
        </p>
        <div className="producto-card-meta">
          <span>⭐ {producto.calificacion ?? 'N/A'}</span>
          <span>📦 {producto.vendidos ?? 0} vendidos</span>
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;