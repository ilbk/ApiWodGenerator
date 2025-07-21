// --- Funciones de Ayuda (Helpers) ---
const getRandomElements = (arr, num) => {
  if (!arr || arr.length === 0) return [];
  if (num >= arr.length) return [...arr];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

// --- Lógica de Cálculo de Peso (¡ACTUALIZADA!) ---
const weightPercentageMap = {
  Hipertrofia: [0.65, 0.80],
  Fuerza: [0.80, 0.95],
};

const calculateGymWeight = (exercise, user, focus) => {
  if (focus === 'Mantención') return '';
  
  const prs = user.personalRecords;
  let basePr = 0;
  
  if (prs) {
    const exName = exercise.name.toLowerCase();
    if (exName.includes('clean')) basePr = prs.cleanAndJerk;
    else if (exName.includes('snatch')) basePr = prs.snatch;
    else if (exName.includes('squat') || exName.includes('prensa')) basePr = prs.backSquat;
    else if (exName.includes('deadlift')) basePr = prs.deadlift;
    else if (exName.includes('press')) basePr = prs.benchPress;
  }
  
  // Si encontramos un PR relevante, calculamos el peso en kg
  if (basePr && basePr > 0) {
    const [minPercent, maxPercent] = weightPercentageMap[focus];
    const randomPercent = Math.random() * (maxPercent - minPercent) + minPercent;
    const calculatedWeight = Math.round((basePr * randomPercent) / 2.5) * 2.5;
    return `(${calculatedWeight} kg)`;
  }
  
  // ¡NUEVO! Si no hay PR, pero es un ejercicio de máquina/musculación, damos una guía
  if (exercise.tags.includes('Máquina') || exercise.tags.includes('Musculación')) {
    if (focus === 'Hipertrofia') {
      return '(peso desafiante para 8-12 reps)';
    }
    if (focus === 'Fuerza') {
      return '(peso pesado para 3-5 reps)';
    }
  }

  return ''; // No devuelve nada si no aplica ninguna regla
};

// --- Funciones de Generación de Secciones (El resto del archivo no cambia) ---
const generateGymWarmup = () => {
  return [
    "5-10 minutos de cardio en cinta o elíptica.",
    "Movilidad Articular controlada para hombros, caderas y rodillas.",
    "Series de aproximación: 2 series ligeras del primer ejercicio de la rutina.",
  ];
};

const generateGymCooldown = (allExercises) => {
  const flexExercises = allExercises.filter(ex => ex.allowedSections.includes('Flexibilidad (Vuelta a la Calma)'));
  if (flexExercises.length < 2) return ["5 min cardio suave", "Estiramientos estáticos generales"];
  
  const selectedStretches = getRandomElements(flexExercises, 3);
  const plan = selectedStretches.map(ex => `${ex.name}: 2 series de 30-60 segundos por lado`);
  return ["5 minutos de cardio muy suave para bajar pulsaciones.", ...plan];
};

const generateMainRoutine = (params, user, allExercises) => {
  const { userCategory = 'Scaled', focus = 'Mantención', equipmentType = 'Ambos', trainingFocus = 'Mantención' } = params;
  
  const exercisesPerCategory = { Rookie: 5, Básico: 7, Scaled: 9, RX: 12, Elite: 16 };
  const numExercises = exercisesPerCategory[userCategory] || 9;

  let bodybuildingExercises = allExercises.filter(ex => ex.allowedSections.includes('Musculación'));
  
  const machineExercises = bodybuildingExercises.filter(ex => ex.tags.includes('Máquina'));
  const freeWeightExercises = bodybuildingExercises.filter(ex => !ex.tags.includes('Máquina'));
  
  let selectedExercises = [];

  if (equipmentType === 'Sólo Máquinas') {
    selectedExercises = getRandomElements(machineExercises, numExercises);
  } else if (equipmentType === 'Sólo Pesos Libres') {
    selectedExercises = getRandomElements(freeWeightExercises, numExercises);
  } else {
    const numMachine = Math.ceil(numExercises * 0.6);
    const numFreeWeight = Math.floor(numExercises * 0.4);
    selectedExercises = [...getRandomElements(machineExercises, numMachine), ...getRandomElements(freeWeightExercises, numFreeWeight)];
  }

  if (params.focus !== 'Ambas') {
    selectedExercises = selectedExercises.filter(ex => ex.focus === params.focus);
  }

  if (selectedExercises.length === 0) {
    return ["No se encontraron ejercicios con los filtros seleccionados."];
  }

  // Se aplica el esquema de series/reps/peso según el Foco Principal
  switch (trainingFocus) {
    case 'Fuerza':
      selectedExercises.sort((a, b) => (b.tags.includes('Fuerza Pura') ? 1 : -1));
      return selectedExercises.map(ex => {
        const sets = getRandomElements([3, 4, 5], 1)[0];
        const reps = getRandomElements([3, 4, 5], 1)[0];
        const weight = calculateGymWeight(ex, user, trainingFocus);
        return `${ex.name} ${weight || ''}: ${sets} series de ${reps} repeticiones (Descanso: 2-5 min)`;
      });
    
    case 'Hipertrofia':
      return selectedExercises.map(ex => {
        const sets = getRandomElements([3, 4], 1)[0];
        const reps = getRandomElements([8, 10, 12], 1)[0];
        const weight = calculateGymWeight(ex, user, trainingFocus);
        return `${ex.name} ${weight || ''}: ${sets} series de ${reps} repeticiones (Descanso: 60-90s)`;
      });

    case 'Mantención':
    default:
      return selectedExercises.sort(() => 0.5 - Math.random()).map(ex => `${ex.name}: 3 series de 8-12 repeticiones`);
  }
};

export const generateGymRoutine = (params, user, allExercises) => {
  const mainRoutine = generateMainRoutine(params, user, allExercises);
  
  return {
    title: `Rutina de Gimnasio - Foco: ${params.trainingFocus}`,
    warmup: generateGymWarmup(),
    mainRoutine: mainRoutine,
    cooldown: params.includeFlexibility ? generateGymCooldown(allExercises) : null,
  };
};
