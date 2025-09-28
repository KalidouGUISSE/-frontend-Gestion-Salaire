import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async request(endpoint, options = {}) {
    const config = {
      url: endpoint,
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    }

    try {
      const response = await this.client(config)
      return response.data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  get(endpoint, options = {}) {
    console.log('je  suit la ===========00000000000000000');
    
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      data,
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      data,
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export default new ApiClient()