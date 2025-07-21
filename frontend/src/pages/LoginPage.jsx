import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div><label className="block mb-2 text-sm font-medium text-gray-300">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/></div>
        <div><label className="block mb-2 text-sm font-medium text-gray-300">Contraseña</label><input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"/></div>
        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Entrar</button>
      </form>
      {/* --- El enlace a registro ha sido eliminado --- */}
    </div>
  );
}

export default LoginPage;
