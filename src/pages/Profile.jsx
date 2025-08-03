import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardMenu from "../components/DashboardMenu";
import "/src/styles/Profile.css";
import "/src/styles/DashboardMenu.css";
import axios from "axios";

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

      const updateTextRes = await axios.put(
        "http://localhost:5000/api/editar-perfil",
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

        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload-profile",
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
        updatedUser = {
          ...updatedUser,
          profile_image: user.profileImage || user.profile_image,
        };
      }

      updateUserProfile(updatedUser);
      setSuccessMessage("¡Perfil actualizado exitosamente!");
      setIsEditing(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError(
        err.response?.data?.mensaje ||
          "Hubo un error al actualizar el perfil. Inténtalo de nuevo."
      );
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (previewUrl) return previewUrl;

    if (user?.profileImage?.startsWith("/uploads")) {
      return `http://localhost:5000${user.profileImage}`;
    }

    return "/public/assets/perfil.jpg";
  };

  if (loading && !user)
    return <div className="profile-container">Cargando perfil...</div>;
  if (!user && !loading)
    return (
      <div className="profile-container error-message">
        Inicia sesión para ver tu perfil.
      </div>
    );

  return (
    <div className="profile-container">
      <div className="dashboard-layout">
        <DashboardMenu />
      </div>
      <div className="profile-content">
        <h1>Bienvenido</h1>
        {/* Contenido principal de la página de perfil */}
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
