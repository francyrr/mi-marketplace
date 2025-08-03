import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '/src/styles/CrearPublicacion.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Usar variable de entorno

function CrearPublicacion() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nombre':
        setNombre(value);
        break;
      case 'descripcion':
        setDescripcion(value);
        break;
      case 'precio':
        setPrecio(value);
        break;
      case 'categoria':
        setCategoria(value);
        break;
      case 'ubicacion':
        setUbicacion(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagen(null);
      setImagenPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para crear una publicación.');
      return;
    }

    if (!nombre || !descripcion || !precio || !categoria || !ubicacion || !imagen) {
      alert('Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    try {
      // ✅ Subir imagen al backend usando API_URL
      const formData = new FormData();
      formData.append('imagen', imagen);

      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const filename = uploadRes.data.filename;
      const imagePath = `/uploads/${filename}`;

      // ✅ Crear producto con datos y URL de imagen
      const newProductData = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        ubicacion,
        imagen: imagePath,
        vendedor_id: user.id
      };

      await axios.post(`${API_URL}/crear-publicacion`, newProductData);

      alert('Producto publicado con éxito!');
      navigate('/productos');
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert('Hubo un error al publicar tu producto.');
    }
  };

  return (
    <div className="create-publication-container">
      <h1 className="create-publication-title">Vender un Producto</h1>
      <form onSubmit={handleSubmit} className="publication-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={descripcion}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio ($):</label>
          <input
            type="number"
            min="1"
            id="precio"
            name="precio"
            value={precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            name="categoria"
            value={categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Libros">Libros</option>
            <option value="Hogar">Hogar</option>
            <option value="Moda">Moda</option>
            <option value="Deportes">Deportes</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación (Ciudad):</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={ubicacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Imagen del Producto:</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagenPreview && (
            <div className="image-preview-container">
              <img src={imagenPreview} alt="Vista previa" className="image-preview" />
              <p>Vista previa de la imagen</p>
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit-publication">
          Listo para Vender
        </button>
      </form>
    </div>
  );
}

export default CrearPublicacion;
