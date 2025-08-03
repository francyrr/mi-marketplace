import React from "react";
import "/src/styles/Footer.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-div">
      <div className="social-icons">
        {/* Enlace a Facebook */}
        <a
          href="https://www.facebook.com/tuperfil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="social-icon" size={30} />
        </a>

        {/* Enlace a Instagram */}
        <a
          href="https://www.instagram.com/tuperfil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="social-icon" size={30} />
        </a>

       
      </div>
       <p className="footer">
          © 2025 - Mi Marketplace - Todos los derechos reservados
        </p>
    </div>
  );
};

export default Footer;
