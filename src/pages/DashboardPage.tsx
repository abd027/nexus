"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/services/api"
import { TicketCard } from "@/components/TicketCard"
import { SkeletonTicketCard } from "@/components/SkeletonTicketCard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ChevronRight, RefreshCw, Wrench, AlertCircle, ServerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [expandedMasters, setExpandedMasters] = useState<Set<string>>(new Set())
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false)
  const [selectedMasterId, setSelectedMasterId] = useState<string>("")
  const [newToolName, setNewToolName] = useState("")

  const {
    data: tickets,
    isLoading: isLoadingTickets,
    error: ticketsError,
    refetch,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: api.tickets.getAll,
    refetchInterval: 5000, // Poll every 5s
    retry: false,
  })

  const { 
    data: masters, 
    isLoading: isLoadingMasters,
    error: mastersError 
  } = useQuery({
    queryKey: ["masters"],
    queryFn: api.masters.getAll,
    retry: false,
  })

  const createToolMutation = useMutation({
    mutationFn: ({ masterId, toolName }: { masterId: string; toolName: string }) =>
      api.tools.create(masterId, toolName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masters"] })
      toast.success("Tool created", {
        description: "The new tool has been added successfully.",
      })
      setIsAddToolDialogOpen(false)
      setNewToolName("")
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message,
      })
    },
  })

  useEffect(() => {
    if (masters) {
      setExpandedMasters(new Set(masters.map((m) => m.name)))
    }
  }, [masters])

  const toggleMaster = (masterName: string) => {
    setExpandedMasters((prev) => {
      const next = new Set(prev)
      if (next.has(masterName)) {
        next.delete(masterName)
      } else {
        next.add(masterName)
      }
      return next
    })
  }

  const handleAddTool = (masterId: string) => {
    setSelectedMasterId(masterId)
    setIsAddToolDialogOpen(true)
  }

  const handleSubmitTool = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newToolName.trim()) {
      toast.error("Error", {
        description: "Tool name cannot be empty.",
      })
      return
    }
    createToolMutation.mutate({ masterId: selectedMasterId, toolName: newToolName.trim() })
  }

  const groupedTickets = tickets?.reduce(
    (acc, ticket) => {
      if (!acc[ticket.master]) {
        acc[ticket.master] = []
      }
      acc[ticket.master].push(ticket)
      return acc
    },
    {} as Record<string, typeof tickets>,
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor all tickets across masters</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()} size="lg">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={() => navigate("/create")} size="lg">
            <Plus className="w-4 h-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {(ticketsError || mastersError) ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ServerOff className="w-5 h-5" />
              Backend Connection Error
            </CardTitle>
            <CardDescription>
              Unable to connect to the API server. Please check your backend configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-destructive/10 p-4 space-y-2">
              <p className="text-sm font-medium">Error Details:</p>
              <p className="text-sm text-muted-foreground">
                {ticketsError?.message || mastersError?.message || "Failed to fetch data from backend"}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">Troubleshooting:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure the backend server is running on port 5000</li>
                <li>Check that the API_URL environment variable is set correctly</li>
                <li>For Vercel deployment, ensure VITE_API_URL points to your deployed backend</li>
                <li>Verify CORS settings allow requests from your frontend domain</li>
              </ul>
            </div>
            <Button onClick={() => { refetch(); queryClient.invalidateQueries({ queryKey: ["masters"] }) }} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      ) : isLoadingTickets || isLoadingMasters ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonTicketCard key={i} />
          ))}
        </div>
      ) : !masters || masters.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Masters Found</CardTitle>
            <CardDescription>
              No masters have been configured yet. Please set up your backend data.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {masters.map((master) => (
            <div key={master.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleMaster(master.name)}
                  className={cn(
                    "flex items-center gap-2 text-xl font-semibold hover:text-primary transition-colors",
                    "group",
                  )}
                >
                  <motion.div
                    animate={{ rotate: expandedMasters.has(master.name) ? 90 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                  <span>{master.name}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    ({groupedTickets?.[master.name]?.length || 0} tickets)
                  </span>
                </button>
                <Button variant="outline" size="sm" onClick={() => handleAddTool(master.id)} className="gap-2">
                  <Wrench className="w-4 h-4" />
                  Add Tool
                </Button>
              </div>

              <AnimatePresence>
                {expandedMasters.has(master.name) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    {groupedTickets?.[master.name]?.length === 0 ? (
                      <div className="pl-7 pt-6">
                        <Card className="border-dashed">
                          <CardContent className="flex flex-col items-center justify-center py-8">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No tickets for this master yet</p>
                            <Button 
                              variant="outline" 
                              className="mt-4" 
                              onClick={() => navigate("/create")}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create First Ticket
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-7 pt-6">
                        <AnimatePresence mode="popLayout">
                          {groupedTickets?.[master.name]?.map((ticket) => (
                            <TicketCard
                              key={ticket.id}
                              ticket={ticket}
                              onClick={() => navigate(`/ticket/${ticket.id}`)}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tool</DialogTitle>
            <DialogDescription>
              Create a new tool for {masters?.find((m) => m.id === selectedMasterId)?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitTool}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="toolName">Tool Name</Label>
                <Input
                  id="toolName"
                  placeholder="e.g., Tool-A3"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddToolDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createToolMutation.isPending}>
                {createToolMutation.isPending ? "Creating..." : "Create Tool"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
