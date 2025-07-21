import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HomePage() {
  // Usamos el hook para obtener el estado de autenticación y la función de logout
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Generador de WODs CrossFit
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Tu herramienta definitiva para crear entrenamientos.
        </p>
        
        {isAuthenticated ? (
          // Si el usuario está autenticado
          <div>
            <p className="text-lg mb-4">¡Bienvenido de vuelta!</p>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          // Si el usuario NO está autenticado
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

