// src/pages/Login.jsx  
import { useEffect, useState, useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/authContext';
import { CircularProgress } from '@mui/material'; // Importar CircularProgress

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Agregado: estado de loading
  const { login } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Si está autenticado, redirige automáticamente
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Iniciar loading
    try {
      const response = await api.post('/login', { username, password });
      // Llamar a login del contexto, que guarda los datos en el localStorage
      login(response.data.token, response.data.username, response.data.rol);
      console.log('Login exitoso:', response.data);
    } catch (err) {
      setError(err.response.data.error);
    } finally {
      setLoading(false); // Finalizar loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md p-6 bg-white bg-opacity-50 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
        <div className="absolute inset-x-0 top-0 flex justify-center -mt-8">
          <FaUserCircle className="text-6xl text-gray-700 bg-white rounded-full" />
        </div>
        <h2 className="mt-8 mb-4 text-xl font-bold text-center">Iniciar Sesión</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="username">
              Usuario
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline transition-all duration-300"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border border-gray-700 rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline transition-all duration-300"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline transition-all duration-300"
              type="submit"
              disabled={loading} // Deshabilitar el botón durante el loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
