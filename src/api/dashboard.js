import apiClient from './client.js'

export const dashboardApi = {
  getKPIs: () => apiClient.get('/dashboard/kpis'),
  getEvolution: () => apiClient.get('/dashboard/evolution'),
  getNextPayments: () => apiClient.get('/dashboard/next-payments'),
}