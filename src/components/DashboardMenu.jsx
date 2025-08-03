import { Link } from 'react-router-dom';
import "/src/styles/DashboardMenu.css";
import { FaPlusCircle, FaHeart, FaClipboardList, FaBoxOpen } from 'react-icons/fa';

function DashboardMenu() {
  return (
    <nav className="dashboard-menu">
      <div className="menu-header">
        <h3>Mi Perfil</h3> 
      </div>
      <ul className="menu-list">
        <li>
          <Link to="/crear-publicacion" className="menu-item">
            <FaPlusCircle className="menu-icon" /> {/* Icono para "Vender producto" */}
            Vender Producto
          </Link>
        </li>
        <li>
          <Link to="/mis-favoritos" className="menu-item">
            <FaHeart className="menu-icon" /> {/* Icono para "Mis favoritos" */}
            Mis Favoritos
          </Link>
        </li>
        <li>
          <Link to="/mis-publicaciones" className="menu-item">
            <FaBoxOpen className="menu-icon" /> {/* Icono para "Mis publicaciones" */}
            Mis Publicaciones
          </Link>
        </li>
        <li>
          <Link to="/productos" className="menu-item">
            <FaClipboardList className="menu-icon" /> {/* Icono para "Ver Productos" */}
            Ver Productos
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default DashboardMenu;