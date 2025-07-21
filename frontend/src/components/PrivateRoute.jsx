import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  console.log('PrivateRoute RENDERIZADO. Estado:', { isAuthenticated, loading });

  if (loading) {
    return <div className="text-white text-center p-10">Verificando autenticación...</div>;
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute: No autenticado. Redirigiendo a /login.');
    return <Navigate to="/login" />;
  }
  
  console.log('PrivateRoute: Autenticado. Renderizando Outlet.');
  return <Outlet />;
};

export default PrivateRoute;
