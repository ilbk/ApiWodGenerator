const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Reglas de validación para el registro
const registerValidationRules = [
  body('email', 'Por favor, incluye un email válido').isEmail().normalizeEmail(),
  body('username', 'El nombre de usuario debe tener al menos 3 caracteres').isLength({ min: 3 }).trim().escape(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
];

// --- ¡NUEVAS REGLAS DE VALIDACIÓN PARA EL LOGIN! ---
const loginValidationRules = [
    body('email', 'Por favor, incluye un email válido').isEmail().normalizeEmail(),
    body('password', 'La contraseña no puede estar vacía').not().isEmpty()
];

// --- Rutas ---

router.post('/register', 
  [protect, isAdmin],
  registerValidationRules,
  registerUser
);

// Aplicamos las nuevas reglas a la ruta de login
router.post('/login', loginValidationRules, loginUser);

router.get('/me', protect, getMe);

module.exports = router;
