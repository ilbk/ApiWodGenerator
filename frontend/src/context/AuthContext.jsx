import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const setAuthToken = (token) => {
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

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const res = await axios.get(import.meta.env.VITE_API_URL + '/api/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      alert(`Error: ${error.response?.data?.msg || 'Ocurrió un error'}`);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = { isAuthenticated, loading, user, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </Auth-Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
