import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/src/styles/Productos.css';
import ProductoCard from "../components/ProductoCard.jsx";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const API_URL = import.meta.env.VITE_API_URL; // ✅ URL base desde variable de entorno

function ProductosPage() {
  const { user, favoritos, addFavorito, removeFavorito } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProductos = async () => {
    setLoading(true);
    setError('');
    try {
      // ✅ Petición usando API_URL
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
      console.log("Productos desde backend:", res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError('Hubo un error al cargar los productos. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter(producto =>
    (producto.nombre && producto.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    (producto.descripcion && producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
    (producto.categoria && producto.categoria.toLowerCase().includes(busqueda.toLowerCase())) ||
    (producto.ubicacion && producto.ubicacion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const productosMasVendidos = [...productos]
    .sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))
    .slice(0, 4);

  const productosMejorCalificados = [...productos]
    .sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0))
    .slice(0, 4);

  const handleVerTodosClick = () => {
    setMostrarTodos(true);
    setBusqueda(''); 
  };

  if (loading) {
    return <div className="loading-message">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="productos-page">
      <h1>Explora Nuestros Productos</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Buscar productos por nombre, descripción, categoría o ubicación..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarTodos(true);
          }}
          className="search-input"
        />
      </div>

      {!mostrarTodos && busqueda === '' && (
        <>
          <section className="section-productos">
            <h2>Los Más Vendidos</h2>
            {productosMasVendidos.length > 0 ? (
              <div className="productos-grid">
                {productosMasVendidos.map(producto => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    isFavorito={user && favoritos.some(fav => fav.id === producto.id)}
                    onToggleFavorito={user ? (() => {
                        if (favoritos.some(fav => fav.id === producto.id)) {
                            removeFavorito(producto.id);
                        } else {
                            addFavorito(producto);
                        }
                    }) : null}
                  />
                ))}
              </div>
            ) : (
              <p>No hay productos destacados en esta categoría.</p>
            )}
          </section>

          <section className="section-productos">
            <h2>Mejor Calificados</h2>
            {productosMejorCalificados.length > 0 ? (
              <div className="productos-grid">
                {productosMejorCalificados.map(producto => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    isFavorito={user && favoritos.some(fav => fav.id === producto.id)}
                    onToggleFavorito={user ? (() => {
                        if (favoritos.some(fav => fav.id === producto.id)) {
                            removeFavorito(producto.id);
                        } else {
                            addFavorito(producto);
                        }
                    }) : null}
                  />
                ))}
              </div>
            ) : (
              <p>No hay productos destacados en esta categoría.</p>
            )}
          </section>

          <div className="ver-todos-container">
            <button className="btn-primary" onClick={handleVerTodosClick}>
              Ver Todos los Productos
            </button>
          </div>
        </>
      )}

      {(mostrarTodos || busqueda !== '') && (
        <section className="section-productos">
          <h2>
            {busqueda !== '' ? `Resultados para "${busqueda}"` : 'Todos los Productos'}
          </h2>
          <div className="productos-grid">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map(producto => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  isFavorito={user && favoritos.some(fav => fav.id === producto.id)}
                  onToggleFavorito={user ? (() => {
                      if (favoritos.some(fav => fav.id === producto.id)) {
                          removeFavorito(producto.id);
                      } else {
                          addFavorito(producto);
                      }
                  }) : null}
                />
              ))
            ) : (
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductosPage;
