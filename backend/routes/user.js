const express = require('express');
const router = express.Router();
const { updateUserPRs, getAllUsers, updateUserPermissions, deleteUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.put('/prs', protect, updateUserPRs);

// --- Rutas solo para Administradores ---
router.get('/', [protect, isAdmin], getAllUsers);
router.put('/:userId/permissions', [protect, isAdmin], updateUserPermissions);
router.delete('/:userId', [protect, isAdmin], deleteUser); // <-- ¡NUEVA RUTA!

module.exports = router;
