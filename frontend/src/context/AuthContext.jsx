import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

console.log('SCRIPT: AuthContext.jsx se está ejecutando.');

const setAuthToken = (token) => {
  console.log('AuthContext: setAuthToken ejecutado.');
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider RENDERIZADO. Estado actual:', { isAuthenticated, loading, user });

  useEffect(() => {
    console.log('AuthProvider: useEffect ejecutado por primera vez.');
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      console.log('AuthProvider useEffect: ¿Token en localStorage?', storedToken ? 'Sí' : 'No');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const res = await axios.get('http://localhost:5001/api/auth/me');
          console.log('AuthProvider useEffect: Respuesta de /api/auth/me', res.data);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('AuthProvider useEffect: Falló la carga del usuario.', err);
          localStorage.removeItem('token');
        }
      }
      console.log('AuthProvider useEffect: Finalizando, estableciendo loading a false.');
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    console.log('AuthContext: Se llamó a la función login.');
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', userData);
      console.log('AuthContext login: Respuesta de la API de login', response.data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      const res = await axios.get('http://localhost:5001/api/auth/me');
      console.log('AuthContext login: Respuesta de /api/auth/me post-login', res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      console.log('AuthContext login: Estado actualizado. Debería redirigir ahora.');
      return true;
    } catch (error) {
      alert(`Error: ${error.response?.data?.msg || 'Ocurrió un error'}`);
      return false;
    }
  };

  const register = async (userData) => {
    try {
        await axios.post('http://localhost:5001/api/auth/register', userData);
        alert('¡Registro exitoso! Por favor, inicia sesión.');
        return true;
    } catch (error) {
        alert(`Error: ${error.response?.data?.msg || 'Ocurrió un error'}`);
        return false;
    }
  }

  const logout = () => {
    console.log('AuthContext: Se llamó a la función logout.');
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = { isAuthenticated, loading, user, login, register, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <h1 className="text-white text-center p-10">CARGANDO APP...</h1> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
