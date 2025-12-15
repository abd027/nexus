export type TicketState = "Waiting" | "Monitoring" | "Hold" | "Ready" | "Critical" | "Complete" | "Failed" | "Closed"

export interface Ticket {
  id: string
  ticketNumber: string
  master: string
  tool: string
  state: TicketState
  jobRequest: string
  createdAt: string
  updatedAt: string
  isCritical: boolean
}

export interface Master {
  id: string
  name: string
  tools: Tool[]
}

export interface Tool {
  id: string
  name: string
  masterId: string
}

export interface AuditLog {
  id: string
  ticketId: string
  action: string
  user: string
  timestamp: string
  details: string
}

export interface CreateTicketRequest {
  master: string
  tool: string
  jobRequest: string
}
