import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth/';

/**
 * Permite a un admin registrar un nuevo usuario.
 * @param {object} userData - Datos del nuevo usuario { username, email, password }.
 * @returns {Promise} La promesa de la llamada de Axios.
 */
const registerByAdmin = (userData) => {
  // Obtenemos el token del admin que está logueado
  const token = localStorage.getItem('token');
  
  return axios.post(API_URL + 'register', userData, {
    headers: {
      'x-auth-token': token,
    },
  });
};

const authService = {
  registerByAdmin,
};

export default authService;
