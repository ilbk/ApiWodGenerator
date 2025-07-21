import React, { useState, useEffect } from 'react';

const categoriesOptions = ['Fuerza', 'Gimnástico', 'MetCon', 'Endurance', 'Híbrido', 'Funcional'];
const tagsOptions = ['Olímpico', 'Gimnástico', 'Fuerza Pura', 'Cardio', 'Musculación', 'Core', 'Máquina'];
const focusOptions = ['Tren Superior', 'Tren Inferior', 'Cuerpo Completo', 'N/A'];
const skillLevelOptions = ['Principiante', 'Intermedio', 'Avanzado', 'Competidor', 'Elite'];
const patronesMovimientoOptions = ['Empuje', 'Tracción', 'Dominante de Rodilla', 'Dominante de Cadera', 'Core', 'Cardio', 'Estabilización'];
const equipmentOptions = [ 'Barra Olímpica', 'Discos (Bumpers)', 'Mancuernas (Dumbbells)', 'Pesa Rusa (Kettlebell)', 'Cajón de Salto (Plyo Box)', 'Cuerda de Saltar (Speed Rope)', 'Balón Medicinal (Wall Ball)', 'Barra de Dominadas', 'Anillas de Gimnasia', 'Cuerda para Trepar', 'GHD', 'Paralelas (Parallettes)', 'Remadora (Rower)', 'Assault Bike (Air Bike)', 'SkiErg', 'BikeErg', 'Curved Treadmill', 'Trineo (Sled)', 'Yugo (Yoke)', 'Sandbag (Saco de arena)', 'Bandas de Resistencia', 'Sin Equipo' ];
const musclesOptions = [ 'Pectorales', 'Deltoides', 'Tríceps', 'Dorsales', 'Trapecios', 'Bíceps', 'Abdominales', 'Oblicuos', 'Lumbares', 'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Aductores', 'Gemelos' ];
const sectionsOptions = ['Calentamiento (Core)', 'Levantamiento Olímpico', 'Musculación', 'WOD Principal', 'Flexibilidad (Vuelta a la Calma)', 'Modo DIOS (Tercera Edad)'];

function EditExerciseModal({ exercise, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...exercise });

  useEffect(() => {
    setFormData({
      ...exercise,
      categories: exercise.categories || [],
      tags: exercise.tags || [],
      equipment: exercise.equipment || [],
      patrones_movimiento: exercise.patrones_movimiento || [],
      musculos_principales: exercise.musculos_principales || [],
      allowedSections: exercise.allowedSections || [],
      imageUrl: exercise.imageUrl || '',
    });
  }, [exercise]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const list = prev[field] || [];
      const newList = checked ? [...list, value] : list.filter(item => item !== value);
      return { ...prev, [field]: newList };
    });
  };

  const handleSave = () => {
    onSave(exercise._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl mb-6 text-white font-bold">Editando: {exercise.name}</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del Ejercicio" required className="w-full p-2 bg-gray-700 rounded text-white" />
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de la Imagen" className="w-full p-2 bg-gray-700 rounded text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset><legend className="text-lg font-bold text-white mb-2">Categorías</legend><div className="grid grid-cols-2 gap-2 p-2 bg-gray-900/50 rounded-md">{categoriesOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer text-white"><input type="checkbox" value={opt} checked={formData.categories.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'categories')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
            <fieldset><legend className="text-lg font-bold text-white mb-2">Tags</legend><div className="grid grid-cols-2 gap-2 p-2 bg-gray-900/50 rounded-md">{tagsOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer text-white"><input type="checkbox" value={opt} checked={formData.tags.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'tags')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          </div>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Patrones de Movimiento</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-md">{patronesMovimientoOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer text-white"><input type="checkbox" value={opt} checked={formData.patrones_movimiento.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'patrones_movimiento')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Equipamiento</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-md">{equipmentOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer text-white"><input type="checkbox" value={opt} checked={formData.equipment.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'equipment')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Músculos Principales</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-md">{musclesOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer text-white"><input type="checkbox" value={opt} checked={formData.musculos_principales.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'musculos_principales')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Secciones Permitidas</legend><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-gray-900/50 rounded-md">{sectionsOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer text-white"><input type="checkbox" value={opt} checked={formData.allowedSections.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'allowedSections')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-bold text-gray-300 mb-1">Nivel de Habilidad</label><select name="skill_level" value={formData.skill_level} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded text-white">{skillLevelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className="block text-sm font-bold text-gray-300 mb-1">Focus Muscular</label><select name="focus" value={formData.focus} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded text-white">{focusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white font-bold">Cancelar</button>
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-bold">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditExerciseModal;
