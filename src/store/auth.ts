import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  hasHydrated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

// Standard localStorage wrapper
const customStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // Ignore errors
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      // Ignore errors
    }
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "nexus-auth",
      storage: createJSONStorage(() => customStorage),
      onRehydrateStorage: () => (state) => {
        // Ensure isAuthenticated is true if token exists
        if (state?.token) {
          state.isAuthenticated = true
        }
        state?.setHasHydrated(true)
      },
    },
  ),
)
