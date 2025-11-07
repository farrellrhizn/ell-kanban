import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export const fetchColumns = () => api.get('/api/columns');
export const fetchTasks = () => api.get('/api/tasks');
export const createTask = (payload) => api.post('/api/tasks', payload);
export const updateTask = (id, payload) => api.patch(`/api/tasks/${id}`, payload);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;
