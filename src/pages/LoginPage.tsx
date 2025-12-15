"use client"

import type React from "react"

import { useState, useEffect, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import gsap from "gsap"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { api } from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Boxes, Loader2 } from "lucide-react"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, logout } = useAuthStore()
  const [email, setEmail] = useState("admin@nexus.com")
  const [password, setPassword] = useState("admin")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [hasHydrated, isAuthenticated, navigate])

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Run animation when showing the form
    const ctx = gsap.context(() => {
      gsap.from(".login-card", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
    })

    return () => ctx.revert()
  }, [mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { token, user } = await api.auth.login(email, password)
      login(token, user)
      toast.success("Welcome back!")
      navigate("/")
    } catch (error) {
      toast.error("Invalid credentials. Try admin@nexus.com / admin")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600/20 via-background to-blue-600/20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, the useEffect above will handle navigation
  // Show login form while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600/20 via-background to-blue-600/20 p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="login-card w-full max-w-md">
        <Card className="shadow-2xl glassmorphism">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Boxes className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Nexus Portal</CardTitle>
            <CardDescription>Sign in to access the ticketing system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-4 p-3 rounded-lg bg-accent/50 text-xs text-center">
              <p className="font-medium mb-1">Demo Credentials</p>
              <p>Email: admin@nexus.com</p>
              <p>Password: admin</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
