import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import exerciseService from '../services/exerciseService';
import { generateGymRoutine } from '../services/gymRoutineGenerator';

// Componente para mostrar una sección de la rutina
const SessionSection = ({ title, content, colorClass }) => {
  if (!content) return null;
  return (
    <div>
      <h3 className={`text-xl font-bold mb-2 ${colorClass}`}>{title}</h3>
      <ul className="list-disc list-inside space-y-1 pl-2">
        {Array.isArray(content) ? content.map((item, index) => <li key={index}>{item}</li>) : <li>{content}</li>}
      </ul>
    </div>
  );
};

function GymModePage() {
  const { user } = useAuth();
  const [allExercises, setAllExercises] = useState([]);
  const [gymRoutine, setGymRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [params, setParams] = useState({
    userCategory: 'Scaled',
    focus: 'Ambas',
    includeFlexibility: user.permissions?.canUseGymFlexibility ?? true,
    equipmentType: 'Ambos',
    trainingFocus: 'Mantención', // <-- Nuevo estado
  });

  useEffect(() => {
    exerciseService.getAllExercises()
      .then(res => setAllExercises(res.data))
      .catch(err => console.error("Error al cargar ejercicios:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenerateRoutine = () => {
    if (allExercises.length === 0) {
      alert("Los ejercicios aún se están cargando, espera un momento.");
      return;
    }
    setLoading(true);
    // Pasamos los parámetros Y el usuario a la lógica
    const routine = generateGymRoutine(params, user, allExercises);
    setGymRoutine(routine);
    setLoading(false);
  };

  const permissions = {
    flexibility: user.permissions?.canUseGymFlexibility ?? true,
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-white">
      <h1 className="text-3xl font-bold mb-2 text-center">Modo GYM</h1>
      <p className="text-center text-gray-400 mb-6">Una rutina de musculación clásica para complementar tu entrenamiento.</p>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* --- ¡NUEVO SELECTOR DE FOCO PRINCIPAL! --- */}
          <div>
            <label htmlFor="trainingFocus" className="block text-sm font-bold text-gray-300 mb-1">Foco Principal</label>
            <select name="trainingFocus" value={params.trainingFocus} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
              <option>Mantención</option>
              <option>Hipertrofia</option>
              <option>Fuerza</option>
            </select>
          </div>
          <div>
            <label htmlFor="userCategory" className="block text-sm font-bold text-gray-300 mb-1">Tu Categoría</label>
            <select name="userCategory" value={params.userCategory} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
              <option>Rookie</option><option>Básico</option><option>Scaled</option><option>RX</option><option>Elite</option>
            </select>
          </div>
          <div>
            <label htmlFor="focus" className="block text-sm font-bold text-gray-300 mb-1">Foco Muscular</label>
            <select name="focus" value={params.focus} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
              <option value="Ambas">Cuerpo Completo</option>
              <option value="Tren Superior">Tren Superior</option>
              <option value="Tren Inferior">Tren Inferior</option>
            </select>
          </div>
          <div>
            <label htmlFor="equipmentType" className="block text-sm font-bold text-gray-300 mb-1">Tipo de Equipo</label>
            <select name="equipmentType" value={params.equipmentType} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
              <option>Ambos</option>
              <option>Sólo Máquinas</option>
              <option>Sólo Pesos Libres</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`flex items-center space-x-2 p-2 rounded-md ${permissions.flexibility ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
            <input type="checkbox" name="includeFlexibility" checked={params.includeFlexibility} onChange={handleChange} disabled={!permissions.flexibility} className="form-checkbox h-5 w-5"/>
            <span>Incluir Flexibilidad al final</span>
          </label>
        </div>

        <button 
          onClick={handleGenerateRoutine}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Generando...' : 'Generar Rutina'}
        </button>
      </div>

      {gymRoutine && (
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <h2 className="text-2xl font-bold text-center border-b border-gray-700 pb-3">{gymRoutine.title}</h2>
          <SessionSection title="Calentamiento" content={gymRoutine.warmup} colorClass="text-green-400" />
          <SessionSection title="Series de Entrenamiento" content={gymRoutine.mainRoutine} colorClass="text-yellow-400" />
          <SessionSection title="Vuelta a la Calma / Flexibilidad" content={gymRoutine.cooldown} colorClass="text-teal-400" />
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/" className="text-blue-400 hover:underline">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default GymModePage;
