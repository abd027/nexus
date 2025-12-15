"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export function CriticalWarningBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/20"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        >
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </motion.div>
        <div>
          <h3 className="font-bold text-red-900 dark:text-red-300">Critical Status Alert</h3>
          <p className="text-sm text-red-700 dark:text-red-400">
            This ticket requires immediate attention. Please review and take action.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
