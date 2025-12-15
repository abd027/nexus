"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { TicketState } from "@/types/ticket"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { ArrowRight, Pause, Play, AlertTriangle, CheckCircle, XCircle, Archive, Lock } from "lucide-react"

interface StateTransitionButtonsProps {
  currentState: TicketState
  onTransition: (newState: TicketState) => void
  isLoading: boolean
  masterId?: string
  ticketId?: string
  allTickets?: Array<{ id: string; master: string; state: TicketState; ticketNumber?: string }>
  jobRequest?: string
}

// Exact transition rules as per requirements
const transitions: Record<TicketState, TicketState[]> = {
  Waiting: ["Monitoring"],
  Monitoring: ["Ready", "Hold"],
  Hold: ["Monitoring"],
  Ready: ["Critical"],
  Critical: ["Complete", "Failed"],
  Complete: ["Closed"],
  Failed: ["Closed"],
  Closed: [],
}

const stateIcons: Record<TicketState, React.ReactNode> = {
  Waiting: <Play className="w-4 h-4" />,
  Monitoring: <ArrowRight className="w-4 h-4" />,
  Hold: <Pause className="w-4 h-4" />,
  Ready: <ArrowRight className="w-4 h-4" />,
  Critical: <AlertTriangle className="w-4 h-4" />,
  Complete: <CheckCircle className="w-4 h-4" />,
  Failed: <XCircle className="w-4 h-4" />,
  Closed: <Archive className="w-4 h-4" />,
}

export function StateTransitionButtons({
  currentState,
  onTransition,
  isLoading,
  masterId,
  ticketId,
  allTickets = [],
  jobRequest = "",
}: StateTransitionButtonsProps) {
  const availableTransitions = transitions[currentState]

  const checkCriticalLock = (targetState: TicketState): { isLocked: boolean; lockingTicketNumber?: string } => {
    if (targetState !== "Critical") {
      return { isLocked: false }
    }

    // Find ticket by master name (since allTickets have master as string name)
    const currentTicket = allTickets.find((t) => t.id === ticketId)
    if (!currentTicket) return { isLocked: false }

    const criticalTicket = allTickets.find(
      (t) => t.master === currentTicket.master && t.state === "Critical" && t.id !== ticketId
    )

    return {
      isLocked: !!criticalTicket,
      lockingTicketNumber: criticalTicket?.ticketNumber,
    }
  }

  const checkJobRequestRequired = (targetState: TicketState): boolean => {
    // Waiting → Monitoring requires jobRequest
    return currentState === "Waiting" && targetState === "Monitoring" && (!jobRequest || jobRequest.trim() === "")
  }

  if (availableTransitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-4">
        No state transitions available for closed tickets.
      </div>
    )
  }

  return (
    <TooltipProvider>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3">
        {availableTransitions.map((state) => {
          const { isLocked, lockingTicketNumber } = checkCriticalLock(state)
          const needsJobRequest = checkJobRequestRequired(state)
          const isDisabled = isLoading || isLocked || needsJobRequest

          const button = (
            <Button
              key={state}
              onClick={() => !isLocked && !needsJobRequest && onTransition(state)}
              disabled={isDisabled}
              variant={state === "Critical" || state === "Failed" ? "destructive" : "default"}
              className={`transition-all ${!isLocked && !needsJobRequest ? "hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
            >
              {isLocked || needsJobRequest ? <Lock className="w-4 h-4" /> : stateIcons[state]}
              Move to {state}
            </Button>
          )

          if (isLocked && lockingTicketNumber) {
            return (
              <Tooltip key={state}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Another ticket ({lockingTicketNumber}) for this master is already in Critical state. One master can only have one critical ticket.
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          }

          if (needsJobRequest) {
            return (
              <Tooltip key={state}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Job request is required to start monitoring. Please add a job request first.
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          }

          return button
        })}
      </motion.div>
    </TooltipProvider>
  )
}
