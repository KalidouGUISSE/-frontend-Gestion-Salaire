import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
    </div>
  )
}

// Modern Loading component with enhanced design
export function LoadingSpinner({ text = 'Chargement...', size = 'md', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-transparent border-t-accent animate-spin animation-delay-150"></div>
      </div>
      
      {text && (
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground animate-pulse">
            {text}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Spinner de page complète avec message
export function PageLoadingSpinner({ message = 'Chargement en cours...', className }) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50', className)}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-modern rounded-3xl flex items-center justify-center mx-auto shadow-floating">
            <Spinner size="lg" className="border-white/30 border-t-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{message}</h2>
        <p className="text-muted-foreground">Veuillez patienter quelques instants</p>
      </div>
    </div>
  )
}

// Spinner pour les cartes/sections
export function CardLoadingSpinner({ className, rows = 3 }) {
  return (
    <div className={cn('space-y-4 p-6', className)}>
      <div className="flex items-center space-x-4">
        <div className="skeleton-modern w-12 h-12 rounded-xl"></div>
        <div className="space-y-2 flex-1">
          <div className="skeleton-modern h-4 w-3/4 rounded"></div>
          <div className="skeleton-modern h-3 w-1/2 rounded"></div>
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton-modern h-4 w-full rounded"></div>
          <div className="skeleton-modern h-4 w-4/5 rounded"></div>
        </div>
      ))}
    </div>
  )
}

// Spinner pour les tableaux
export function TableLoadingSpinner({ columns = 4, rows = 5, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton-modern h-6 rounded"></div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-modern h-8 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Spinner inline pour boutons
export function ButtonLoadingSpinner({ className }) {
  return (
    <Spinner 
      size="sm" 
      className={cn('mr-2', className)} 
    />
  )
}

// Overlay de chargement
export function LoadingOverlay({ isVisible, message = 'Chargement...', className }) {
  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="glass-premium rounded-3xl p-8 shadow-floating border border-white/20 text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  )
}

// Hook pour gérer les états de chargement
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [error, setError] = useState(null)

  const startLoading = () => {
    setIsLoading(true)
    setError(null)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  const setLoadingError = (error) => {
    setIsLoading(false)
    setError(error)
  }

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError
  }
}