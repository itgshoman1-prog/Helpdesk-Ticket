'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/app/lib/store'
import api from '@/app/lib/api'
import { DashboardSummary, Ticket, STATUS_COLORS, PRIORITY_COLORS } from '@/app/lib/types'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { formatDate } from '@/app/lib/utils'
import {
  Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle,
  Plus, ClipboardCheck, TrendingUp, AlertTriangle, ArrowRight,
  Circle,
} from 'lucide-react'

function greeting(name: string) {
  const h = new Date().getHours()
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${g}, ${name}`
}

function StatCard({ label, value, icon: Icon, bg, text, sub }: {
  label: string; value: number; icon: any; bg: string; text: string; sub?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-6 h-6 ${text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-3xl font-bold text-gray-900 leading-none mb-1">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SLABadge({ ticket }: { ticket: Ticket }) {
  if (ticket.is_sla_resolution_breached) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <AlertTriangle className="w-3 h-3" /> Overdue
      </span>
    )
  }
  if (ticket.sla_resolution_due) {
    const mins = Math.floor((new Date(ticket.sla_resolution_due).getTime() - Date.now()) / 60000)
    if (mins < 120) {
      return (
        <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3" /> {mins}m left
        </span>
      )
    }
  }
  return null
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [myTickets, setMyTickets] = useState<Ticket[]>([])
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isAgent = user?.role !== 'end_user'
    const requests = [
      api.get('/reports/dashboard/'),
      api.get('/tickets/?ordering=-created_at&page_size=8'),
    ]
    if (isAgent) {
      requests.push(api.get('/tickets/?ordering=-created_at&page_size=5&assigned_to_me=true'))
    }
    Promise.all(requests).then(([sumRes, ticketsRes, myRes]) => {
      setSummary(sumRes.data)
      setRecentTickets(ticketsRes.data.results || ticketsRes.data)
      if (myRes) setMyTickets(myRes.data.results || myRes.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  const isAgent = user?.role !== 'end_user'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting(user?.first_name || 'there')}</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link href="/tickets/new">
          <Button className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={summary?.open ?? 0} icon={TicketIcon} bg="bg-blue-50" text="text-blue-600" />
        <StatCard label="Pending" value={summary?.pending ?? 0} icon={Clock} bg="bg-yellow-50" text="text-yellow-600" />
        <StatCard label="Resolved" value={summary?.resolved ?? 0} icon={CheckCircle2} bg="bg-green-50" text="text-green-600" />
        {isAgent ? (
          <StatCard label="SLA Breached" value={summary?.sla_breached ?? 0} icon={AlertCircle} bg="bg-red-50" text="text-red-600" sub="needs attention" />
        ) : (
          <StatCard label="Total Submitted" value={summary?.total ?? 0} icon={TrendingUp} bg="bg-purple-50" text="text-purple-600" />
        )}
      </div>

      {/* Agent second row */}
      {isAgent && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Assigned to Me" value={summary?.assigned_to_me ?? 0} icon={ClipboardCheck} bg="bg-purple-50" text="text-purple-600" />
          <StatCard label="New (Unread)" value={summary?.new ?? 0} icon={Circle} bg="bg-indigo-50" text="text-indigo-600" />
          <StatCard label="Closed This Month" value={summary?.closed ?? 0} icon={CheckCircle2} bg="bg-gray-50" text="text-gray-500" />
        </div>
      )}

      {/* Queue + Recent */}
      <div className={`grid gap-4 ${isAgent ? 'lg:grid-cols-5' : 'grid-cols-1'}`}>
        {/* My queue — agents only */}
        {isAgent && (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">My Queue</h2>
              <Link href="/tickets" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {myTickets.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tickets assigned to you</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {myTickets.map((t) => (
                  <Link key={t.id} href={`/tickets/${t.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                    <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                      t.priority === 'critical' ? 'bg-red-500' :
                      t.priority === 'high' ? 'bg-orange-400' :
                      t.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t.ticket_number} · {t.department_detail?.name || 'No dept'} · {formatDate(t.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <SLABadge ticket={t} />
                      <Badge className={STATUS_COLORS[t.status]}>{t.status_display}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent tickets */}
        <div className={`${isAgent ? 'lg:col-span-2' : ''} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">{isAgent ? 'Latest Activity' : 'Recent Tickets'}</h2>
            <Link href="/tickets" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-200" />
              <p className="text-sm text-gray-400 mb-3">No tickets yet</p>
              <Link href="/tickets/new">
                <Button size="sm">Submit first ticket</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTickets.slice(0, isAgent ? 6 : 8).map((t) => (
                <Link key={t.id} href={`/tickets/${t.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    t.priority === 'critical' ? 'bg-red-500' :
                    t.priority === 'high' ? 'bg-orange-400' :
                    t.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.ticket_number} · {formatDate(t.created_at)}</p>
                  </div>
                  <Badge className={`${STATUS_COLORS[t.status]} text-xs flex-shrink-0`}>{t.status_display}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
