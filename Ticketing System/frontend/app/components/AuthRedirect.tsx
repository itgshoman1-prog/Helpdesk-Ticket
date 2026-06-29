'use client'
import { useEffect, useState } from 'react'

export function AuthRedirect() {
  // Use a local `ready` flag instead of Zustand _hasHydrated.
  // localStorage is read in useEffect (after React commits + context is set),
  // so there's no Zustand state update racing with LayoutRouterContext setup.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      window.location.replace('/login')
    } else {
      setReady(true)
    }
  }, [])

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return null
}
