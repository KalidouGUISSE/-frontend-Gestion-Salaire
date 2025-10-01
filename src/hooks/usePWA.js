import { useState, useEffect } from 'react'
import { appConfig } from '@/config/app'

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = window.navigator.standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkIfInstalled()

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Écouter l'installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    // Écouter les changements de connexion
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Enregistrer les événements
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Service Worker pour les mises à jour
    if ('serviceWorker' in navigator && appConfig.features.pwa) {
      registerServiceWorker()
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      // Vérifier les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true)
          }
        })
      })

      console.log('✅ Service Worker enregistré avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error)
    }
  }

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error)
      return false
    }
  }

  const updateApp = async () => {
    if (!updateAvailable) return

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const clearCache = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const messageChannel = new MessageChannel()
          
          return new Promise((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              resolve(event.data.success)
            }
            
            registration.active.postMessage(
              { type: 'CLEAR_CACHE' },
              [messageChannel.port2]
            )
          })
        }
      }
      
      // Fallback: clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error)
      return false
    }
  }

  const getAppInfo = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const messageChannel = new MessageChannel()
          
          return new Promise((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              resolve({
                version: event.data.version,
                isOnline,
                isInstalled,
                isInstallable,
                updateAvailable
              })
            }
            
            registration.active.postMessage(
              { type: 'GET_VERSION' },
              [messageChannel.port2]
            )
          })
        }
      }
      
      return {
        version: appConfig.app.version,
        isOnline,
        isInstalled,
        isInstallable,
        updateAvailable
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations:', error)
      return null
    }
  }

  return {
    // États
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    
    // Actions
    installApp,
    updateApp,
    clearCache,
    getAppInfo,
    
    // Utilitaires
    canInstall: isInstallable && !isInstalled,
    needsUpdate: updateAvailable,
    isOffline: !isOnline
  }
}