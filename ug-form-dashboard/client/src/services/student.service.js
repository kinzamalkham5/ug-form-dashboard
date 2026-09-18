import api from './api';

export const getProfile = () => api.get('/students/profile').then((r) => r.data);
export const updateProfile = (data) => api.put('/students/profile', data).then((r) => r.data);
export const getDashboardStats = () => api.get('/students/dashboard-stats').then((r) => r.data);
