import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, access: string, refresh: string) => void
  clearAuth: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        set({ user, accessToken, refreshToken })
      },
      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, accessToken: null, refreshToken: null })
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      // No onRehydrateStorage — the callback fired set() synchronously during
      // Zustand's persist hydration, which happened while Next.js's hydrateRoot()
      // was running inside React.startTransition(). That synchronous set() had
      // higher priority than the transition, interrupting the hydration at a point
      // where LayoutRouterContext.Provider had not yet committed. OuterLayoutRouter
      // ran in that window and got null context → E56 invariant.
      // Auth checks now use localStorage directly (AuthRedirect, login page).
    }
  )
)
