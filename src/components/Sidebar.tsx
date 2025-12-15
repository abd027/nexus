"use client"

import { motion } from "framer-motion"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Plus,
  Boxes,
  Ticket,
  BarChart3,
  Users,
  Palette,
  Shield,
  FileCheck,
  Settings,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/create", icon: Plus, label: "Create Ticket" },
    { to: "/tickets", icon: Ticket, label: "All Tickets" },
    { to: "/insights", icon: BarChart3, label: "Insights" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/themes", icon: Palette, label: "Themes" },
    { to: "/security", icon: Shield, label: "Security" },
    { to: "/compliance", icon: FileCheck, label: "Compliance" },
    { to: "/preferences", icon: Settings, label: "Preferences" },
    { to: "/configuration", icon: Wrench, label: "Configuration" },
  ]

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 border-r bg-card/50 backdrop-blur-sm flex flex-col"
    >
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Nexus Portal</h1>
            <p className="text-xs text-muted-foreground">Ticketing System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-accent",
                isActive && "bg-accent text-accent-foreground font-medium",
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
                {isActive && <motion.div layoutId="active-pill" className="ml-auto w-2 h-2 rounded-full bg-primary" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">v1.0.0 • Enterprise Edition</div>
      </div>
    </motion.aside>
  )
}
