import { Sidebar } from '@/app/components/layout/Sidebar'
import { Topbar } from '@/app/components/layout/Topbar'
import { AuthRedirect } from '@/app/components/AuthRedirect'

// Server component — no 'use client'.
// Next.js injects LayoutRouterContext into the RSC tree before this renders,
// so OuterLayoutRouter inside {children} always finds its context.
// Auth logic lives in AuthRedirect (a client component) so it never prevents
// {children} from being part of the React tree.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthRedirect />
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
