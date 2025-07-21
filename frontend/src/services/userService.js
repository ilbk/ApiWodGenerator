import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/users/';

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

const deleteUser = (userId) => {
  return axios.delete(API_URL + userId, getConfig());
};

const updateUser = (userId, userData) => {
  return axios.put(API_URL + userId, userData, getConfig());
};

const userService = {
  updatePRs,
  getAllUsers,
  updateUserPermissions,
  deleteUser,
  updateUser,
};

export default userService;
