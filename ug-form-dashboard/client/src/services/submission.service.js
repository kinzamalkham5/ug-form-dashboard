import api from './api';

export const createSubmission = (formData) =>
  api
    .post('/submissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);

export const getMySubmissions = () => api.get('/submissions/my').then((r) => r.data);
export const getSubmissionById = (id) => api.get(`/submissions/${id}`).then((r) => r.data);
