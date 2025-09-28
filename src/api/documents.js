import apiClient from './client.js'

export const documentsApi = {
  getAll: (params) => apiClient.get('/documents', { params }),
  getById: (id) => apiClient.get(`/documents/${id}`),
  download: (id) => apiClient.get(`/documents/${id}/download`, { responseType: 'blob' }),
}