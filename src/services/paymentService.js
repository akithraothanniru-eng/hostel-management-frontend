import api from './api'
export const paymentService = {
  getAll:          ()           => api.get('/admin/payments').then(r => r.data.data),
  getByStudent:    (id)         => api.get(`/admin/payments/student/${id}`).then(r => r.data.data),
  getByStatus:     (status)     => api.get(`/admin/payments/status/${status}`).then(r => r.data.data),
  create:          (data)       => api.post('/admin/payments', data).then(r => r.data.data),
  updateStatus:    (id, status) => api.patch(`/admin/payments/${id}/status?status=${status}`).then(r => r.data.data),
  // Student
  getMine: () => api.get('/student/payments').then(r => r.data.data),
}
