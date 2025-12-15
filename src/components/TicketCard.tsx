"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import type { Ticket } from "@/types/ticket"
import { TicketStateBadge } from "./TicketStateBadge"
import { Card } from "./ui/card"
import { Package, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketCardProps {
  ticket: Ticket
  onClick: () => void
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          "cursor-pointer hover:shadow-2xl transition-all duration-300 glassmorphism overflow-hidden",
          ticket.isCritical && "border-red-500 dark:border-red-600 shadow-red-500/20",
        )}
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{ticket.ticketNumber}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>{ticket.tool}</span>
              </div>
            </div>
            <TicketStateBadge state={ticket.state} />
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ticket.jobRequest}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">{ticket.master}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
