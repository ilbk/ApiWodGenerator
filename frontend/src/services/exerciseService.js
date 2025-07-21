import axios from 'axios';

const API_URL = 'http://localhost:5001/api/exercises/';

const getConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { 'x-auth-token': token } };
};

const getAllExercises = () => {
  return axios.get(API_URL);
};

const createExercise = (exerciseData) => {
  return axios.post(API_URL, exerciseData, getConfig());
};

const deleteExercise = (id) => {
  return axios.delete(API_URL + id, getConfig());
};

// --- ¡NUEVA FUNCIÓN! ---
const updateExercise = (id, exerciseData) => {
  return axios.put(API_URL + id, exerciseData, getConfig());
};

const exerciseService = {
  getAllExercises,
  createExercise,
  deleteExercise,
  updateExercise, // <-- La añadimos para exportarla
};

export default exerciseService;
