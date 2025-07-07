import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '/src/ProductoDetalle.css';
import { productosDemo } from '../data/productos.js';
import genericMapImage from '../assets/img/mapa.jpg'; 

const DEFAULT_MAP_IMAGE = genericMapImage;

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const productId = parseInt(id);
      const foundProduct = productosDemo.find(p => p.id === productId);

      if (foundProduct) {
        setProducto(foundProduct);
      } else {
        setError('Producto no encontrado.');
      }
    } catch (err) {
      setError('Error al cargar el producto.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleWhatsAppClick = () => {
    if (producto && producto.telefonoVendedor) {
      const mensaje = encodeURIComponent(`¡Hola! Estoy interesado/a en tu producto: "${producto.nombre}" (ID: ${producto.id}). ¿Está disponible?`);
      const formattedPhoneNumber = producto.telefonoVendedor.startsWith('+')
                                     ? producto.telefonoVendedor
                                     : `+56${producto.telefonoVendedor}`;
      const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${mensaje}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Número de contacto del vendedor no disponible.');
    }
  };

  const getGoogleMapsFullLink = (lat, lng, query) => {
    if (lat && lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`; 
    } else if (query) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`; 
    }
    return '#';
  };

  if (loading) {
    return <div className="product-detail-container loading-message">Cargando detalles del producto...</div>;
  }

  if (error) {
    return <div className="product-detail-container error-message">{error}</div>;
  }

  if (!producto) {
    return <div className="product-detail-container no-product-message">Producto no disponible.</div>;
  }

  const mapFullLink = getGoogleMapsFullLink(
    producto.coordenadas?.lat,
    producto.coordenadas?.lng,
    producto.ubicacion
  );

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <img src={producto.imagen} alt={producto.nombre} className="product-detail-image" />
        <div className="product-detail-info-main">
          <h1 className="product-detail-title">{producto.nombre}</h1>
          <p className="product-detail-price">${producto.precio.toFixed(2)}</p>
          <div className="product-detail-meta">
            <span>⭐ {producto.calificacion} ({producto.vendidos} vendidos)</span>
            <span>Vendedor: {producto.vendedor}</span>
            <span>Categoría: {producto.categoria}</span>
          </div>
          <div className="product-actions">
            {producto.telefonoVendedor && (
                <button className="btn-whatsapp" onClick={handleWhatsAppClick}>
                    Contactar al Vendedor por WhatsApp
                    <i className="fa fa-whatsapp"></i>
                </button>
            )}
          </div>
        </div>
      </div>
      <div className="product-detail-sections-wrapper">
        <div className="product-detail-description-section">
          <h2 className="section-title">Descripción</h2>
          <p className="product-description-text">{producto.descripcion}</p>
        </div>

        <div className="product-detail-location-section">
          <h2 className="section-title">Ubicación</h2>
          {producto.ubicacion ? (
            <p className="product-location-text">
              {producto.ubicacion}
              <a
                href={mapFullLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-preview"
              >
                <img
                  src={DEFAULT_MAP_IMAGE}
                  alt={`Ubicación de ${producto.nombre}`}
                  className="map-preview-image"
                />
                <p className="map-click-text">Haz clic para ver en Google Maps</p>
              </a>
            </p>
          ) : (
            <p className="product-location-text">Ubicación no disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;