// Configuration de l'application
export const appConfig = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Application Info
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Gestion des Salaires',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },

  // Security
  auth: {
    tokenKey: 'auth-token',
    refreshThreshold: parseInt(import.meta.env.VITE_JWT_REFRESH_THRESHOLD) || 300000, // 5 minutes
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
  },

  // Features
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
    pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    mockApi: import.meta.env.VITE_MOCK_API === 'true',
  },

  // External Services
  services: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  },

  // UI Configuration
  ui: {
    defaultPageSize: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}

// Validation de la configuration
export const validateConfig = () => {
  const errors = []

  if (!appConfig.api.baseURL) {
    errors.push('VITE_API_URL is required')
  }

  if (appConfig.features.errorTracking && !appConfig.services.sentryDsn) {
    console.warn('Error tracking is enabled but VITE_SENTRY_DSN is not configured')
  }

  if (appConfig.features.analytics && !appConfig.services.googleAnalyticsId) {
    console.warn('Analytics is enabled but VITE_GOOGLE_ANALYTICS_ID is not configured')
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`)
  }

  return true
}

// Helper pour vérifier l'environnement
export const isDevelopment = () => appConfig.app.environment === 'development'
export const isProduction = () => appConfig.app.environment === 'production'
export const isDebugMode = () => appConfig.features.debugMode && isDevelopment()