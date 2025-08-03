import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardMenu from "../components/DashboardMenu";
import "/src/styles/Profile.css";
import "/src/styles/DashboardMenu.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // DEBE ser: https://backend-mi-marketplace.onrender.com

function Profile() {
  const { user, updateUserProfile, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");

      if (!isEditing) {
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    }
  }, [user, isEditing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!user) {
      setError("No hay usuario autenticado. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(
          "Token de autenticación no encontrado. Por favor, inicia sesión."
        );
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // API con variable de entorno (CORRECTO)
      const updateTextRes = await axios.put(
        `${API_URL}/api/editar-perfil`,
        {
          id: user.id,
          name,
          email,
          phone,
        },
        config
      );

      let updatedUser = updateTextRes.data.usuario;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profileImage", selectedFile);

        // ✅ CORREGIDO: Añadido '/api'
        const uploadRes = await axios.post(
          `${API_URL}/api/upload-profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        updatedUser = {
          ...updatedUser,
          profile_image: uploadRes.data.imagePath,
        };
      } else {
        // ✅ CORREGIDO: Usar consistentemente user.profile_image
        updatedUser = {
          ...updatedUser,
          profile_image: user.profile_image,
        };
      }

      updateUserProfile(updatedUser); // Actualiza el contexto de autenticación con el usuario modificado
      setSuccessMessage("¡Perfil actualizado exitosamente!");
      setIsEditing(false);
      setPreviewUrl(null); // Limpiar preview y selectedFile después de guardar
      setSelectedFile(null);
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError(
        err.response?.data?.mensaje ||
          "Hubo un error al actualizar el perfil. Inténtalo de nuevo."
      );
      if (err.response && err.response.status === 401) {
        logout(); // Cerrar sesión si el token no es válido
      }
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (previewUrl) return previewUrl; // Si hay una nueva imagen seleccionada para previsualizar

    // ✅ CORREGIDO: Concatenación directa de API_URL y user.profile_image
    // Asume que user.profile_image contiene la ruta como "/uploads/..." o "/assets/..."
    if (user?.profile_image) {
      return `${API_URL}${user.profile_image}`;
    }

    return "/assets/perfil.jpg"; // Imagen por defecto si no hay ninguna
  };

  if (loading && !user)
    return <div className="profile-container-perfil">Cargando perfil...</div>;
  if (!user && !loading)
    return (
      <div className="profile-container error-message">
        Inicia sesión para ver tu perfil.
      </div>
    );

  return (
    <div className="profile-container-perfil">
      <div className="dashboard-layout">
        <DashboardMenu />
      </div>
      <div className="profile-content-perfil">
        <h1>Bienvenido</h1>
        <div className="user-info">
          <img
            src={getProfileImageUrl()}
            alt="Foto de perfil"
            className="profile-avatar"
          />

          {isEditing ? (
            <>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <input
                className="input-section"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "block", margin: "1rem 0" }}
                disabled={loading}
              />

              {error && <p className="error-message">{error}</p>}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}

              <button
                className="upload-button-1"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? "Guardando..." : "💾 Guardar cambios"}
              </button>
              <button
                className="upload-button"
                style={{ backgroundColor: "#e74c3c" }}
                onClick={() => {
                  setIsEditing(false);
                  setName(user?.name || "");
                  setEmail(user?.email || "");
                  setPhone(user?.phone || "");
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setError("");
                  setSuccessMessage("");
                }}
                disabled={loading}
              >
                ❌ Cancelar
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Nombre:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {user?.phone || "No registrado"}
              </p>
              <button
                className="upload-button-editar"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar perfil
              </button>
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
