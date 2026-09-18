import api from './api';

export const registerStudent = (data) => api.post('/auth/register', data).then((r) => r.data);

export const loginStudent = (data) => api.post('/auth/login', data).then((r) => r.data);

export const loginAdmin = (data) => api.post('/auth/admin/login', data).then((r) => r.data);

export const getMe = () => api.get('/auth/me').then((r) => r.data);

export const changePassword = (data) => api.put('/auth/change-password', data).then((r) => r.data);
