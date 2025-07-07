import React, { createContext, useState, useEffect } from 'react';
import { productosDemo as initialProducts } from '../data/productos.js'; 

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  
  const [productos, setProductos] = useState(initialProducts);
  useEffect(() => {
    console.log("ProductProvider inicializado. Productos actuales:", productos);
  }, []);

  const addProduct = (newProduct) => {
    console.log("ProductContext: Recibido nuevo producto para agregar:", newProduct); // <<-- LOG 1

    setProductos((prevProducts) => {
      console.log("ProductContext: Estado de productos ANTES de la actualización:", prevProducts); // <<-- LOG 2

      const newId = prevProducts.length > 0
                    ? Math.max(...prevProducts.map(p => p.id)) + 1
                    : 1;

      const updatedProducts = [...prevProducts, { ...newProduct, id: newId }];

      console.log("ProductContext: Estado de productos DESPUÉS de la actualización:", updatedProducts); // <<-- LOG 3

      return updatedProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ productos, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};