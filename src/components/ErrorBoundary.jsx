import { Component } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { appConfig, isDebugMode } from '@/config/app'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo
    })

    // Log to console in development
    if (isDebugMode()) {
      console.error('🚨 Error Boundary caught an error:', error, errorInfo)
    }

    // Send to error tracking service in production
    if (appConfig.features.errorTracking && appConfig.services.sentryDsn) {
      this.logErrorToService(error, errorInfo)
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Here you would integrate with your error tracking service
    // For example, Sentry, LogRocket, etc.
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('user-id') || 'anonymous',
        errorId: this.state.errorId,
        appVersion: appConfig.app.version
      }

      // Example: Send to your logging endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(err => console.error('Failed to log error:', err))
      
    } catch (loggingError) {
      console.error('Error while logging error:', loggingError)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
          <div className="w-full max-w-2xl">
            <Card className="glass-premium shadow-floating border border-white/20">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-floating">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Oups ! Une erreur s'est produite
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Nous nous excusons pour ce désagrément. L'erreur a été automatiquement signalée à notre équipe.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error ID for support */}
                <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">ID de l'erreur</p>
                      <p className="text-xs text-muted-foreground font-mono">{this.state.errorId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(this.state.errorId)}
                      className="text-xs"
                    >
                      Copier
                    </Button>
                  </div>
                </div>

                {/* Debug information (development only) */}
                {isDebugMode() && this.state.error && (
                  <details className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
                    <summary className="cursor-pointer text-sm font-medium text-destructive mb-2">
                      Détails techniques (développement)
                    </summary>
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-destructive">Message:</p>
                        <p className="text-xs text-destructive/80 font-mono bg-destructive/5 p-2 rounded mt-1">
                          {this.state.error.message}
                        </p>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <p className="text-xs font-medium text-destructive">Stack trace:</p>
                          <pre className="text-xs text-destructive/80 font-mono bg-destructive/5 p-2 rounded mt-1 overflow-auto max-h-32">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={this.handleReload}
                    className="flex-1 bg-gradient-modern hover:shadow-glow text-white font-semibold rounded-2xl h-12"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Recharger la page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="flex-1 rounded-2xl h-12 border-border/50 hover:bg-muted/50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Retour à l'accueil
                  </Button>
                </div>

                {/* Support information */}
                <div className="text-center pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Si le problème persiste, contactez le support technique avec l'ID d'erreur ci-dessus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary