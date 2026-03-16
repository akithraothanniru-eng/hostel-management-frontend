import api from './api'
export const attendanceService = {
  // Admin
  getAll:       () => api.get('/admin/attendance').then(r => r.data.data),
  getByStudent: (id) => api.get(`/admin/attendance/student/${id}`).then(r => r.data.data),
  getByDate:    (date) => api.get(`/admin/attendance/date/${date}`).then(r => r.data.data),
  getByRange:   (id, from, to) => api.get(`/admin/attendance/student/${id}/range?from=${from}&to=${to}`).then(r => r.data.data),
  // Student
  mark:   (data) => api.post('/student/attendance', data).then(r => r.data.data),
  update: (id, data) => api.put(`/student/attendance/${id}`, data).then(r => r.data.data),
  getMine: () => api.get('/student/attendance').then(r => r.data.data),
  getMyRange: (from, to) => api.get(`/student/attendance/range?from=${from}&to=${to}`).then(r => r.data.data),
}
