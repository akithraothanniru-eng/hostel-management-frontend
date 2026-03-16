import api from './api'
const base = '/admin/wardens'
export const wardenService = {
  getAll:  ()         => api.get(base).then(r => r.data.data),
  getById: (id)       => api.get(`${base}/${id}`).then(r => r.data.data),
  create:  (data)     => api.post(base, data).then(r => r.data.data),
  update:  (id, data) => api.put(`${base}/${id}`, data).then(r => r.data.data),
  delete:  (id)       => api.delete(`${base}/${id}`).then(r => r.data),
}
