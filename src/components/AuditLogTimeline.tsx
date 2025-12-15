"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import type { AuditLog } from "@/types/ticket"
import { Card } from "./ui/card"
import { Activity } from "lucide-react"

interface AuditLogTimelineProps {
  logs: AuditLog[]
}

export function AuditLogTimeline({ logs }: AuditLogTimelineProps) {
  return (
    <Card className="p-6 glassmorphism">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Audit Log</h3>
      </div>

      <div className="relative">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-6">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{log.action}</span>
                  <span className="text-muted-foreground">by {log.user}</span>
                </div>
                <p className="text-sm text-muted-foreground">{log.details}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}
