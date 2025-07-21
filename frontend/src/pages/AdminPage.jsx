import React, { useState, useEffect } from 'react';
import exerciseService from '../services/exerciseService';
import EditExerciseModal from '../components/EditExerciseModal';

const categoriesOptions = ['Fuerza', 'Gimnástico', 'MetCon', 'Endurance', 'Híbrido', 'Funcional'];
const tagsOptions = ['Olímpico', 'Gimnástico', 'Fuerza Pura', 'Cardio', 'Musculación', 'Core', 'Máquina'];
const focusOptions = ['Tren Superior', 'Tren Inferior', 'Cuerpo Completo', 'N/A'];
const skillLevelOptions = ['Principiante', 'Intermedio', 'Avanzado', 'Competidor', 'Elite'];
const patronesMovimientoOptions = ['Empuje', 'Tracción', 'Dominante de Rodilla', 'Dominante de Cadera', 'Core', 'Cardio', 'Estabilización'];
const equipmentOptions = [ 'Barra Olímpica', 'Discos (Bumpers)', 'Mancuernas (Dumbbells)', 'Pesa Rusa (Kettlebell)', 'Cajón de Salto (Plyo Box)', 'Cuerda de Saltar (Speed Rope)', 'Balón Medicinal (Wall Ball)', 'Barra de Dominadas', 'Anillas de Gimnasia', 'Cuerda para Trepar', 'GHD', 'Paralelas (Parallettes)', 'Remadora (Rower)', 'Assault Bike (Air Bike)', 'SkiErg', 'BikeErg', 'Curved Treadmill', 'Trineo (Sled)', 'Yugo (Yoke)', 'Sandbag (Saco de arena)', 'Bandas de Resistencia', 'Sin Equipo' ];
const musclesOptions = [ 'Pectorales', 'Deltoides', 'Tríceps', 'Dorsales', 'Trapecios', 'Bíceps', 'Abdominales', 'Oblicuos', 'Lumbares', 'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Aductores', 'Gemelos' ];
const sectionsOptions = ['Calentamiento (Core)', 'Levantamiento Olímpico', 'Musculación', 'WOD Principal', 'Flexibilidad (Vuelta a la Calma)', 'Modo DIOS (Tercera Edad)'];

function AdminPage() {
  const [exercises, setExercises] = useState([]);
  const initialState = { name: '', categories: [], equipment: [], patrones_movimiento: [], musculos_principales: [], skill_level: 'Principiante', tags: [], focus: 'N/A', allowedSections: [], imageUrl: '' };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const res = await exerciseService.getAllExercises();
      setExercises(res.data);
    } catch (err) {
      setError('No se pudieron cargar los ejercicios.');
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    try {
      await exerciseService.createExercise(formData);
      setSuccess('¡Ejercicio creado con éxito!');
      setFormData(initialState);
      loadExercises();
    } catch (err) {
      setError('Error al crear el ejercicio. ' + (err.response?.data?.msg || ''));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
      await exerciseService.deleteExercise(id);
      loadExercises();
    }
  };

  const handleOpenEditModal = (exercise) => {
    setCurrentExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentExercise(null);
  };

  const handleUpdateExercise = async (id, data) => {
    try {
      await exerciseService.updateExercise(id, data);
      setSuccess('¡Ejercicio actualizado con éxito!');
      handleCloseModal();
      loadExercises();
    } catch (err) {
      setError('Error al actualizar el ejercicio.');
      setSuccess('');
    }
  };

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Administración de Ejercicios</h1>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl mb-4">Añadir Nuevo Ejercicio</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del Ejercicio" required className="w-full p-2 bg-gray-700 rounded" />
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de la Imagen del Ejercicio" className="w-full p-2 bg-gray-700 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset><legend className="text-lg font-bold text-white mb-2">Categorías</legend><div className="grid grid-cols-2 gap-2 p-2 bg-gray-900/50 rounded-md">{categoriesOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value={opt} checked={formData.categories.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'categories')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
            <fieldset><legend className="text-lg font-bold text-white mb-2">Tags</legend><div className="grid grid-cols-2 gap-2 p-2 bg-gray-900/50 rounded-md">{tagsOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value={opt} checked={formData.tags.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'tags')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          </div>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Patrones de Movimiento</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-md">{patronesMovimientoOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value={opt} checked={formData.patrones_movimiento.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'patrones_movimiento')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Equipamiento</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-md">{equipmentOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value={opt} checked={formData.equipment.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'equipment')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Músculos Principales</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-md">{musclesOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value={opt} checked={formData.musculos_principales.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'musculos_principales')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <fieldset><legend className="text-lg font-bold text-white mb-2">Secciones Permitidas</legend><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-gray-900/50 rounded-md">{sectionsOptions.map(opt => (<label key={opt} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" value={opt} checked={formData.allowedSections.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'allowedSections')} className="form-checkbox h-5 w-5"/><span>{opt}</span></label>))}</div></fieldset>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-bold text-gray-300 mb-1">Nivel de Habilidad</label><select name="skill_level" value={formData.skill_level} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">{skillLevelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className="block text-sm font-bold text-gray-300 mb-1">Focus Muscular</label><select name="focus" value={formData.focus} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">{focusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold transition-colors">Añadir Ejercicio</button>
        </form>
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Lista de Ejercicios</h2>
        <div className="mb-4">
          <input type="text" placeholder="Buscar por nombre..." className="w-full p-2 bg-gray-700 rounded border border-gray-600" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead><tr className="bg-gray-700"><th className="p-2">Nombre</th><th className="p-2">Tags</th><th className="p-2">Secciones</th><th className="p-2">Acciones</th></tr></thead>
          <tbody>{filteredExercises.map((ex) => (<tr key={ex._id} className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="p-2 font-semibold">{ex.name}</td>
            <td className="p-2 text-gray-400">{ex.tags?.join(', ')}</td>
            <td className="p-2 text-yellow-400">{ex.allowedSections?.join(', ')}</td>
            <td className="p-2 flex space-x-2">
              <button onClick={() => handleOpenEditModal(ex)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs font-semibold">Editar</button>
              <button onClick={() => handleDelete(ex._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold">Eliminar</button>
            </td>
          </tr>))}</tbody>
        </table></div>
      </div>

      {isModalOpen && <EditExerciseModal exercise={currentExercise} onClose={handleCloseModal} onSave={handleUpdateExercise} />}
    </div>
  );
}

export default AdminPage;
