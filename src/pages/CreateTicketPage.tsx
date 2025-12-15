"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { api } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TicketStateBadge } from "@/components/TicketStateBadge"
import { ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react"

const MAX_TICKETS_PER_MASTER = 20

export function CreateTicketPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedMasterId, setSelectedMasterId] = useState("")
  const [selectedToolId, setSelectedToolId] = useState("")

  const { data: masters } = useQuery({
    queryKey: ["masters"],
    queryFn: api.masters.getAll,
  })

  const { data: allTickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: api.tickets.getAll,
  })

  const createMutation = useMutation({
    mutationFn: api.tickets.create,
    onSuccess: (ticket) => {
      toast.success("Ticket created successfully!")
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
      navigate(`/ticket/${ticket.id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create ticket")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMasterId || !selectedToolId) {
      toast.error("Please select a master and tool")
      return
    }
    createMutation.mutate({ masterId: selectedMasterId, toolId: selectedToolId })
  }

  const selectedMasterData = masters?.find((m) => m.id === selectedMasterId)
  const availableTools = selectedMasterData?.tools || []

  const ticketsForMaster = allTickets.filter((t) => {
    const master = masters?.find((m) => m.name === t.master)
    return master?.id === selectedMasterId
  })
  const ticketCount = ticketsForMaster.length
  const isAtLimit = ticketCount >= MAX_TICKETS_PER_MASTER
  const canCreateTicket = !isAtLimit && selectedMasterId && selectedToolId

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-4xl font-bold mb-2">Create New Ticket</h1>
          <p className="text-muted-foreground">Fill in the details to create a new ticket</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="master">Master</Label>
                <select
                  id="master"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                  value={selectedMasterId}
                  onChange={(e) => {
                    setSelectedMasterId(e.target.value)
                    setSelectedToolId("")
                  }}
                  required
                >
                  <option value="">Select a master...</option>
                  {masters?.map((master) => (
                    <option key={master.id} value={master.id}>
                      {master.name}
                    </option>
                  ))}
                </select>
                {selectedMasterId && (
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className={isAtLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {ticketCount} / {MAX_TICKETS_PER_MASTER} tickets used
                    </span>
                    {isAtLimit && (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limit reached
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tool">Tool</Label>
                <select
                  id="tool"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedToolId}
                  onChange={(e) => setSelectedToolId(e.target.value)}
                  disabled={!selectedMasterId}
                  required
                >
                  <option value="">Select a tool...</option>
                  {availableTools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </div>

              {isAtLimit && selectedMasterId && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">
                    Maximum ticket limit reached for this master ({MAX_TICKETS_PER_MASTER})
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={createMutation.isPending || !canCreateTicket}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glassmorphism h-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMasterId && selectedToolId ? (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">TKT-XXXXX</h3>
                      <p className="text-sm text-muted-foreground">
                        {availableTools.find((t) => t.id === selectedToolId)?.name || "Tool"}
                      </p>
                    </div>
                    <TicketStateBadge state="Waiting" />
                  </div>
                  <div className="p-4 rounded-lg bg-accent/50">
                    <p className="text-sm text-muted-foreground italic">
                      Job request will be added after ticket creation
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{selectedMasterData?.name || "Master"}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Fill in the form to see a preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
