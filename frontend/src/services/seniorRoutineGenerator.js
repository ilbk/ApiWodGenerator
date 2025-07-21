// --- Funciones de Ayuda (Helpers) ---
const getRandomElements = (arr, num) => {
  if (!arr || arr.length === 0) return [];
  if (num >= arr.length) return [...arr];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

// --- Lógica de Cálculo de Peso (Adaptada para Modo DIOS) ---
const seniorWeightPercentageMap = {
  Hipertrofia: [0.50, 0.65],
  Fuerza: [0.65, 0.75],
};

const calculateSeniorWeight = (exercise, user, focus) => {
  if (focus === 'Mantención') return '(peso liviano)';
  if (!exercise.tags.includes('Fuerza Pura') && !exercise.tags.includes('Olímpico')) return '(peso liviano)';
  const prs = user.personalRecords;
  if (!prs) return '(peso moderado)';
  let basePr = 0;
  const exName = exercise.name.toLowerCase();
  if (exName.includes('squat') || exName.includes('prensa')) basePr = prs.backSquat;
  else if (exName.includes('deadlift')) basePr = prs.deadlift;
  else if (exName.includes('press')) basePr = prs.benchPress;
  if (!basePr || basePr === 0) {
    if (focus === 'Hipertrofia') return '(peso desafiante para 10-15 reps)';
    if (focus === 'Fuerza') return '(peso pesado para 6-10 reps)';
    return '(peso liviano)';
  }
  const [minPercent, maxPercent] = seniorWeightPercentageMap[focus];
  const randomPercent = Math.random() * (maxPercent - minPercent) + minPercent;
  const calculatedWeight = Math.round((basePr * randomPercent) / 2.5) * 2.5;
  return `(${calculatedWeight} kg)`;
};

// --- Funciones de Generación de Secciones para el Modo DIOS ---
const generateSeniorWarmup = () => {
  return [
    "5-10 minutos de cardio de bajo impacto (caminata, bicicleta estática).",
    "Movilidad Articular Suave: Enfocada en hombros, caderas y tobillos.",
    "Activación: 2 series de 10 sentadillas a una silla y 10 elevaciones de brazos.",
  ];
};

const generateSeniorCooldown = (allExercises) => {
  const flexExercises = allExercises.filter(ex => ex.allowedSections.includes('Flexibilidad (Vuelta a la Calma)'));
  if (flexExercises.length < 2) return ["Estiramientos estáticos suaves y controlados (30s por músculo)."];
  
  const selectedStretches = getRandomElements(flexExercises, 3);
  const plan = selectedStretches.map(ex => `${ex.name}: 2 series de 30 segundos suaves`);
  return ["Vuelta a la calma con respiración controlada.", ...plan];
};

const generateSeniorMainRoutine = (params, user, allExercises) => {
  const { userCategory = 'Rookie', focus = 'Ambas', equipmentType = 'Ambos', trainingFocus = 'Mantención' } = params;
  const exercisesPerCategory = { Rookie: 4, Básico: 5, Scaled: 6, RX: 7, Elite: 8 };
  const numExercises = exercisesPerCategory[userCategory] || 6;

  let seniorExercisesPool = allExercises.filter(ex => ex.allowedSections.includes('Modo DIOS (Tercera Edad)'));
  const machineExercises = seniorExercisesPool.filter(ex => ex.tags.includes('Máquina'));
  const freeWeightExercises = seniorExercisesPool.filter(ex => !ex.tags.includes('Máquina'));
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

  if (focus !== 'Ambas') {
    selectedExercises = selectedExercises.filter(ex => ex.focus === focus);
  }

  if (selectedExercises.length === 0) {
    return [{ name: 'Error', description: 'No se encontraron ejercicios con los filtros seleccionados.', imageUrl: '' }];
  }

  // --- ¡CAMBIO IMPORTANTE! ---
  // Ahora devolvemos un array de OBJETOS en lugar de solo texto.
  switch (trainingFocus) {
    case 'Fuerza':
      return selectedExercises.map(ex => {
        const sets = getRandomElements([3, 4], 1)[0];
        const reps = getRandomElements([6, 8, 10], 1)[0];
        const weight = calculateSeniorWeight(ex, user, trainingFocus);
        return {
          name: ex.name,
          description: `${ex.name} ${weight}: ${sets} series de ${reps} repeticiones (Descanso: 90s)`,
          imageUrl: ex.imageUrl
        };
      });
    
    case 'Hipertrofia':
      return selectedExercises.map(ex => {
        const sets = getRandomElements([2, 3], 1)[0];
        const reps = getRandomElements([10, 12, 15], 1)[0];
        const weight = calculateSeniorWeight(ex, user, trainingFocus);
        return {
          name: ex.name,
          description: `${ex.name} ${weight}: ${sets} series de ${reps} repeticiones (Descanso: 60s)`,
          imageUrl: ex.imageUrl
        };
      });

    case 'Mantención':
    default:
      return selectedExercises.sort(() => 0.5 - Math.random()).map(ex => ({
        name: ex.name,
        description: `${ex.name} (peso liviano y controlado): 2-3 series de 10-15 repeticiones`,
        imageUrl: ex.imageUrl
      }));
  }
};

/**
 * La función principal que se exporta para generar la sesión de MODO DIOS.
 */
export const generateSeniorRoutine = (params, user, allExercises) => {
  const mainRoutine = generateSeniorMainRoutine(params, user, allExercises);
  
  return {
    title: `Rutina "Modo DIOS" - Foco: ${params.trainingFocus}`,
    warmup: generateSeniorWarmup(),
    mainRoutine: mainRoutine,
    cooldown: params.includeFlexibility ? generateSeniorCooldown(allExercises) : null,
  };
};
