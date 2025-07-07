import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  console.log("PrivateRoute Debug - Usuario:", user, "Cargando:", loading);

  if (loading) return <p>Cargando...</p>; 

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
