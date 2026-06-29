'use client'
import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'

const STATUS_CHART_COLORS = ['#3b82f6', '#8b5cf6', '#6366f1', '#f59e0b', '#f97316', '#ef4444', '#22c55e', '#9ca3af', '#ec4899']
const PRIORITY_COLORS: Record<string, string> = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22c55e' }

export default function ReportsPage() {
  const [byStatus, setByStatus] = useState<any[]>([])
  const [byPriority, setByPriority] = useState<any[]>([])
  const [byDept, setByDept] = useState<any[]>([])
  const [trend, setTrend] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [sla, setSla] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/reports/tickets-by-status/'),
      api.get('/reports/tickets-by-priority/'),
      api.get('/reports/tickets-by-department/'),
      api.get('/reports/ticket-trend/?days=30'),
      api.get('/reports/agent-performance/'),
      api.get('/reports/sla-compliance/'),
    ]).then(([s, p, d, t, a, slaR]) => {
      setByStatus(s.data)
      setByPriority(p.data.map((x: any) => ({ ...x, color: PRIORITY_COLORS[x.priority] ?? '#6b7280' })))
      setByDept(d.data.slice(0, 8))
      setTrend(t.data.map((x: any) => ({ ...x, date: new Date(x.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) })))
      setAgents(a.data.slice(0, 10))
      setSla(slaR.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" /></div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
      </div>

      {sla && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total with SLA', value: sla.total, color: 'bg-blue-50 text-blue-600' },
            { label: 'SLA Compliant', value: sla.compliant, color: 'bg-green-50 text-green-600' },
            { label: 'SLA Breached', value: sla.breached, color: 'bg-red-50 text-red-600' },
            { label: 'Compliance Rate', value: `${sla.compliance_rate}%`, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tickets by Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {byStatus.map((_, i) => <Cell key={i} fill={STATUS_CHART_COLORS[i % STATUS_CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tickets by Priority</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byPriority} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="priority" fontSize={12} width={60} />
                <Tooltip />
                <Bar dataKey="count" name="Tickets" radius={[0, 4, 4, 0]}>
                  {byPriority.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Ticket Volume — Last 30 Days</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1e3a5f" strokeWidth={2} dot={false} name="Tickets" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tickets by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byDept} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="department__name" fontSize={10} width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" name="Open" fill="#3b82f6" stackId="a" />
                <Bar dataKey="resolved" name="Resolved" fill="#22c55e" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Agent Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 text-xs text-gray-500 font-semibold uppercase">Agent</th>
                    <th className="pb-2 text-xs text-gray-500 font-semibold uppercase text-right">Assigned</th>
                    <th className="pb-2 text-xs text-gray-500 font-semibold uppercase text-right">Resolved</th>
                    <th className="pb-2 text-xs text-gray-500 font-semibold uppercase text-right">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 text-gray-800">{a.assigned_to__first_name} {a.assigned_to__last_name}</td>
                      <td className="py-2 text-gray-600 text-right">{a.total}</td>
                      <td className="py-2 text-gray-600 text-right">{a.resolved}</td>
                      <td className="py-2 text-right font-medium text-green-600">
                        {a.total > 0 ? `${Math.round(a.resolved / a.total * 100)}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
