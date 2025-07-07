import "/src/DashboardMenu.css";

function DashboardMenu() {

  return (
    <div className="dashboard-menu">
      <a href="/crear-publicacion">Vender producto</a> |
      <a href="/favoritos">Mis favoritos</a> |
      <a href="/publicaciones">Mis publicaciones</a> |
      <a href="/productos">Ver Productos</a> 
      
    </div>
  );
}

export default DashboardMenu;
