import axios from 'axios'
import { appConfig, isDebugMode } from '@/config/app'

class ApiClient {
  constructor() {
    this.baseURL = appConfig.api.baseURL
    this.retryAttempts = appConfig.api.retryAttempts
    this.retryDelay = appConfig.api.retryDelay
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: appConfig.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem(appConfig.auth.tokenKey)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add request timestamp for debugging
        if (isDebugMode()) {
          config.metadata = { startTime: new Date() }
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }

        return config
      },
      (error) => {
        if (isDebugMode()) {
          console.error('❌ Request Error:', error)
        }
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (isDebugMode() && response.config.metadata) {
          const duration = new Date() - response.config.metadata.startTime
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, response.data)
        }
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (isDebugMode()) {
          console.error('❌ API Error:', error.response?.status, error.response?.data || error.message)
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          localStorage.removeItem(appConfig.auth.tokenKey)
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Handle network errors with retry
        if (!error.response && originalRequest._retryCount < this.retryAttempts) {
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
          
          if (isDebugMode()) {
            console.log(`🔄 Retrying request (${originalRequest._retryCount}/${this.retryAttempts})`)
          }

          await this.delay(this.retryDelay * originalRequest._retryCount)
          return this.client(originalRequest)
        }

        return Promise.reject(this.formatError(error))
      }
    )
  }

  formatError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        message: error.response.data?.message || error.response.statusText,
        data: error.response.data,
        type: 'server_error'
      }
    } else if (error.request) {
      // Network error
      return {
        status: 0,
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        type: 'network_error'
      }
    } else {
      // Other error
      return {
        status: 0,
        message: error.message || 'Une erreur inattendue s\'est produite',
        type: 'unknown_error'
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async request(endpoint, options = {}) {
    const config = {
      url: endpoint,
      ...options,
    }

    try {
      const response = await this.client(config)
      return response.data
    } catch (error) {
      if (isDebugMode()) {
        console.error('API request failed:', error)
      }
      throw error
    }
  }

  get(endpoint, options = {}) {    
    console.log('je  suit la endpoint',endpoint);

    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    console.log(data);
    
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

  patch(endpoint, data, options = {}) {
    console.log('bbbbbbbbbb');
    
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      data,
    })
  }
}

export default new ApiClient()