import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
console.log("API_URL:", import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL; // ✅ URL del backend desde variable de entorno

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

  // ✅ Cargar datos iniciales (usuario + favoritos)
  useEffect(() => {
    const loadInitialData = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const res = await axios.get(`${API_URL}/profile`);
          setUser(normalizeUser(res.data.usuario));

          const resFavoritos = await axios.get(`${API_URL}/mis-favoritos`);
          setFavoritos(resFavoritos.data);
        } catch (error) {
          console.error("Error al cargar usuario o favoritos:", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadInitialData();
  }, []);

  // ✅ Sincronizar favoritos al cambiar el usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      axios
        .get(`${API_URL}/mis-favoritos`)
        .then((res) => {
          setFavoritos(res.data);
        })
        .catch((err) => {
          console.error("Error al cargar favoritos tras login:", err);
          if (err.response && err.response.status === 401) {
            logout();
          }
        });
    } else {
      localStorage.removeItem('user');
      setFavoritos([]);
    }
  }, [user]);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, usuario } = res.data;
      setAuthToken(token);
      setUser(normalizeUser(usuario));
      return true;
    } catch (error) {
      console.error("Error durante el login:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  // ✅ Registro
  const register = async ({ name, email, phone, password }) => {
    try {
      const res = await axios.post(`${API_URL}/registro`, { name, email, phone, password });
      const { token, usuario } = res.data;
      setAuthToken(token);
      setUser(normalizeUser(usuario));
      return usuario;
    } catch (error) {
      console.error("Error durante el registro:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error al registrar usuario");
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setFavoritos([]);
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  // ✅ Añadir favorito
  const addFavorito = async (producto) => {
    if (!user) throw new Error('Debes iniciar sesión para agregar favoritos.');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found.');
      await axios.post(`${API_URL}/favoritos`, { product_id: producto.id });
      setFavoritos((prev) => (prev.some((p) => p.id === producto.id) ? prev : [...prev, producto]));
    } catch (err) {
      console.error("Error al añadir favorito:", err);
      throw new Error(err.response?.data?.error || 'No se pudo agregar favorito.');
    }
  };

  // ✅ Eliminar favorito
  const removeFavorito = async (productoId) => {
    if (!user) throw new Error('Debes iniciar sesión para eliminar favoritos.');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found.');
      await axios.delete(`${API_URL}/favoritos/${productoId}`);
      setFavoritos((prev) => prev.filter((p) => p.id !== productoId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
      throw new Error(err.response?.data?.error || 'No se pudo eliminar favorito.');
    }
  };

  // ✅ Actualizar perfil en contexto
  const updateUserProfile = (updatedUserData) => {
    setUser(normalizeUser(updatedUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favoritos,
        addFavorito,
        removeFavorito,
        login,
        logout,
        register,
        updateUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
