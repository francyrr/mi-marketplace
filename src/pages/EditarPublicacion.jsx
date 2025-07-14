import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "/src/styles/EditarPublicacion.css";
import { AuthContext } from "../context/AuthContext";

function EditarPublicacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No autenticado. Por favor, inicia sesión.");
          setLoading(false);
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        };
    
        const response = await axios.get(`http://localhost:5000/api/productos/${id}`, config);

        setProducto({
          ...response.data,
          precio: Number(response.data.precio),
          lat: response.data.lat ? Number(response.data.lat) : '', 
          lng: response.data.lng ? Number(response.data.lng) : '',
        });

        if (user && Number(user.id) !== Number(response.data.vendedor_id)) {
          setError("No tienes permiso para editar esta publicación.");
          setProducto(null); 
          setLoading(false);
          
          return;
        }

      } catch (err) {
        console.error("Error al cargar producto para edición:", err);
        if (err.response && err.response.status === 403) {
          setError("No tienes permiso para editar esta publicación.");
        } else if (err.response && err.response.status === 401) {
          setError("Sesión expirada o no válida. Por favor, inicia sesión.");
          navigate('/login');
        }
        else {
          setError("Error al cargar el producto para edición.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) { 
      fetchProducto();
    } else {
      setLoading(false);
      setError("Necesitas iniciar sesión para editar publicaciones.");
      navigate('/login');
    }

  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: (name === 'precio' || name === 'lat' || name === 'lng') && value !== '' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito('');
    setMensajeError('');

    if (!producto.nombre || !producto.descripcion || !producto.precio) {
      setMensajeError('Por favor, completa los campos obligatorios: Nombre, Descripción, Precio.');
      return;
    }
    if (isNaN(producto.precio) || producto.precio <= 0) {
        setMensajeError('El precio debe ser un número positivo.');
        return;
    }
    if ((producto.lat && isNaN(producto.lat)) || (producto.lng && isNaN(producto.lng))) {
        setMensajeError('Las coordenadas de latitud y longitud deben ser números válidos.');
        return;
    }


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMensajeError("No autenticado. Por favor, inicia sesión.");
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://localhost:5000/api/actualizar-publicacion/${id}`, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        ubicacion: producto.ubicacion,
        imagen: producto.imagen,
        lat: producto.lat || null, 
        lng: producto.lng || null, 
      }, config);

      setMensajeExito("Publicación actualizada con éxito. Redirigiendo...");
      setTimeout(() => {
        navigate(`/producto/${id}`); 
      }, 1500); 
    } catch (err) {
      console.error("Error al actualizar publicación:", err);
      setMensajeError(`No se pudo actualizar: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) return <div className="edit-publication-container loading-message">Cargando producto para editar...</div>;
  if (error) return <div className="edit-publication-container error-message">{error}</div>;
  if (!producto) return <div className="edit-publication-container no-product-message">Producto no disponible o no tienes permiso para editarlo.</div>;

  return (
    <div className="edit-publication-container">
      <h1>Editar Publicación: {producto.nombre}</h1>
      <form onSubmit={handleSubmit} className="edit-publication-form">
        <label htmlFor="nombre">Nombre del Producto:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={producto.nombre || ''}
          onChange={handleChange}
          placeholder="Nombre del producto"
          required
        />

        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={producto.descripcion || ''}
          onChange={handleChange}
          placeholder="Descripción"
          required
        />

        <label htmlFor="precio">Precio ($):</label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={producto.precio || ''}
          onChange={handleChange}
          placeholder="Precio"
          required
          min="0" 
          step="0.01" 
        />

        <label htmlFor="categoria">Categoría:</label>
        <input
          type="text"
          id="categoria"
          name="categoria"
          value={producto.categoria || ''}
          onChange={handleChange}
          placeholder="Categoría (ej: Electrónica, Ropa)"
        />

        <label htmlFor="ubicacion">Ubicación:</label>
        <input
          type="text"
          id="ubicacion"
          name="ubicacion"
          value={producto.ubicacion || ''}
          onChange={handleChange}
          placeholder="Ubicación (ej: Santiago Centro)"
        />

        {mensajeError && <p className="error-message">{mensajeError}</p>}
        {mensajeExito && <p className="success-message">{mensajeExito}</p>}

        <button type="submit" className="submit-button">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditarPublicacion;