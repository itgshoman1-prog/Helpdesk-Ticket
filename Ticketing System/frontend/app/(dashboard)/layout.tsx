'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/lib/store'
import { Sidebar } from '@/app/components/layout/Sidebar'
import { Topbar } from '@/app/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

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
