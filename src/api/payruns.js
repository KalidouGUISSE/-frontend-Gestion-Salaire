import apiClient from './client.js'

export const payrunsApi = {
  getAll: (params) => apiClient.get('/payruns', { params }),
  getById: (id) => apiClient.get(`/payruns/${id}`),
  create: (data) => apiClient.post('/payruns', data),
  update: (id, data) => apiClient.put(`/payruns/${id}`, data),
  delete: (id) => apiClient.delete(`/payruns/${id}`),
  approve: (id) => apiClient.patch(`/payruns/${id}/approve`),
  close: (id) => apiClient.patch(`/payruns/${id}/close`),
  generatePayslips: (id) => apiClient.post(`/payruns/${id}/generate-payslips`),
  getPayslips: (id) => apiClient.get(`/payruns/${id}/payslips`),
}