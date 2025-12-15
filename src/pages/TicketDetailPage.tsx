"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { api } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TicketStateBadge } from "@/components/TicketStateBadge"
import { CriticalWarningBanner } from "@/components/CriticalWarningBanner"
import { StateTransitionButtons } from "@/components/StateTransitionButtons"
import { AuditLogTimeline } from "@/components/AuditLogTimeline"
import { ArrowLeft, Edit2, Save, X, Package, Clock, Calendar, Lock } from "lucide-react"
import type { TicketState } from "@/types/ticket"

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditingJob, setIsEditingJob] = useState(false)
  const [editedJobRequest, setEditedJobRequest] = useState("")

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => api.tickets.getById(id!),
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5 seconds for live updates
  })

  const { data: auditLogs = [] } = useQuery({
    queryKey: ["auditLogs", id],
    queryFn: () => api.auditLogs.getByTicketId(id!),
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5 seconds for live updates
  })

  const { data: allTickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: api.tickets.getAll,
    refetchInterval: 5000, // Poll every 5 seconds for live updates
  })

  const updateStateMutation = useMutation({
    mutationFn: (newState: TicketState) => api.tickets.updateState(id!, newState),
    onSuccess: () => {
      toast.success("Ticket state updated!")
      queryClient.invalidateQueries({ queryKey: ["ticket", id] })
      queryClient.invalidateQueries({ queryKey: ["auditLogs", id] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update ticket state")
    },
  })

  const updateJobMutation = useMutation({
    mutationFn: (jobRequest: string) => api.tickets.updateJobRequest(id!, jobRequest),
    onSuccess: () => {
      toast.success("Job request updated!")
      setIsEditingJob(false)
      queryClient.invalidateQueries({ queryKey: ["ticket", id] })
      queryClient.invalidateQueries({ queryKey: ["auditLogs", id] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update job request")
    },
  })


  const handleEditJob = () => {
    setEditedJobRequest(ticket?.jobRequest || "")
    setIsEditingJob(true)
  }

  const handleSaveJob = () => {
    if (editedJobRequest.trim()) {
      updateJobMutation.mutate(editedJobRequest)
    }
  }

  const canEditJobRequest = ticket?.state === "Waiting"

  const otherCriticalTicket = allTickets.find(
    (t) => t.master === ticket?.master && t.state === "Critical" && t.id !== ticket?.id,
  )
  const hasLockIndicator = !!otherCriticalTicket && ticket?.state !== "Critical"

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ticket not found</h2>
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{ticket.ticketNumber}</h1>
        </div>
        <div className="flex items-center gap-2">
          {hasLockIndicator && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground text-sm border border-border/50">
              <Lock className="w-3.5 h-3.5" />
              <span>Locked</span>
            </div>
          )}
          <TicketStateBadge state={ticket.state} className="text-base px-4 py-2" />
        </div>
      </div>

      {ticket.isCritical && <CriticalWarningBanner />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    Master
                  </div>
                  <p className="font-semibold">{ticket.master}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    Tool
                  </div>
                  <p className="font-semibold">{ticket.tool}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Created
                  </div>
                  <p className="text-sm">{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Last Updated
                  </div>
                  <p className="text-sm">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Request</CardTitle>
                {canEditJobRequest && !isEditingJob && (
                  <Button variant="outline" size="sm" onClick={handleEditJob}>
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingJob ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedJobRequest}
                    onChange={(e) => setEditedJobRequest(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveJob} disabled={updateJobMutation.isPending} className="flex-1">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingJob(false)}
                      disabled={updateJobMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-accent/30 whitespace-pre-wrap">{ticket.jobRequest}</div>
              )}
              {!canEditJobRequest && !isEditingJob && (
                <p className="text-xs text-muted-foreground mt-3">
                  {ticket.state === "Waiting" 
                    ? "Job request is required to start monitoring. Please add a job request above."
                    : "Job request can only be edited when ticket is in Waiting state"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>State Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <StateTransitionButtons
                currentState={ticket.state}
                onTransition={(newState) => updateStateMutation.mutate(newState)}
                isLoading={updateStateMutation.isPending}
                masterId={ticket.master}
                ticketId={ticket.id}
                allTickets={allTickets}
                jobRequest={ticket.jobRequest}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <AuditLogTimeline logs={auditLogs} />
        </div>
      </div>
    </div>
  )
}
