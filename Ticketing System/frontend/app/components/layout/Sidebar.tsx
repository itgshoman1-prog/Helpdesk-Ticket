'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/app/lib/utils'
import { useAuthStore } from '@/app/lib/store'
import api from '@/app/lib/api'
import { SystemSettings } from '@/app/lib/types'
import {
  LayoutDashboard, Ticket, Users, Building2, BarChart3,
  Settings, ClipboardList, Shield,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['end_user', 'agent', 'manager', 'admin'] },
  { href: '/tickets', label: 'My Tickets', icon: Ticket, roles: ['end_user'] },
  { href: '/tickets', label: 'Tickets', icon: ClipboardList, roles: ['agent', 'manager', 'admin'] },
  { href: '/departments', label: 'Departments', icon: Building2, roles: ['manager', 'admin'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['admin'] },
  { href: '/reports', label: 'Reports', icon: BarChart3, roles: ['manager', 'admin'] },
  { href: '/audit', label: 'Audit Log', icon: Shield, roles: ['admin'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'end_user'
  const [branding, setBranding] = useState<Pick<SystemSettings, 'company_name' | 'portal_name' | 'company_logo_url' | 'primary_color'> | null>(null)

  useEffect(() => {
    api.get('/branding/').then((r) => setBranding(r.data)).catch(() => {})
  }, [])

  const visible = navItems.filter((item) => item.roles.includes(role))
  const bgColor = branding?.primary_color || '#1e3a5f'

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 text-white flex flex-col" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        {branding?.company_logo_url ? (
          <img src={branding.company_logo_url} alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
        ) : (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Ticket className="w-5 h-5" style={{ color: bgColor }} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight truncate">{branding?.portal_name || 'Helpdesk'}</p>
          <p className="text-xs text-white/60 truncate">{branding?.company_name || 'Ticketing System'}</p>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {visible.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {(user.first_name?.[0] ?? '?').toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.full_name}</p>
              <p className="text-xs text-white/60 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
