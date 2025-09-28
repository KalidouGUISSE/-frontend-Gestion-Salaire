import apiClient from './client.js'

export const payslipsApi = {
  getAll: (params) => apiClient.get('/payslips', { params }),
  getById: (id) => apiClient.get(`/payslips/${id}`),
  update: (id, data) => apiClient.put(`/payslips/${id}`, data),
  exportPDF: (id) => apiClient.get(`/payslips/${id}/export-pdf`, { responseType: 'blob' }),
  batchExport: (params) => apiClient.get('/payslips/export-batch', { params, responseType: 'blob' }),
}