import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "/src/styles/Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getProfileImageUrl = () => {
    if (user?.profileImage?.startsWith('/uploads')) {
      return `http://localhost:5000${user.profileImage}`;
    }
    return user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}`;
  };

  return (
    <nav className='navbar'>
      <div className='logo'>
        <Link to="/">
          <img src="/src/assets/logo.png" alt="Logo" />
        </Link>
      </div>

      <div className='links'>
        {!user ? (
          <div className='register-login'>
            <Link to="/registro">Registrarse</Link>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        ) : (
          <div className="profile-menu-container">
            <img 
              src={getProfileImageUrl()}
              alt="Foto perfil"
              onClick={toggleMenu}
              className="profile-image"
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Mi perfil</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
