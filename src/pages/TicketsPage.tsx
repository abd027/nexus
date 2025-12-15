"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/services/api"
import { TicketCard } from "@/components/TicketCard"
import { SkeletonTicketCard } from "@/components/SkeletonTicketCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

export function TicketsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [masterFilter, setMasterFilter] = useState<string>("all")
  const [toolFilter, setToolFilter] = useState<string>("all")

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: api.tickets.getAll,
    refetchInterval: 5000, // Poll every 5 seconds for live updates
  })

  const { data: masters } = useQuery({
    queryKey: ["masters"],
    queryFn: api.masters.getAll,
  })

  const filteredTickets = tickets?.filter((ticket) => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(search.toLowerCase())
    const matchesState = stateFilter === "all" || ticket.state === stateFilter
    const matchesMaster = masterFilter === "all" || ticket.master === masterFilter
    const matchesTool = toolFilter === "all" || ticket.tool === toolFilter
    return matchesSearch && matchesState && matchesMaster && matchesTool
  })

  const clearFilters = () => {
    setSearch("")
    setStateFilter("all")
    setMasterFilter("all")
    setToolFilter("all")
  }

  const hasActiveFilters = search || stateFilter !== "all" || masterFilter !== "all" || toolFilter !== "all"

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">All Tickets</h1>
        <p className="text-muted-foreground">Browse and filter all tickets across the system</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ticket number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="working">Working</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={masterFilter} onValueChange={setMasterFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Master" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Masters</SelectItem>
            {masters?.map((master) => (
              <SelectItem key={master.id} value={master.name}>
                {master.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={toolFilter} onValueChange={setToolFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tool" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tools</SelectItem>
            <SelectItem value="Jenkins">Jenkins</SelectItem>
            <SelectItem value="GitLab">GitLab</SelectItem>
            <SelectItem value="Ansible">Ansible</SelectItem>
            <SelectItem value="Docker">Docker</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="icon">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonTicketCard key={i} />
          ))}
        </div>
      ) : filteredTickets && filteredTickets.length > 0 ? (
        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={() => navigate(`/ticket/${ticket.id}`)} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tickets found matching your filters</p>
          <Button onClick={clearFilters} variant="link" className="mt-2">
            Clear filters
          </Button>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center pb-4">
        Showing {filteredTickets?.length || 0} of {tickets?.length || 0} tickets
      </div>
    </div>
  )
}
