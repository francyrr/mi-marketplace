import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const storedRegisteredUsers = localStorage.getItem('registeredUsers');
    if (storedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(storedRegisteredUsers));
    }

    setLoading(false);
  }, []);
  const register = (userData) => {
    const newUserId = registeredUsers.length > 0 ? Math.max(...registeredUsers.map(u => u.id)) + 1 : 1;
    const newUser = { ...userData, id: newUserId };

    if (registeredUsers.some(u => u.email === newUser.email)) {
      throw new Error('El email ya está registrado.');
    }

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers)); // Guardar en localStorage
    console.log("Usuario registrado y guardado:", newUser);
    return newUser;
  };

  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      console.log("Usuario logueado:", foundUser);
      return foundUser;
    } else {
      throw new Error('Credenciales incorrectas.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
    console.log("Sesión cerrada y datos eliminados de localStorage.");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}