"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Server, Code, Shield } from "lucide-react"

const configSections = [
  {
    icon: Server,
    title: "Server Configuration",
    settings: [
      { key: "API Endpoint", value: "https://api.nexus-portal.com", type: "url" },
      { key: "WebSocket URL", value: "wss://ws.nexus-portal.com", type: "url" },
      { key: "Max Connections", value: "1000", type: "number" },
    ],
  },
  {
    icon: Database,
    title: "Database Settings",
    settings: [
      { key: "Database Host", value: "db.nexus-portal.com", type: "string" },
      { key: "Database Port", value: "5432", type: "number" },
      { key: "Connection Pool Size", value: "20", type: "number" },
    ],
  },
  {
    icon: Code,
    title: "Application Settings",
    settings: [
      { key: "Environment", value: "Production", type: "badge", variant: "default" },
      { key: "Debug Mode", value: "Disabled", type: "badge", variant: "secondary" },
      { key: "Version", value: "1.0.0", type: "string" },
    ],
  },
  {
    icon: Shield,
    title: "Security Settings",
    settings: [
      { key: "SSL Enabled", value: "Yes", type: "badge", variant: "default" },
      { key: "Rate Limiting", value: "Enabled", type: "badge", variant: "default" },
      { key: "CORS Origins", value: "*.nexus-portal.com", type: "string" },
    ],
  },
]

export function ConfigurationPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Configuration</h1>
        <p className="text-muted-foreground">System configuration and environment settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {configSections.map((section) => (
          <Card key={section.title} className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{section.title}</h3>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{setting.key}</span>
                  {setting.type === "badge" ? (
                    <Badge variant={setting.variant as any}>{setting.value}</Badge>
                  ) : (
                    <span className="text-sm font-mono font-medium">{setting.value}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-dashed">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Configuration Management</p>
            <p className="text-xs text-muted-foreground">
              These settings are read-only and managed by system administrators
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
