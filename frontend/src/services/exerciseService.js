import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/exercises/';

// Obtiene el token del localStorage para enviarlo en las cabeceras
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'x-auth-token': token,
    },
  };
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

const updateExercise = (id, exerciseData) => {
  return axios.put(API_URL + id, exerciseData, getConfig());
};

const exerciseService = {
  getAllExercises,
  createExercise,
  deleteExercise,
  updateExercise,
};

export default exerciseService;
