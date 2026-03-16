import api from './api'
export const complaintService = {
  // Admin / Warden
  getAll:       ()           => api.get('/admin/complaints').then(r => r.data.data),
  getById:      (id)         => api.get(`/admin/complaints/${id}`).then(r => r.data.data),
  getByStatus:  (status)     => api.get(`/admin/complaints/status/${status}`).then(r => r.data.data),
  updateStatus: (id, status) => api.patch(`/admin/complaints/${id}/status?status=${status}`).then(r => r.data.data),
  delete:       (id)         => api.delete(`/admin/complaints/${id}`).then(r => r.data),
  // Warden
  wardenGetAll:       ()           => api.get('/warden/complaints').then(r => r.data.data),
  wardenUpdateStatus: (id, status) => api.patch(`/warden/complaints/${id}/status?status=${status}`).then(r => r.data.data),
  // Student
  raise:    (data) => api.post('/student/complaints', data).then(r => r.data.data),
  getMine:  ()     => api.get('/student/complaints').then(r => r.data.data),
}
