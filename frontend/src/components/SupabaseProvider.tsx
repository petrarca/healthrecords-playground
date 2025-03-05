import { useEffect, useState } from 'react'
import { initializeSupabase, isInitialized } from '../lib/supabase'
import { OfflinePage } from './OfflinePage'

interface SupabaseProviderProps {
  readonly children: React.ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [isOnline, setIsOnline] = useState(isInitialized())
  const [isLoading, setIsLoading] = useState(!isInitialized())

  useEffect(() => {
    async function initialize() {
      try {
        await initializeSupabase()
        setIsOnline(true)
      } catch {
        setIsOnline(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (!isInitialized()) {
      initialize()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isOnline) {
    return <OfflinePage />
  }

  return <>{children}</>
}
