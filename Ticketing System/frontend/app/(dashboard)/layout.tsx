'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/lib/store'
import { Sidebar } from '@/app/components/layout/Sidebar'
import { Topbar } from '@/app/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)

  useEffect(() => {
    if (hasHydrated && !user) router.replace('/login')
  }, [hasHydrated, user, router])

  // IMPORTANT: {children} must always be rendered so Next.js App Router can
  // mount OuterLayoutRouter and keep the LayoutRouterContext intact.
  // A fixed spinner overlay covers the content while Zustand rehydrates.
  return (
    <div className="min-h-screen bg-gray-50">
      {!hasHydrated && (
        <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
        </div>
      )}
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
