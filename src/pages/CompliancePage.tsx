"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Search, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const mockAuditLogs = [
  {
    id: 1,
    action: "Ticket Created",
    user: "John Smith",
    resource: "TCK-001",
    timestamp: new Date(Date.now() - 3600000),
    status: "Success",
  },
  {
    id: 2,
    action: "State Changed",
    user: "Sarah Johnson",
    resource: "TCK-002",
    timestamp: new Date(Date.now() - 7200000),
    status: "Success",
  },
  {
    id: 3,
    action: "User Login",
    user: "Mike Davis",
    resource: "Auth System",
    timestamp: new Date(Date.now() - 10800000),
    status: "Success",
  },
  {
    id: 4,
    action: "Ticket Deleted",
    user: "Admin",
    resource: "TCK-003",
    timestamp: new Date(Date.now() - 14400000),
    status: "Warning",
  },
  {
    id: 5,
    action: "Password Changed",
    user: "Emily Brown",
    resource: "User Settings",
    timestamp: new Date(Date.now() - 86400000),
    status: "Success",
  },
]

export function CompliancePage() {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Compliance</h1>
          <p className="text-muted-foreground">Audit logs and compliance reporting</p>
        </div>
        <Button>
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Total Events</h3>
          </div>
          <p className="text-3xl font-bold">{mockAuditLogs.length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold">Today</h3>
          </div>
          <p className="text-3xl font-bold">4</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-semibold">Warnings</h3>
          </div>
          <p className="text-3xl font-bold">1</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="Ticket Created">Ticket Created</SelectItem>
            <SelectItem value="State Changed">State Changed</SelectItem>
            <SelectItem value="User Login">User Login</SelectItem>
            <SelectItem value="Password Changed">Password Changed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium">Action</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Resource</th>
                <th className="text-left p-4 font-medium">Timestamp</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">{log.action}</td>
                  <td className="p-4 text-muted-foreground">{log.user}</td>
                  <td className="p-4 text-muted-foreground">{log.resource}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                  </td>
                  <td className="p-4">
                    <Badge variant={log.status === "Success" ? "default" : "secondary"}>{log.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
