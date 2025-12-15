"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Clock, Save } from "lucide-react"
import { toast } from "sonner"

export function PreferencesPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("America/Los_Angeles")

  useEffect(() => {
    const saved = localStorage.getItem("preferences")
    if (saved) {
      const prefs = JSON.parse(saved)
      setEmailNotifications(prefs.emailNotifications ?? true)
      setPushNotifications(prefs.pushNotifications ?? false)
      setLanguage(prefs.language ?? "en")
      setTimezone(prefs.timezone ?? "America/Los_Angeles")
    }
  }, [])

  const handleSave = () => {
    const preferences = {
      emailNotifications,
      pushNotifications,
      language,
      timezone,
    }
    localStorage.setItem("preferences", JSON.stringify(preferences))
    toast.success("Preferences saved successfully")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Preferences</h1>
        <p className="text-muted-foreground">Customize your experience and notification settings</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notif">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch id="email-notif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notif">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
            </div>
            <Switch id="push-notif" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Language</h3>
            <p className="text-sm text-muted-foreground">Select your preferred language</p>
          </div>
        </div>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Timezone</h3>
            <p className="text-sm text-muted-foreground">Set your local timezone</p>
          </div>
        </div>

        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
            <SelectItem value="Europe/London">London (GMT)</SelectItem>
            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="w-4 h-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
