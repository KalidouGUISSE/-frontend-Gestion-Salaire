// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_BASE_URL = 'http://localhost:3000' // ⬅️ au lieu de http://localhost:3000


const getHeaders = () => {
  const token = localStorage.getItem('auth-token')
  console.log('token',token);
  
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  console.log('url',url);
  
  const config = {
    headers: getHeaders(),
    ...options,
  }

  console.log('API Request:', { url, method: config.method || 'GET', headers: config.headers })

  try {
    const response = await fetch(url, config)
    console.log('API Response status:', response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Response error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const employeesApi = {
  getAll: async (params = {}) => {
    
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams ? `/employees?${queryParams}` : '/employees'
    return apiRequest(endpoint, { method: 'GET' })
  },
  getById: (id) => apiRequest(`/employees/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/employees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/employees/${id}`, { method: 'DELETE' }),
  toggleActive: (id, isActive) => apiRequest(`/employees/${id}/activate`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  }),
}
