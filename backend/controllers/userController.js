const User = require('../models/User');

/**
 * @desc    Actualizar los PRs de un usuario
 * @route   PUT /api/users/prs
 * @access  Private
 */
exports.updateUserPRs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    user.personalRecords = { ...user.personalRecords, ...req.body };
    
    await user.save();

    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    res.json(userToReturn);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

/**
 * @desc    Obtener todos los usuarios (solo para Admin)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

/**
 * @desc    Actualizar los permisos de un usuario (solo para Admin)
 * @route   PUT /api/users/:userId/permissions
 * @access  Private (Admin)
 */
exports.updateUserPermissions = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    if (!user.permissions) {
      user.permissions = {};
    }

    user.permissions = { ...user.permissions, ...req.body };
    
    await user.save();
    
    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    res.json(userToReturn);

  } catch (error)
 {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

/**
 * ¡NUEVA FUNCIÓN!
 * @desc    Eliminar un usuario (solo para Admin)
 * @route   DELETE /api/users/:userId
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Un administrador no se puede eliminar a sí mismo
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({ msg: 'No puedes eliminar tu propia cuenta de administrador.' });
    }
    
    await user.deleteOne();
    
    res.json({ msg: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};
