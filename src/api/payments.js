import apiClient from './client.js'

export const paymentsApi = {
  getAll: (params) => apiClient.get('/payments', { params }),
  getById: (id) => apiClient.get(`/payments/${id}`),
  create: (data) => apiClient.post('/payments', data),
  exportReceipt: (id) => apiClient.get(`/payments/${id}/receipt`, { responseType: 'blob' }),
  batchExportReceipts: (params) => apiClient.get('/payments/receipts-batch', { params, responseType: 'blob' }),
}