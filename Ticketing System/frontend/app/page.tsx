import { redirect } from 'next/navigation'

// Server-side redirect — no client JS needed, no routing context required.
// Unauthenticated users land on /login.
// The login page redirects already-authenticated users to /dashboard.
export default function RootPage() {
  redirect('/login')
}
