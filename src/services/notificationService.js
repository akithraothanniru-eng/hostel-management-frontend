import api from './api'
export const notificationService = {
  getAll:  () => api.get('/admin/notifications').then(r => r.data.data),
  send:    (data) => api.post('/admin/notifications', data).then(r => r.data.data),
  delete:  (id) => api.delete(`/admin/notifications/${id}`).then(r => r.data),
  // Warden
  wardenGetAll: () => api.get('/warden/notifications').then(r => r.data.data),
  wardenSend:   (data) => api.post('/warden/notifications', data).then(r => r.data.data),
  // Student
  studentGetAll: () => api.get('/student/notifications').then(r => r.data.data),
}
