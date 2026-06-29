'use client'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/app/components/layout/Sidebar'
import { Topbar } from '@/app/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // useEffect runs after React has committed the initial render, so the
    // hydration transition is complete and all routing contexts are stable.
    // Hiding {children} until this point keeps OuterLayoutRouter (which wraps
    // the page) out of the tree during the hazardous hydration window.
    const token = localStorage.getItem('access_token')
    if (!token) {
      window.location.replace('/login')
    } else {
      setReady(true)
    }
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
