import api from './api'
export const foodMenuService = {
  getAll:         () => api.get('/admin/food-menu').then(r => r.data.data),
  createOrUpdate: (data) => api.post('/admin/food-menu', data).then(r => r.data.data),
  // Student
  studentGetAll:  () => api.get('/student/food-menu').then(r => r.data.data),
  studentGetDay:  (day) => api.get(`/student/food-menu/${day}`).then(r => r.data.data),
}
