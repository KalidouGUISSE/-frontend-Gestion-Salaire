import apiClient from './client.js'

export const usersApi = {
  getAll: (params) => apiClient.get('users', { params }),
  getById: (id) => apiClient.get(`users/${id}`),
  create: (data) => apiClient.post('users', data),
  update: (id, data) => apiClient.put(`users/${id}`, data),
  delete: (id) => apiClient.delete(`users/${id}`),
}