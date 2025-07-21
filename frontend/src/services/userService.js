import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users/';

const getConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { 'x-auth-token': token } };
};

const updatePRs = (prData) => {
  return axios.put(API_URL + 'prs', prData, getConfig());
};

const getAllUsers = () => {
  return axios.get(API_URL, getConfig());
};

const updateUserPermissions = (userId, permissions) => {
  return axios.put(`${API_URL}${userId}/permissions`, permissions, getConfig());
};

// --- ¡NUEVA FUNCIÓN! ---
const deleteUser = (userId) => {
  return axios.delete(API_URL + userId, getConfig());
};

const userService = {
  updatePRs,
  getAllUsers,
  updateUserPermissions,
  deleteUser, // <-- La añadimos para exportarla
};

export default userService;
