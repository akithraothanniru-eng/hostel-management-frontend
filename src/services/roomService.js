import api from './api'
export const roomService = {
  getAll:      ()         => api.get('/admin/rooms').then(r => r.data.data),
  getAvailable:()         => api.get('/admin/rooms/available').then(r => r.data.data),
  getById:     (id)       => api.get(`/admin/rooms/${id}`).then(r => r.data.data),
  create:      (data)     => api.post('/admin/rooms', data).then(r => r.data.data),
  update:      (id, data) => api.put(`/admin/rooms/${id}`, data).then(r => r.data.data),
  delete:      (id)       => api.delete(`/admin/rooms/${id}`).then(r => r.data),
  // Warden
  wardenGetAll:      ()   => api.get('/warden/rooms').then(r => r.data.data),
  wardenGetAvailable:()   => api.get('/warden/rooms/available').then(r => r.data.data),
}
