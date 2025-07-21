import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Muestra un mensaje de "cargando" mientras se verifica la autenticación.
    return <div className="text-white text-center p-10">Cargando...</div>;
  }

  // Si el usuario está autenticado y su rol es 'admin', permite el acceso.
  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />; // <Outlet /> renderiza el componente hijo de la ruta.
  }

  // Si no cumple las condiciones, lo redirige a la página principal.
  return <Navigate to="/" />;
};

export default AdminRoute;
