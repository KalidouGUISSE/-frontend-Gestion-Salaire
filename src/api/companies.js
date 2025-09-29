import apiClient from './client.js'

export const companiesApi = {
  getAll: (params) => apiClient.get('/companies', { params }),
  getById: (id) => apiClient.get(`/companies/${id}`),
  create: (data) => apiClient.post('/companies', data),
  update: (id, data) => apiClient.put(`/companies/${id}`, data),
  delete: (id) => apiClient.delete(`/companies/${id}`),
  activate: (id, isActive) => apiClient.patch(`/companies/${id}/activate`, { isActive }),
}
