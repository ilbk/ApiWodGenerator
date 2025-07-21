const Exercise = require('../models/Exercise');

// @desc    Crear un nuevo ejercicio
// @route   POST /api/exercises
// @access  Private (Admin)
exports.createExercise = async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    const exercise = await newExercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// @desc    Obtener todos los ejercicios
// @route   GET /api/exercises
// @access  Public
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// @desc    Actualizar un ejercicio por su ID
// @route   PUT /api/exercises/:id
// @access  Private (Admin)
exports.updateExercise = async (req, res) => {
  try {
    let exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ msg: 'Ejercicio no encontrado' });
    }

    exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exercise);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// @desc    Eliminar un ejercicio por su ID
// @route   DELETE /api/exercises/:id
// @access  Private (Admin)
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ msg: 'Ejercicio no encontrado' });
    }

    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
