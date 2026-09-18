import api from './api';

export const getAdminDashboardStats = () => api.get('/admin/dashboard-stats').then((r) => r.data);
export const getStudents = (params) => api.get('/admin/students', { params }).then((r) => r.data);
export const getStudentById = (id) => api.get(`/admin/students/${id}`).then((r) => r.data);
export const getAdminSubmissions = (params) =>
  api.get('/admin/submissions', { params }).then((r) => r.data);
export const approveSubmission = (id) =>
  api.put(`/admin/submissions/${id}/approve`).then((r) => r.data);
export const rejectSubmission = (id, reason) =>
  api.put(`/admin/submissions/${id}/reject`, { reason }).then((r) => r.data);
export const allowResubmission = (id) =>
  api.put(`/admin/submissions/${id}/allow-resubmission`).then((r) => r.data);
