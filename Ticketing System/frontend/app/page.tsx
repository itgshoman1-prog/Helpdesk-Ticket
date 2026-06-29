'use client'
import { useEffect } from 'react'

// IMPORTANT: Do NOT use next/navigation router or Zustand here.
// Using redirect() (server) or router.replace() (client) triggers a Next.js
// client-side navigation which fetches RSC async → InnerLayoutRouter suspends
// before providing LayoutRouterContext → OuterLayoutRouter throws E56.
//
// window.location.replace() bypasses the App Router entirely and forces a
// full page reload. The target page is served fresh from the server with its
// RSC payload already embedded, so InnerLayoutRouter never needs to suspend.
export default function RootPage() {
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    window.location.replace(token ? '/dashboard' : '/login')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
    </div>
  )
}
