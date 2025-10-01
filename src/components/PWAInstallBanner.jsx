import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePWA } from '@/hooks/usePWA'
import { cn } from '@/lib/utils'

export default function PWAInstallBanner({ className }) {
  const { canInstall, installApp, isOffline, updateAvailable, updateApp } = usePWA()
  const [isInstalling, setIsInstalling] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await installApp()
      if (success) {
        setIsDismissed(true)
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateApp()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Stocker la préférence pour ne pas réafficher pendant cette session
    sessionStorage.setItem('pwa-banner-dismissed', 'true')
  }

  // Ne pas afficher si déjà installé, dismissé, ou si la session a été dismissée
  if (isDismissed || sessionStorage.getItem('pwa-banner-dismissed')) {
    return null
  }

  // Banner de mise à jour disponible
  if (updateAvailable) {
    return (
      <Card className={cn('fixed bottom-4 left-4 right-4 z-50 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-modern rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Mise à jour disponible</p>
                <p className="text-sm text-muted-foreground">Une nouvelle version est prête à être installée</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="text-xs"
              >
                Plus tard
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-gradient-modern hover:shadow-glow text-white text-xs"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Mise à jour...
                  </div>
                ) : (
                  'Mettre à jour'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Banner d'installation
  if (canInstall) {
    return (
      <Card className={cn('fixed bottom-4 left-4 right-4 z-50 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-modern rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Installer l'application</p>
                <p className="text-sm text-muted-foreground">Accès rapide depuis votre écran d'accueil</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="text-xs"
              >
                Non merci
              </Button>
              <Button
                size="sm"
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-gradient-modern hover:shadow-glow text-white text-xs"
              >
                {isInstalling ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Installation...
                  </div>
                ) : (
                  'Installer'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Banner hors ligne
  if (isOffline) {
    return (
      <Card className={cn('fixed bottom-4 left-4 right-4 z-50 border-warning/20 bg-gradient-to-r from-warning/5 to-orange-500/5', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-warning to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.196l1.414 1.414M12 21.804l1.414-1.414M2.196 12l1.414 1.414M21.804 12l-1.414 1.414" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Mode hors ligne</p>
                <p className="text-sm text-muted-foreground">Certaines fonctionnalités peuvent être limitées</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-xs"
            >
              Compris
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}