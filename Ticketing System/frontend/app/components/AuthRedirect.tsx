'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/app/lib/store'

export function AuthRedirect() {
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)

  useEffect(() => {
    // Use window.location to avoid touching the Next.js client router while
    // the LayoutRouterContext is still being initialised (avoids E56 invariant).
    if (hasHydrated && !user) window.location.replace('/login')
  }, [hasHydrated, user])

  if (!hasHydrated) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return null
}
