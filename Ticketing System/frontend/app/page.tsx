import { redirect } from 'next/navigation'

// Config-level redirect in next.config.ts handles / → /dashboard at the
// HTTP layer. This component acts as a fallback if config redirects are missed.
export default function RootPage() {
  redirect('/dashboard')
}
