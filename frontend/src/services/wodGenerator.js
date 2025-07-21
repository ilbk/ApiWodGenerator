// --- Funciones de Ayuda (Helpers) ---
const getRandomElements = (arr, num) => {
  if (!arr || arr.length === 0) return [];
  if (num >= arr.length) return [...arr];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const filterExercisesByEquipment = (allExercises, availableEquipment) => {
  const equipmentWithBody = [...availableEquipment, 'Sin Equipo'];
  return allExercises.filter(exercise => {
    if (!exercise.equipment || exercise.equipment.length === 0) return true;
    return exercise.equipment.some(requiredEq => equipmentWithBody.includes(requiredEq));
  });
};

// --- Lógica de Cálculo de Peso ---
const weightPercentageMap = {
  Rookie: [0.40, 0.50], Básico: [0.50, 0.60], Scaled: [0.60, 0.70],
  RX: [0.70, 0.80], Elite: [0.80, 0.90],
};

const calculateWeight = (exercise, user, category) => {
  if (!exercise.tags.includes('Fuerza Pura') && !exercise.tags.includes('Olímpico')) return null;
  const prs = user.personalRecords;
  if (!prs) return null;
  let basePr = 0;
  const exName = exercise.name.toLowerCase();
  if (exName.includes('clean')) basePr = prs.cleanAndJerk;
  else if (exName.includes('snatch')) basePr = prs.snatch;
  else if (exName.includes('squat')) basePr = prs.backSquat;
  else if (exName.includes('deadlift')) basePr = prs.deadlift;
  else if (exName.includes('press')) basePr = prs.benchPress;
  if (!basePr || basePr === 0) return null;
  const [minPercent, maxPercent] = weightPercentageMap[category];
  const randomPercent = Math.random() * (maxPercent - minPercent) + minPercent;
  const calculatedWeight = Math.round((basePr * randomPercent) / 2.5) * 2.5;
  return `(${calculatedWeight} kg)`;
};

// --- Funciones de Generación de Secciones ---
const generateWarmup = (availableExercises) => {
  const coreExercises = availableExercises.filter(ex => ex.allowedSections.includes('Calentamiento (Core)'));
  const activationExercises = [
    { name: 'Sentadillas al Aire', reps: 15 }, { name: 'Jumping Jacks', reps: 30 },
    { name: 'Push-ups (de rodillas si es necesario)', reps: 10 }, { name: 'Estocadas (Lunges)', reps: 10 },
  ];
  const selectedCore = getRandomElements(coreExercises, 3);
  const remainingSlots = Math.max(0, (Math.floor(Math.random() * 4) + 3) - selectedCore.length);
  const selectedActivation = getRandomElements(activationExercises, remainingSlots);
  const corePlan = selectedCore.map(ex => {
    if (ex.measurement_type === 'tiempo') return `30-45 seg de ${ex.name}`;
    return `15-20 reps de ${ex.name}`;
  });
  const activationPlan = selectedActivation.map(ex => `${ex.reps} ${ex.name}`);
  const fullActivationPlan = [...corePlan, ...activationPlan].sort(() => 0.5 - Math.random());
  return [
    "5-10 min de cardio ligero (trote, remo, bicicleta).",
    "Movilidad Articular: Rotaciones de cuello, hombros, caderas, rodillas y tobillos.",
    `Activación (2 rondas): ${fullActivationPlan.join(', ')}.`
  ];
};

const generateOlySection = (params, user, availableExercises) => {
  const olyExercises = availableExercises.filter(ex => ex.allowedSections.includes('Levantamiento Olímpico'));
  if (olyExercises.length < 3) return ["No hay suficientes ejercicios de halterofilia para crear complejos."];
  let finalComplexes = [];
  let exercisesPool = [...olyExercises];
  const getWeightString = (exercise) => {
    return params.trainingType === 'Fuerza' ? (calculateWeight(exercise, user, params.category) || '') : '';
  };
  if (exercisesPool.length >= 3) {
    const s = Math.floor(Math.random() * 2) + 2, r1 = Math.floor(Math.random() * 3) + 1, r2 = Math.floor(Math.random() * 2) + 1, r3 = Math.floor(Math.random() * 3) + 1;
    const m = getRandomElements(exercisesPool, 3); exercisesPool = exercisesPool.filter(ex => !m.includes(ex));
    const complexString = `${r1} ${m[0].name} ${getWeightString(m[0])} + ${r2} ${m[1].name} ${getWeightString(m[1])} + ${r3} ${m[2].name} ${getWeightString(m[2])}`.replace(/\s\s+/g, ' ').trim();
    finalComplexes.push(`${s} series de: ${complexString}`);
  }
  if (exercisesPool.length >= 2) {
    const s = Math.floor(Math.random() * 2) + 1, r1 = Math.floor(Math.random() * 3) + 1, r2 = Math.floor(Math.random() * 3) + 1;
    const m = getRandomElements(exercisesPool, 2); exercisesPool = exercisesPool.filter(ex => !m.includes(ex));
    const complexString = `${r1} ${m[0].name} ${getWeightString(m[0])} + ${r2} ${m[1].name} ${getWeightString(m[1])}`.replace(/\s\s+/g, ' ').trim();
    finalComplexes.push(`${s} series de: ${complexString}`);
  }
  if (exercisesPool.length >= 1) {
    const s = Math.floor(Math.random() * 3) + 1, r = Math.floor(Math.random() * 2) + 1;
    const m = getRandomElements(exercisesPool, 1)[0];
    const complexString = `${m.name} ${getWeightString(m)}`.trim();
    finalComplexes.push(`${s} series de ${r} reps de ${complexString}`);
  }
  return finalComplexes.sort(() => 0.5 - Math.random());
};

const generateBodybuildingSection = (params, user, availableExercises) => {
  let bbExercises = availableExercises.filter(ex => ex.allowedSections.includes('Musculación'));
  if (params.bodybuildingFocus !== 'Ambas') {
    bbExercises = bbExercises.filter(ex => ex.focus === params.bodybuildingFocus || ex.focus === 'Cuerpo Completo');
  }
  if (bbExercises.length === 0) return ["No hay ejercicios de musculación disponibles."];
  const selected = getRandomElements(bbExercises, params.bodybuildingExercises);
  return selected.map(ex => {
    const weight = params.trainingType === 'Fuerza' ? calculateWeight(ex, user, params.category) : null;
    return `${ex.name} ${weight || ''}: ${params.bodybuildingSets} series de 8-12 repeticiones.`;
  });
};

const selectBalancedExercisesForWod = (availableExercises) => {
  const wodExercises = [];
  const exerciseCount = Math.floor(Math.random() * 5) + 2;
  let patternsToUse = getRandomElements(['Tracción', 'Empuje', 'Dominante de Rodilla', 'Dominante de Cadera', 'Cardio'], exerciseCount);
  patternsToUse.forEach(pattern => {
    const potentialExercises = availableExercises.filter(ex =>
      ex.allowedSections.includes('WOD Principal') && ex.patrones_movimiento?.includes(pattern) && !wodExercises.some(we => we._id === ex._id));
    if (potentialExercises.length > 0) {
      wodExercises.push(getRandomElements(potentialExercises, 1)[0]);
    }
  });
  return { selectedExercises: wodExercises };
};

const generateWods = (params, user, availableExercises) => {
  let wods = [];
  const isCompetitionChallenge = params.trainingType === 'Competicion' && Math.random() < 0.8;
  const wodPool = availableExercises.filter(ex => ex.allowedSections.includes('WOD Principal'));
  const formatPool = params.wodFormats.length > 0 ? params.wodFormats : ['AMRAP', 'For Time', 'EMOM', 'RFT'];
  for (let i = 0; i < params.numWods; i++) {
    let wodString = `WOD ${i + 1}: No se pudieron generar ejercicios.`;
    const format = getRandomElements(formatPool, 1)[0];
    if (isCompetitionChallenge) {
      const exerciseCount = Math.floor(Math.random() * 8) + 3;
      const selectedExercises = getRandomElements(wodPool, exerciseCount);
      const exercisesString = selectedExercises.map(ex => {
        const weight = calculateWeight(ex, user, params.category);
        let amount;
        if (ex.name.toLowerCase().includes('cuerda de saltar')) {
          amount = Math.round((Math.floor(Math.random() * 251) + 50) / 10) * 10;
        } else if (ex.measurement_type === 'distancia') {
          amount = `${getRandomElements([400, 800, 1000],1)[0]}m`;
        } else {
          amount = getRandomElements([15, 20, 25, 30],1)[0];
        }
        return `${amount} ${ex.name} ${weight || ''}`.trim();
      }).join(' / ');
      const rounds = Math.floor(Math.random() * 6) + 2;
      wodString = `(DESAFÍO) ${rounds} Rondas Por Tiempo: ${exercisesString}`;
    } else {
      const { selectedExercises } = selectBalancedExercisesForWod(wodPool);
      if (selectedExercises.length >= 2) {
        const exercisesString = selectedExercises.map(ex => {
          let amount;
          if (ex.measurement_type === 'distancia') amount = `${getRandomElements([200, 400],1)[0]}m`;
          else amount = getRandomElements([8, 10, 12, 15],1)[0];
          return `${amount} ${ex.name}`;
        }).join(' / ');
        if (format === 'AMRAP') {
          const time = getRandomElements([10, 12, 15, 20], 1)[0];
          wodString = `AMRAP ${time} min: ${exercisesString}`;
        } else if (format === 'EMOM') {
          const time = getRandomElements([10, 12, 14, 16], 1)[0];
          const ex1_str = `${getRandomElements([5, 8, 10],1)[0]} ${selectedExercises[0].name}`.trim();
          const ex2_str = `${getRandomElements([10, 12, 15],1)[0]} ${selectedExercises[1].name}`.trim();
          wodString = `EMOM ${time} min: Minuto Impar - ${ex1_str} / Minuto Par - ${ex2_str}`;
        } else {
          const rounds = Math.floor(Math.random() * 6) + 2;
          wodString = `${rounds} Rondas Por Tiempo: ${exercisesString}`;
        }
      }
    }
    wods.push(`WOD ${i + 1}: ${wodString}`);
  }
  return wods;
};

const generateCooldown = (availableExercises) => {
  const flexExercises = availableExercises.filter(ex => ex.allowedSections.includes('Flexibilidad (Vuelta a la Calma)'));
  if (flexExercises.length < 2) return ["5 min cardio suave", "Estiramientos estáticos generales"];
  const selected = getRandomElements(flexExercises, Math.random() < 0.5 ? 3 : 4);
  const plan = selected.map(ex => `${ex.name}: 2 series de 30-60 segundos`);
  return ["5 minutos de cardio muy suave para bajar pulsaciones.", ...plan];
};

// --- Función Principal ---
export const generateSession = (params, user, allExercises) => {
  const availableExercises = filterExercisesByEquipment(allExercises, params.equipment);
  return {
    warmup: generateWarmup(availableExercises),
    olySection: params.includeOly ? generateOlySection(params, user, availableExercises) : null,
    bodybuildingSection: params.includeBodybuilding ? generateBodybuildingSection(params, user, availableExercises) : null,
    wods: generateWods(params, user, availableExercises),
    cooldown: params.includeFlexibility ? generateCooldown(availableExercises) : null,
  };
};
