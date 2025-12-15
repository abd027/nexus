"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { TicketState } from "@/types/ticket"
import { AlertCircle, Clock, Pause, Zap, CheckCircle, XCircle, Archive } from "lucide-react"

interface TicketStateBadgeProps {
  state: TicketState
  className?: string
}

const stateConfig: Record<TicketState, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  Waiting: {
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-800",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: "Waiting",
  },
  Monitoring: {
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800",
    icon: <Zap className="w-3.5 h-3.5" />,
    label: "Monitoring",
  },
  Hold: {
    color: "text-gray-700 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-950/50 border-gray-300 dark:border-gray-800",
    icon: <Pause className="w-3.5 h-3.5" />,
    label: "Hold",
  },
  Ready: {
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800",
    icon: <Zap className="w-3.5 h-3.5" />,
    label: "Ready",
  },
  Critical: {
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-800",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: "Critical",
  },
  Complete: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/50 border-green-300 dark:border-green-800",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: "Complete",
  },
  Failed: {
    color: "text-red-900 dark:text-red-300",
    bgColor: "bg-red-200 dark:bg-red-900/50 border-red-400 dark:border-red-700",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Failed",
  },
  Closed: {
    color: "text-gray-600 dark:text-gray-500",
    bgColor: "bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-700",
    icon: <Archive className="w-3.5 h-3.5" />,
    label: "Closed",
  },
}

export function TicketStateBadge({ state, className }: TicketStateBadgeProps) {
  const config = stateConfig[state]

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all",
        config.color,
        config.bgColor,
        state === "Critical" && "animate-pulse-slow",
        className,
      )}
    >
      {config.icon}
      {config.label}
    </motion.div>
  )
}
