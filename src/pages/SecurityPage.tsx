"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Smartphone, Monitor, Laptop } from "lucide-react"
import { toast } from "sonner"

const mockSessions = [
  { id: 1, device: "Chrome on MacBook Pro", location: "San Francisco, CA", current: true, lastActive: "Active now" },
  { id: 2, device: "Safari on iPhone 14", location: "San Francisco, CA", current: false, lastActive: "2 hours ago" },
  { id: 3, device: "Firefox on Windows", location: "New York, NY", current: false, lastActive: "1 day ago" },
]

export function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Password changed successfully")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Security</h1>
        <p className="text-muted-foreground">Manage your account security and sessions</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Change Password</h3>
            <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="current">Current Password</Label>
            <Input id="current" type="password" placeholder="Enter current password" />
          </div>
          <div>
            <Label htmlFor="new">New Password</Label>
            <Input id="new" type="password" placeholder="Enter new password" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" placeholder="Confirm new password" />
          </div>
          <Button type="submit">Update Password</Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Active Sessions</h3>
            <p className="text-sm text-muted-foreground">Manage devices that are currently logged in</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  {session.device.includes("MacBook") ? (
                    <Laptop className="w-5 h-5" />
                  ) : session.device.includes("iPhone") ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{session.device}</p>
                    {session.current && <Badge variant="secondary">Current</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
