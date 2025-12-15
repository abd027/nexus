import type { Ticket, Master, Tool, AuditLog, TicketState } from "@/types/ticket"

// API URL - use environment variable in production, localhost in dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      // Keep mock auth for now
      await new Promise((resolve) => setTimeout(resolve, 800))
      if (email === "admin@nexus.com" && password === "admin") {
        return { token: "fake-jwt-token", user: { email, name: "Admin User" } }
      }
      throw new Error("Invalid credentials")
    },
  },

  tickets: {
    getAll: async (): Promise<Ticket[]> => {
      return fetchAPI<Ticket[]>("/tickets")
    },

    getById: async (id: string): Promise<Ticket | null> => {
      try {
        return await fetchAPI<Ticket>(`/tickets/${id}`)
      } catch (error) {
        return null
      }
    },

    create: async (data: { masterId: string; toolId: string }): Promise<Ticket> => {
      return fetchAPI<Ticket>("/tickets", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateState: async (id: string, state: TicketState): Promise<Ticket> => {
      return fetchAPI<Ticket>(`/tickets/${id}/transition`, {
        method: "POST",
        body: JSON.stringify({ toState: state }),
      })
    },

    updateJobRequest: async (id: string, jobRequest: string): Promise<Ticket> => {
      return fetchAPI<Ticket>(`/tickets/${id}/job-request`, {
        method: "POST",
        body: JSON.stringify({ jobRequest }),
      })
    },
  },

  masters: {
    getAll: async (): Promise<Master[]> => {
      const masters = await fetchAPI<Master[]>("/masters")
      // Fetch tools and attach them to masters
      const tools = await fetchAPI<Tool[]>("/tools")
      return masters.map((master) => ({
        ...master,
        tools: tools.filter((tool) => tool.masterId === master.id),
      }))
    },
  },

  tools: {
    getAll: async (): Promise<Tool[]> => {
      return fetchAPI<Tool[]>("/tools")
    },
    create: async (masterId: string, toolName: string): Promise<Tool> => {
      return fetchAPI<Tool>("/tools", {
        method: "POST",
        body: JSON.stringify({ masterId, toolName }),
      })
    },
  },

  auditLogs: {
    getByTicketId: async (ticketId: string): Promise<AuditLog[]> => {
      return fetchAPI<AuditLog[]>(`/tickets/${ticketId}/logs`)
    },
  },
}
