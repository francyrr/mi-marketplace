import React, { useState, useEffect, useContext } from 'react';
import '/src/Productos.css';
import ProductoCard from "../components/ProductoCard.jsx";
import { ProductContext } from '../context/ProductContext.jsx';


function ProductosPage() { 
  const { productos } = useContext(ProductContext); 

  const [busqueda, setBusqueda] = useState('');
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const productosMasVendidos = [...productos]
    .sort((a, b) => b.vendidos - a.vendidos)
    .slice(0, 4);

  const productosMejorCalificados = [...productos]
    .sort((a, b) => b.calificacion - a.calificacion)
    .slice(0, 4);

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVerTodosClick = () => {
    setMostrarTodos(true);
    console.log("ProductosPage: Componente renderizado. Productos recibidos del contexto:", productos);
  };

  return (
    <div className="productos-page">
      <h1>Explora Nuestros Productos</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
                    <ProductoCard key={producto.id} producto={producto} />
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
                    <ProductoCard key={producto.id} producto={producto} />
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
                <ProductoCard key={producto.id} producto={producto} />
              ))
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductosPage; 