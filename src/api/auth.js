import apiClient from './client.js'

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/users', userData),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
}