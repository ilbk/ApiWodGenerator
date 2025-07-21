import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import CenteredLayout from './components/CenteredLayout';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import GeneratorPage from './pages/GeneratorPage';
import UserManagementPage from './pages/UserManagementPage';
import GymModePage from './pages/GymModePage';
import SeniorModePage from './pages/SeniorModePage';
import AddUserModal from './components/AddUserModal';

const HomePage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-white text-3xl sm:text-4xl mb-4">
          Bienvenido, {user ? user.username : 'Usuario'}!
        </h1>
        <div className="space-y-4 mt-6">
          
          {/* --- BOTONES DE USUARIO RESTAURADOS --- */}
          <Link to="/generator" className="inline-block w-full max-w-xs px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg">
            Crear Entrenamiento
          </Link>
          {(user.permissions?.canUseGymMode ?? true) && (
            <Link to="/gym-mode" className="inline-block w-full max-w-xs px-4 py-3 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors text-lg">
              Modo GYM
            </Link>
          )}
          {(user.permissions?.canUseSeniorMode ?? true) && (
            <Link to="/senior-mode" className="inline-block w-full max-w-xs px-4 py-3 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors text-lg">
              Modo DIOS
            </Link>
          )}
          <Link to="/profile" className="inline-block w-full max-w-xs px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
            Mi Perfil y PRs
          </Link>

          {/* --- BOTONES DE ADMINISTRADOR --- */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="inline-block w-full max-w-xs px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                Panel de Administración
              </Link>
              <Link to="/user-management" className="inline-block w-full max-w-xs px-4 py-2 font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                Accesos usuarios
              </Link>
              <button onClick={() => setIsAddUserModalOpen(true)} className="inline-block w-full max-w-xs px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                Crear Nuevo Usuario
              </button>
            </>
          )}

          {/* --- BOTÓN DE CERRAR SESIÓN --- */}
          <button 
            onClick={handleLogout} 
            className="w-full max-w-xs px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {isAddUserModalOpen && <AddUserModal onClose={() => setIsAddUserModalOpen(false)} onUserAdded={() => { /* Opcional: podrías llamar a una función que refresque la lista de usuarios en el panel de accesos si estuviera abierto */ }} />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-900 min-h-screen font-sans">
          <Routes>
            <Route element={<CenteredLayout />}>
              <Route path="/login" element={<LoginPage />} />
              {/* La ruta /register está eliminada correctamente */}
            </Route>
            <Route element={<PrivateRoute />}>
              <Route element={<CenteredLayout />}>
                <Route path="/" element={<HomePage />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/gym-mode" element={<GymModePage />} />
              <Route path="/senior-mode" element={<SeniorModePage />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/user-management" element={<UserManagementPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
