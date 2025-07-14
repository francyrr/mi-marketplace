import { Link } from 'react-router-dom';
import "/src/styles/DashboardMenu.css";

function DashboardMenu() {
  return (
    <div className="dashboard-menu">
      <Link to="/crear-publicacion">Vender producto</Link> |
      <Link to="/mis-favoritos">Mis favoritos</Link> |
      <Link to="/mis-publicaciones">Mis publicaciones</Link> |
      <Link to="/productos">Ver Productos</Link>
    </div>
  );
}

export default DashboardMenu;
