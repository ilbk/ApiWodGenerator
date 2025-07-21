import React, { useState } from 'react';
import authService from '../services/authService';

function AddUserModal({ onClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.username || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await authService.registerByAdmin(formData);
      setSuccess(`¡Usuario ${formData.username} creado con éxito!`);
      setFormData({ username: '', email: '', password: '' }); // Limpiar formulario
      onUserAdded(); // Llama a la función para refrescar la lista de usuarios si es necesario
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al crear el usuario.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-white font-bold">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nombre de usuario" required className="w-full p-2 bg-gray-700 text-white rounded" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 bg-gray-700 text-white rounded" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" required className="w-full p-2 bg-gray-700 text-white rounded" />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white font-bold">Cerrar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-bold">Crear Usuario</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
