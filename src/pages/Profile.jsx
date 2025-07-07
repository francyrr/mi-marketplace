import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardMenu from '../components/DashboardMenu';
import "/src/Profile.css";

function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile">
      <h2>Mi perfil</h2>
      
      <div className="user-info">
        <img 
          src="./src/assets/perfil.jpg" 
          alt="Foto de perfil" 
          className="profile-avatar"
        />
        <p><strong>Nombre:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Teléfono:</strong> {user?.phone}</p>
        
        <button className="upload-button">
          📷 Subir foto de perfil
        </button>
      </div>

      <DashboardMenu />
    </div>
  );
}

export default Profile;
