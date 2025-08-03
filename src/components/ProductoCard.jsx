import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/ProductoCard.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Usar variable de entorno para API

function ProductoCard({ producto }) {
  const navigate = useNavigate();
  const { user, favoritos, addFavorito, removeFavorito } = useContext(AuthContext);

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  const toggleFavorito = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Debes iniciar sesión para usar favoritos");
      return;
    }

    try {
      if (favoritos.some(fav => fav.id === producto.id)) {
        // ✅ DELETE usando API_URL
        await axios.delete(`${API_URL}/favoritos/${producto.id}`, {
          data: { user_id: user.id }
        });
        removeFavorito(producto.id);
      } else {
        // ✅ POST usando API_URL
        await axios.post(`${API_URL}/favoritos`, {
          user_id: user.id,
          product_id: producto.id
        });
        addFavorito(producto);
      }
    } catch (err) {
      console.error("Error actualizando favorito:", err);
      alert("Ocurrió un error actualizando tu lista de favoritos");
    }
  };

  // ✅ Construcción dinámica de la URL de la imagen
  const imageUrl = producto.imagen?.startsWith('/uploads')
    ? `${API_URL.replace('/api', '')}${producto.imagen}`
    : producto.imagen || '/assets/default-placeholder.jpg'; // ✅ Imagen por defecto en /public/assets

  const isFavorito = favoritos.some(fav => fav.id === producto.id);

  return (
    <div className="producto-card" onClick={handleClick}>
      <img src={imageUrl} alt={producto.nombre} className="producto-card-image" />
      <div className="producto-card-content">
        <h3 className="producto-card-title">{producto.nombre}</h3>
        <p className="producto-card-price">${Number(producto.precio ?? 0).toFixed(2)}</p>
        <p className="producto-card-description">
          {(producto.descripcion && producto.descripcion.substring(0, 70) + '...') || 'Sin descripción disponible.'}
        </p>
        <div className="producto-card-meta">
          <span>⭐ {producto.calificacion ?? 'N/A'}</span>
          <span>📦 {producto.vendidos ?? 0} vendidos</span>
        </div>
        <button
          className="favorito-button"
          onClick={toggleFavorito}
          title={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          style={{
            marginTop: '10px',
            fontSize: '1.3em',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isFavorito ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}

export default ProductoCard;
