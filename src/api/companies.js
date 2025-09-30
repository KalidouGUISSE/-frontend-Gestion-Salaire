import apiClient from './client.js'

export const companiesApi = {
  getAll: (params) => apiClient.get('/company', { params }),
  getById: (id) => apiClient.get(`/company/${id}`),
  create: (data) => apiClient.post('/company', data),
  update: (id, data) => apiClient.put(`/company/${id}`, data),
  delete: (id) => apiClient.delete(`/company/${id}`),
  activate: (id, isActive) => apiClient.patch(`/company/${id}/activate`, { isActive }),
}
