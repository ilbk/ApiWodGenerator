const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para proteger rutas verificando el token JWT.
 */
exports.protect = async (req, res, next) => {
  let token;

  // El token se enviará en la cabecera 'x-auth-token'
  if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }

  // Si no hay token, se niega el acceso
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadimos el usuario decodificado (con id y rol) al objeto 'req'
    // para que las siguientes funciones lo puedan usar
    req.user = decoded.user;
    next(); // Continuamos a la siguiente función/middleware
  } catch (error) {
    res.status(401).json({ msg: 'El token no es válido' });
  }
};

/**
 * Middleware para verificar si el usuario tiene el rol de 'admin'.
 * Debe usarse SIEMPRE después del middleware 'protect'.
 */
exports.isAdmin = (req, res, next) => {
    // req.user fue establecido en el middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next(); // Si es admin, continuamos
    } else {
        res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};
