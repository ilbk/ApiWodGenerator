const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createExercise,
  getAllExercises,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');

// Rutas Públicas (cualquiera puede acceder)
router.get('/', getAllExercises);

// Rutas Privadas (solo administradores)
// Para acceder a estas rutas, se debe pasar por 'protect' y luego por 'isAdmin'.
router.post('/', [protect, isAdmin], createExercise);
router.put('/:id', [protect, isAdmin], updateExercise);
router.delete('/:id', [protect, isAdmin], deleteExercise);

module.exports = router;
