import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);

  
  const setAuthToken = (tokenValue) => {
    if (tokenValue) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
      localStorage.setItem('token', tokenValue);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };
 
  const normalizeUser = (userData) => {
    if (!userData) return null;
    const normalized = { ...userData };
    if (normalized.profile_image && !normalized.profileImage) {
      normalized.profileImage = normalized.profile_image;
     
    }
    return normalized;
  };

  
  useEffect(() => {
    const loadInitialData = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
        
          const res = await axios.get(`http://localhost:5000/api/profile`);
          
          setUser(normalizeUser(res.data.usuario)); 

          
          const resFavoritos = await axios.get(`http://localhost:5000/api/mis-favoritos`);
          setFavoritos(resFavoritos.data);

        } catch (error) {
          console.error("Error al cargar token o usuario de localStorage / cargar favoritos:", error);
          logout(); 
        }
      }
      setLoading(false); 
    };

    loadInitialData();
  }, []); 

  useEffect(() => {
    if (user) {
      
      localStorage.setItem('user', JSON.stringify(user)); 
      
      
      axios.get(`http://localhost:5000/api/mis-favoritos`)
        .then(res => {
          setFavoritos(res.data);
        })
        .catch(err => {
          console.error("Error al cargar favoritos desde backend (después de login):", err);
          if (err.response && err.response.status === 401) {
            logout(); 
          }
        });
    } else {
      localStorage.removeItem('user');
      setFavoritos([]);
    }
  }, [user]); 

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      const { token, usuario } = res.data;
      setAuthToken(token);
      setUser(normalizeUser(usuario)); 
      return true;
    } catch (error) {
      console.error("Error durante el login en AuthContext:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const register = async ({ name, email, phone, password }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/registro", {
        name, email, phone, password
      });
      const { token, usuario } = res.data;
      setAuthToken(token);
      setUser(normalizeUser(usuario));
      return usuario;
    } catch (error) {
      console.error("Error durante el registro en AuthContext:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error al registrar usuario");
    }
  };

  const logout = () => {
    setUser(null);
    setFavoritos([]);
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  const addFavorito = async (producto) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar favoritos.');
    }
    try {
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found.'); 
      
      await axios.post('http://localhost:5000/api/favoritos', { product_id: producto.id });
      setFavoritos((prev) => {
        
        if (prev.some((p) => p.id === producto.id)) return prev;
        return [...prev, producto];
      });
    } catch (err) {
      console.error("Error al añadir favorito:", err);
      throw new Error(err.response?.data?.error || 'No se pudo agregar favorito.');
    }
  };

  const removeFavorito = async (productoId) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para eliminar favoritos.');
    }
    try {
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found.');

      await axios.delete(`http://localhost:5000/api/favoritos/${productoId}`);
      setFavoritos((prev) => prev.filter((p) => p.id !== productoId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
      throw new Error(err.response?.data?.error || 'No se pudo eliminar favorito.');
    }
  };

  
  const updateUserProfile = (updatedUserData) => {
    setUser(normalizeUser(updatedUserData)); 
    
  };


  return (
    <AuthContext.Provider value={{
      user,
      loading,
      favoritos,
      addFavorito,
      removeFavorito,
      login,
      logout,
      register,
      updateUserProfile 
    }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}