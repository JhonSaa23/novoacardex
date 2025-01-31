// src/components/AuthProvider.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../services/api";
import { AuthContext } from "../contexts/authContext"; // Importa el contexto desde el archivo separado

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [user, setUser] = useState({
    username: localStorage.getItem("username"),
    rol: localStorage.getItem("rol"),
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si hay token, obtener los datos del usuario
      const checkAuth = async () => {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data); // Guarda el usuario desde la API
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      checkAuth();
    } else {
      setIsAuthenticated(false); // Si no hay token, desautenticar
    }
  }, []);

  const login = (token, username, rol) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("rol", rol);
    setUser({ username, rol });
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    setUser({ username: '', rol: '' });
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;