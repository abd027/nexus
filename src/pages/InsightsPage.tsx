"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export function InsightsPage() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: api.tickets.getAll,
    refetchInterval: 5000, // Poll every 5 seconds for live updates
  })

  const stats = {
    byState: {
      ready: tickets?.filter((t) => t.state === "Ready").length || 0,
      monitoring: tickets?.filter((t) => t.state === "Monitoring").length || 0,
      critical: tickets?.filter((t) => t.state === "Critical").length || 0,
      complete: tickets?.filter((t) => t.state === "Complete").length || 0,
    },
    byMaster: tickets?.reduce(
      (acc, ticket) => {
        acc[ticket.master] = (acc[ticket.master] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    avgResolutionTime: "2.4 days",
    criticalTickets: tickets?.filter((t) => t.isCritical).length || 0,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Insights</h1>
        <p className="text-muted-foreground">Analytics and performance metrics</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-12 w-12 mb-4" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
              <p className="text-3xl font-bold">{tickets?.length || 0}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold">{stats.byState.complete}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Avg Resolution</p>
              <p className="text-3xl font-bold">{stats.avgResolutionTime}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Critical</p>
              <p className="text-3xl font-bold">{stats.criticalTickets}</p>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tickets by State</h3>
              <div className="space-y-3">
                {Object.entries(stats.byState).map(([state, count]) => (
                  <div key={state} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{state}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(count / (tickets?.length || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tickets by Master</h3>
              <div className="space-y-3">
                {Object.entries(stats.byMaster || {}).map(([master, count]) => (
                  <div key={master} className="flex items-center justify-between">
                    <span className="text-sm">{master}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(count / (tickets?.length || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
