import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserManagementPage() {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios. Asegúrate de tener permisos de administrador.');
    }
  };

  const handlePermissionChange = async (userId, permissionKey, value) => {
    setError('');
    setSuccess('');
    const finalValue = (permissionKey.includes('Time') || permissionKey.includes('Wods')) ? Number(value) : value;
    try {
      await userService.updateUserPermissions(userId, { [permissionKey]: finalValue });
      setUsers(users.map(user => {
        if (user._id === userId) {
          const updatedUser = { ...user, permissions: { ...user.permissions, [permissionKey]: finalValue } };
          if (permissionKey === 'minTrainingTime' && finalValue > (updatedUser.permissions.maxTrainingTime || 180)) {
            updatedUser.permissions.maxTrainingTime = finalValue;
          }
          if (permissionKey === 'maxTrainingTime' && finalValue < (updatedUser.permissions.minTrainingTime || 20)) {
            updatedUser.permissions.minTrainingTime = finalValue;
          }
          return updatedUser;
        }
        return user;
      }));
    } catch (err) {
      setError('No se pudo actualizar el permiso.');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    setError('');
    setSuccess('');
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) {
      try {
        await userService.deleteUser(userId);
        setSuccess(`Usuario "${username}" eliminado con éxito.`);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.msg || 'Error al eliminar el usuario.');
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Accesos de Usuarios</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3">Usuario</th>
                <th className="p-3 text-center">Modo DIOS</th>
                <th className="p-3 text-center">Modo GYM</th>
                <th className="p-3 text-center">Flex. GYM</th>
                <th className="p-3 text-center">Tipo WOD</th>
                <th className="p-3 text-center">L. Olímpico</th>
                <th className="p-3 text-center">Musculación</th>
                <th className="p-3 text-center">Flexibilidad</th>
                <th className="p-3 text-center">Max WODs</th>
                <th className="p-3 text-center">Tiempo Mín/Máx</th>
                <th className="p-3 text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-semibold"><div>{user.username}</div><div className="text-xs text-gray-400">{user.email}</div></td>
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canUseSeniorMode ?? true} onChange={(e) => handlePermissionChange(user._id, 'canUseSeniorMode', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canUseGymMode ?? true} onChange={(e) => handlePermissionChange(user._id, 'canUseGymMode', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canUseGymFlexibility ?? true} onChange={(e) => handlePermissionChange(user._id, 'canUseGymFlexibility', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canSelectTrainingType ?? true} onChange={(e) => handlePermissionChange(user._id, 'canSelectTrainingType', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canUseOly ?? true} onChange={(e) => handlePermissionChange(user._id, 'canUseOly', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canUseBodybuilding ?? true} onChange={(e) => handlePermissionChange(user._id, 'canUseBodybuilding', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  {/* --- ¡CELDA FALTANTE RESTAURADA! --- */}
                  <td className="p-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5" checked={user.permissions?.canUseFlexibility ?? true} onChange={(e) => handlePermissionChange(user._id, 'canUseFlexibility', e.target.checked)} disabled={user.role === 'admin'}/></td>
                  <td className="p-3 text-center"><select className="bg-gray-700 rounded p-1 w-16 text-center" value={user.permissions?.maxWodsPerSession ?? 5} onChange={(e) => handlePermissionChange(user._id, 'maxWodsPerSession', e.target.value)} disabled={user.role === 'admin'}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></td>
                  <td className="p-3 text-center"><input type="number" className="w-16 bg-gray-700 rounded p-1 text-center" value={user.permissions?.minTrainingTime ?? 20} onChange={(e) => handlePermissionChange(user._id, 'minTrainingTime', e.target.value)} disabled={user.role === 'admin'} /> - <input type="number" className="w-16 bg-gray-700 rounded p-1 text-center" value={user.permissions?.maxTrainingTime ?? 180} onChange={(e) => handlePermissionChange(user._id, 'maxTrainingTime', e.target.value)} disabled={user.role === 'admin'} /></td>
                  <td className="p-3 text-center">
                    {adminUser._id !== user._id && (
                       <button 
                         onClick={() => handleDeleteUser(user._id, user.username)}
                         className="text-red-500 hover:text-red-400 text-xl"
                         title={`Eliminar a ${user.username}`}
                       >
                         🗑️
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 text-center"><Link to="/" className="text-blue-400 hover:underline">Volver al inicio</Link></div>
    </div>
  );
}

export default UserManagementPage;
