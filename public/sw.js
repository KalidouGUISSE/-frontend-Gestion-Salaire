// Service Worker pour l'application Gestion des Salaires
const CACHE_NAME = 'gestion-salaires-v1.0.0'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Ajoutez ici vos assets critiques
]

// Ressources à ne jamais mettre en cache
const NEVER_CACHE = [
  '/api/',
  '/auth/',
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation en cours...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des ressources statiques')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erreur lors de l\'installation:', error)
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation en cours...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Suppression du cache obsolète:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activation terminée')
        return self.clients.claim()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erreur lors de l\'activation:', error)
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return
  }

  // Ignorer les ressources à ne jamais mettre en cache
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) {
    return
  }

  // Stratégie pour les requêtes API
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Stratégie pour les ressources statiques
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Stratégie par défaut pour les pages
  event.respondWith(staleWhileRevalidateStrategy(request))
})

// Stratégie Network First (pour les API)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('🌐 Service Worker: Réseau indisponible, tentative de récupération depuis le cache')
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Retourner une réponse d'erreur personnalisée pour les API
    return new Response(
      JSON.stringify({ 
        error: 'Connexion réseau indisponible',
        message: 'Veuillez vérifier votre connexion internet'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Stratégie Cache First (pour les ressources statiques)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('❌ Service Worker: Impossible de récupérer la ressource:', request.url)
    throw error
  }
}

// Stratégie Stale While Revalidate (pour les pages)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => {
      // En cas d'erreur réseau, retourner la page offline si disponible
      if (request.mode === 'navigate') {
        return caches.match('/offline.html')
      }
      throw error
    })
  
  return cachedResponse || fetchPromise
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => {
      event.ports[0].postMessage({ success: true })
    })
  }
})

// Gestion des notifications push (optionnel)
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions || []
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action) {
    // Gérer les actions spécifiques
    clients.openWindow(event.action)
  } else {
    // Ouvrir l'application
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus()
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/')
          }
        })
    )
  }
})