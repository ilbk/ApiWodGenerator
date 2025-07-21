import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    backSquat: 0,
    deadlift: 0,
    benchPress: 0,
    snatch: 0,
    cleanAndJerk: 0,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Si hay un usuario y tiene PRs, llenamos el formulario con ellos.
    if (user && user.personalRecords) {
      setFormData({
        backSquat: user.personalRecords.backSquat || 0,
        deadlift: user.personalRecords.deadlift || 0,
        benchPress: user.personalRecords.benchPress || 0,
        snatch: user.personalRecords.snatch || 0,
        cleanAndJerk: user.personalRecords.cleanAndJerk || 0,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await userService.updatePRs(formData);
      setSuccess('¡Récords actualizados con éxito!');
    } catch (err) {
      setError('Error al actualizar los récords.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil y Récords (PRs)</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="backSquat" className="block text-sm font-medium text-gray-300">Back Squat (kg)</label>
              <input type="number" name="backSquat" value={formData.backSquat} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="deadlift" className="block text-sm font-medium text-gray-300">Deadlift (kg)</label>
              <input type="number" name="deadlift" value={formData.deadlift} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="benchPress" className="block text-sm font-medium text-gray-300">Bench Press (kg)</label>
              <input type="number" name="benchPress" value={formData.benchPress} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="snatch" className="block text-sm font-medium text-gray-300">Snatch (kg)</label>
              <input type="number" name="snatch" value={formData.snatch} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="cleanAndJerk" className="block text-sm font-medium text-gray-300">Clean & Jerk (kg)</label>
              <input type="number" name="cleanAndJerk" value={formData.cleanAndJerk} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold transition-colors mt-4">
            Guardar Cambios
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}

        <div className="mt-6 text-center">
            <Link to="/" className="text-blue-400 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
