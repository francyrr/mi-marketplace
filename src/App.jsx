import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "/src/App.css";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CrearProducto from './pages/CrearPublicacion.jsx';
import Productos from './pages/ProductosPage.jsx';
import ProductoDetalle from './pages/ProductoDetalle'
import Favoritos from './pages/Favoritos';
import MisPublicaciones from './pages/MisPublicaciones';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute.jsx'
import {ProductProvider} from './context/ProductContext.jsx';
import {AuthProvider} from './context/AuthContext.jsx';


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <ProductProvider>
       <Navbar /> 
      <Routes>
  <Route path="/profile" element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  } />
  <Route path="/favoritos" element={
    <PrivateRoute>
      <Favoritos />
    </PrivateRoute>
  } />
  <Route path="/publicaciones" element={
    <PrivateRoute>
      <MisPublicaciones />
    </PrivateRoute>
  } />
  <Route path="/crear-publicacion" element={
    <PrivateRoute>
      <CrearProducto />
    </PrivateRoute>
  } />
  <Route path="/productos" element={
    <PrivateRoute>
      <Productos />
    </PrivateRoute>
  } />
  <Route path="/producto/:id" element={
    <PrivateRoute>
      <ProductoDetalle />
    </PrivateRoute>
  } />
  <Route path="/login" element={<Login />} />
  <Route path="/registro" element={<Register />} />
  <Route path="/" element={<Home />} />
</Routes>

       <Footer /> 
       </ProductProvider>
       </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
