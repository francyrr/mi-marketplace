import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MisPublicaciones from './pages/MisPublicaciones';
import CrearProducto from './pages/CrearPublicacion.jsx';
import Productos from './pages/ProductosPage.jsx';
import ProductoDetalle from './pages/ProductoDetalle';
import Favoritos from './pages/Favoritos';
import EditarPublicacion from './pages/EditarPublicacion.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import "/src/App.css";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/productos" element={<Productos />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/mis-favoritos" element={<Favoritos />} />
              <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
              <Route path="/crear-publicacion" element={<CrearProducto />} />
              <Route path="/editar-publicacion/:id" element={<EditarPublicacion />} />
              
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;