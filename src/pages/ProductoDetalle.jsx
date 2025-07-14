import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "/src/styles/ProductoDetalle.css";
import genericMapImage from "/assets/img/mapa.jpg";
import axios from "axios";

const DEFAULT_MAP_IMAGE = genericMapImage;

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/productos/${id}`);
        setProducto(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleWhatsAppClick = () => {
    if (producto && producto.telefono_vendedor) {
      const mensaje = encodeURIComponent(
        `¡Hola! Estoy interesado/a en tu producto: "${producto.nombre}". ¿Está disponible?`
      );
      const formattedPhone = producto.telefono_vendedor.startsWith("+")
        ? producto.telefono_vendedor
        : `+56${producto.telefono_vendedor}`;
      window.open(`https://wa.me/${formattedPhone}?text=${mensaje}`, "_blank");
    } else {
      alert("Número de contacto no disponible.");
    }
  };

  const handleEdit = () => {
    navigate(`/editar-publicacion/${producto.id}`);
  };

  const handleDelete = async () => {
    if (confirm("¿Seguro que deseas eliminar esta publicación?")) {
      try {
        await axios.delete(`http://localhost:5000/api/eliminar-publicacion/${producto.id}`);
        alert("Publicación eliminada.");
        navigate("/mis-publicaciones");
      } catch (err) {
        console.error("Error al eliminar publicación:", err);
        alert("Error al eliminar la publicación.");
      }
    }
  };

  const getGoogleMapsLink = (lat, lng, query) => {
    if (lat && lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (query) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }
    return "#";
  };

  if (loading)
    return <div className="product-detail-container loading-message">Cargando detalles del producto...</div>;
  if (error)
    return <div className="product-detail-container error-message">{error}</div>;
  if (!producto)
    return <div className="product-detail-container no-product-message">Producto no disponible.</div>;

  const mapLink = getGoogleMapsLink(
    producto.coordenadas?.lat,
    producto.coordenadas?.lng,
    producto.ubicacion
  );
  const imageUrl = producto.imagen?.startsWith("/uploads")
    ? `http://localhost:5000${producto.imagen}`
    : producto.imagen || "/default-placeholder.jpg";

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <img src={imageUrl} alt={producto.nombre} className="product-detail-image" />
        <div className="product-detail-info-main">
          <h1 className="product-detail-title">{producto.nombre}</h1>
          <p className="product-detail-price">${Number(producto.precio ?? 0).toFixed(2)}</p>
          <div className="product-detail-meta">
            <span>⭐ {producto.calificacion ?? "N/A"} ({producto.vendidos} vendidos)</span>
            <span>Vendedor ID: {producto.vendedor_id}</span>
            <span>Categoría: {producto.categoria}</span>
          </div>

          <div className="product-actions">
            {producto?.telefono_vendedor &&
              Number(user?.id) !== Number(producto.vendedor_id) && (
                <button className="btn-whatsapp" onClick={handleWhatsAppClick}>
                  Contactar al Vendedor por WhatsApp <i class="fa fa-whatsapp"></i>
                </button>
              )}
            {Number(user?.id) === Number(producto.vendedor_id) && (
              <div className="owner-actions">
                <button className="btn-edit" onClick={handleEdit}>Editar publicación</button>
                <button className="btn-delete" onClick={handleDelete}>Eliminar publicación</button>
              </div>
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
                href={mapLink}
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
