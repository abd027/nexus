"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth"
import { useThemeStore } from "@/store/theme"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { LogOut, Moon, Sun, User } from "lucide-react"

export function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-16 border-b bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Welcome back, {user?.name}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          <Moon className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{user?.email}</span>
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </motion.header>
  )
}
