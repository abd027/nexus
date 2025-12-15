"use client"

import type React from "react"

import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { useAuthStore } from "./store/auth"
import { useThemeStore } from "./store/theme"
import { AppLayout } from "./components/AppLayout"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { CreateTicketPage } from "./pages/CreateTicketPage"
import { TicketDetailPage } from "./pages/TicketDetailPage"
import { TicketsPage } from "./pages/TicketsPage"
import { InsightsPage } from "./pages/InsightsPage"
import { UsersPage } from "./pages/UsersPage"
import { ThemesPage } from "./pages/ThemesPage"
import { SecurityPage } from "./pages/SecurityPage"
import { CompliancePage } from "./pages/CompliancePage"
import { PreferencesPage } from "./pages/PreferencesPage"
import { ConfigurationPage } from "./pages/ConfigurationPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Enable refetch when window regains focus for live updates
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const location = useLocation()
  
  // Always allow access to login page
  if (location.pathname === '/login') {
    return <>{children}</>
  }
  
  // Wait for store to hydrate before checking authentication
  if (!hasHydrated) {
    return null // or a loading spinner
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const theme = useThemeStore((state) => state.theme)
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Ensure hydration is marked as complete after mount
  useEffect(() => {
    // Small delay to ensure persist middleware has run
    const timer = setTimeout(() => {
      setHasHydrated(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [setHasHydrated])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="create" element={<CreateTicketPage />} />
            <Route path="ticket/:id" element={<TicketDetailPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="themes" element={<ThemesPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="configuration" element={<ConfigurationPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}

export default App
