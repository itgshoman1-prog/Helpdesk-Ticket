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

  const ready = hasHydrated && !!user

  // Next.js App Router requires {children} to always be rendered so the
  // OuterLayoutRouter can mount. We show an overlay while the Zustand store
  // is rehydrating from localStorage instead of returning early.
  return (
    <div className="min-h-screen bg-gray-50">
      {!ready && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
        </div>
      )}
      {ready && <Sidebar />}
      {ready && <Topbar />}
      <main className={ready ? 'ml-64 pt-14 min-h-screen' : 'hidden'}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
