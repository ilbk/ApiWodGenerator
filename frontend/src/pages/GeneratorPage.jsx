import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import exerciseService from '../services/exerciseService';
import { generateSession } from '../services/wodGenerator';

const equipmentList = [ 'Barra Olímpica', 'Discos (Bumpers)', 'Mancuernas (Dumbbells)', 'Pesa Rusa (Kettlebell)', 'Cajón de Salto (Plyo Box)', 'Cuerda de Saltar (Speed Rope)', 'Balón Medicinal (Wall Ball)', 'Barra de Dominadas', 'Anillas de Gimnasia', 'Cuerda para Trepar', 'GHD', 'Paralelas (Parallettes)', 'Remadora (Rower)', 'Assault Bike (Air Bike)', 'SkiErg', 'BikeErg', 'Curved Treadmill', 'Trineo (Sled)', 'Yugo (Yoke)', 'Sandbag (Saco de arena)', 'Bandas de Resistencia', 'Sin Equipo' ];

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

function GeneratorPage() {
  const { user } = useAuth();
  const [allExercises, setAllExercises] = useState([]);
  
  const minTime = user.permissions?.minTrainingTime ?? 20;
  const maxTime = user.permissions?.maxTrainingTime ?? 180;

  const [params, setParams] = useState({
    trainingType: 'Metcon',
    category: 'Scaled',
    time: Math.min(60, maxTime),
    equipment: [],
    numWods: 3,
    includeOly: user.permissions?.canUseOly ?? true,
    includeBodybuilding: user.permissions?.canUseBodybuilding ?? true,
    includeFlexibility: user.permissions?.canUseFlexibility ?? true,
    bodybuildingExercises: 4,
    bodybuildingSets: 2,
    bodybuildingFocus: 'Ambas',
    wodFormats: [],
  });
  const [generatedWod, setGeneratedWod] = useState(null);

  useEffect(() => {
    exerciseService.getAllExercises().then(res => setAllExercises(res.data)).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (name === 'time') {
      value = Math.max(minTime, Math.min(maxTime, Number(value)));
    }
    if (type === 'checkbox') {
      if (['includeOly', 'includeBodybuilding', 'includeFlexibility'].includes(name)) {
        setParams(prev => ({ ...prev, [name]: checked }));
      } else {
        const listName = equipmentList.includes(value) ? 'equipment' : 'wodFormats';
        setParams(prev => ({ ...prev, [listName]: checked ? [...prev[listName], value] : prev[listName].filter(item => item !== value) }));
      }
    } else {
      setParams(prev => ({ ...prev, [name]: ['time', 'numWods', 'bodybuildingExercises', 'bodybuildingSets'].includes(name) ? parseInt(value) : value }));
    }
  };
  
  const handleGenerateWod = (e) => {
    e.preventDefault();
    const currentParams = {
      ...params,
      includeOly: user.permissions?.canUseOly ?? true,
      includeBodybuilding: user.permissions?.canUseBodybuilding ?? true,
      includeFlexibility: user.permissions?.canUseFlexibility ?? true,
    };
    const session = generateSession(currentParams, user, allExercises);
    setGeneratedWod(session);
  };

  const permissions = {
    oly: user.permissions?.canUseOly ?? true,
    bodybuilding: user.permissions?.canUseBodybuilding ?? true,
    flexibility: user.permissions?.canUseFlexibility ?? true,
    canSelectTrainingType: user.permissions?.canSelectTrainingType ?? true,
  };

  const maxWods = user.permissions?.maxWodsPerSession ?? 5;
  const wodCountOptions = Array.from({ length: (maxWods - 2) + 1 }, (_, i) => i + 2);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Generador de Sesiones</h1>
      <form onSubmit={handleGenerateWod} className="bg-gray-800 p-6 rounded-lg mb-8 space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {permissions.canSelectTrainingType && (
            <div>
              <label htmlFor="trainingType" className="block text-sm font-bold text-gray-300 mb-1">Foco Principal</label>
              <select name="trainingType" value={params.trainingType} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
                <option>Metcon</option>
                <option>Fuerza</option>
                <option>Endurance</option>
                <option>Competicion</option> {/* <-- Opción Añadida */}
              </select>
            </div>
          )}
          <div><label htmlFor="category" className="block text-sm font-bold text-gray-300 mb-1">Tu Categoría</label><select name="category" value={params.category} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded"><option>Rookie</option><option>Básico</option><option>Scaled</option><option>RX</option><option>Elite</option></select></div>
          <div><label htmlFor="time" className="block text-sm font-bold text-gray-300 mb-1">Duración ({minTime}-{maxTime} min)</label><input type="number" name="time" value={params.time} onChange={handleChange} min={minTime} max={maxTime} step="5" className="w-full p-2 bg-gray-700 rounded" /></div>
          <div><label htmlFor="numWods" className="block text-sm font-bold text-gray-300 mb-1">Cantidad de WODs</label><select name="numWods" value={params.numWods} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">{wodCountOptions.map(num => (<option key={num} value={num}>{num}</option>))}</select></div>
        </fieldset>
        <fieldset><legend className="text-lg font-bold text-white mb-2">Implementos</legend><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">{equipmentList.map(item => (<label key={item} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md hover:bg-gray-600 cursor-pointer"><input type="checkbox" value={item} onChange={handleChange} className="form-checkbox h-5 w-5"/><span>{item}</span></label>))}</div></fieldset>
        <fieldset><legend className="text-lg font-bold text-white mb-2">Estructura de la Sesión</legend><div className="space-y-4">
          <label className={`flex items-center space-x-2 bg-gray-700 p-3 rounded-md ${permissions.oly ? 'hover:bg-gray-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}><input type="checkbox" name="includeOly" checked={params.includeOly} onChange={handleChange} disabled={!permissions.oly} className="form-checkbox h-5 w-5" /><span>Incluir L. Olímpico</span></label>
          <div><label className={`flex items-center space-x-2 bg-gray-700 p-3 rounded-md ${permissions.bodybuilding ? 'hover:bg-gray-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}><input type="checkbox" name="includeBodybuilding" checked={params.includeBodybuilding} onChange={handleChange} disabled={!permissions.bodybuilding} className="form-checkbox h-5 w-5" /><span>Incluir Musculación</span></label>
            {params.includeBodybuilding && permissions.bodybuilding && (<div className="grid grid-cols-3 gap-4 mt-2 p-4 bg-gray-900/50 rounded-lg"><div><label htmlFor="bodybuildingExercises" className="block text-xs text-gray-400 mb-1">Ejercicios</label><select name="bodybuildingExercises" value={params.bodybuildingExercises} onChange={handleChange} className="w-full p-2 bg-gray-700 text-sm rounded"><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></div><div><label htmlFor="bodybuildingSets" className="block text-xs text-gray-400 mb-1">Series</label><select name="bodybuildingSets" value={params.bodybuildingSets} onChange={handleChange} className="w-full p-2 bg-gray-700 text-sm rounded"><option>2</option><option>3</option></select></div><div><label htmlFor="bodybuildingFocus" className="block text-xs text-gray-400 mb-1">Foco</label><select name="bodybuildingFocus" value={params.bodybuildingFocus} onChange={handleChange} className="w-full p-2 bg-gray-700 text-sm rounded"><option>Ambas</option><option>Tren Superior</option><option>Tren Inferior</option></select></div></div>)}
          </div>
          <label className={`flex items-center space-x-2 bg-gray-700 p-3 rounded-md ${permissions.flexibility ? 'hover:bg-gray-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}><input type="checkbox" name="includeFlexibility" checked={params.includeFlexibility} onChange={handleChange} disabled={!permissions.flexibility} className="form-checkbox h-5 w-5" /><span>Incluir Flexibilidad</span></label>
        </div></fieldset>
        <fieldset><legend className="text-lg font-bold text-white mb-2">Formatos de WOD <span className="text-sm font-normal text-gray-400">(opcional)</span></legend><div className="flex flex-wrap gap-2">{['AMRAP', 'EMOM', 'RFT', 'For Time'].map(format => (<label key={format} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md hover:bg-gray-600 cursor-pointer"><input type="checkbox" value={format} onChange={handleChange} className="form-checkbox h-5 w-5"/><span>{format}</span></label>))}</div></fieldset>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition-colors mt-4 text-lg">¡Generar Mi Sesión!</button>
      </form>

      {generatedWod && (
        <div className="bg-gray-800 p-6 rounded-lg space-y-6 mt-8">
          <h2 className="text-2xl font-bold text-center border-b border-gray-700 pb-3">Tu Sesión de Hoy</h2>
          <SessionSection title="Calentamiento" content={generatedWod.warmup} colorClass="text-green-400" />
          <SessionSection title="Levantamiento Olímpico" content={generatedWod.olySection} colorClass="text-blue-400" />
          <SessionSection title="Musculación" content={generatedWod.bodybuildingSection} colorClass="text-yellow-400" />
          <div><h3 className="text-xl font-bold mb-2 text-red-400">WODs</h3><div className="space-y-3">{generatedWod.wods.map((wod, index) => <div key={index} className="pl-2">{wod}</div>)}</div></div>
          <SessionSection title="Vuelta a la Calma / Flexibilidad" content={generatedWod.cooldown} colorClass="text-teal-400" />
        </div>
      )}

       <div className="mt-6 text-center"><Link to="/" className="text-blue-400 hover:underline">Volver al inicio</Link></div>
    </div>
  );
}

export default GeneratorPage;
