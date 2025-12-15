"use client"

import { useThemeStore } from "@/store/theme"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const accentColors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
]

export function ThemesPage() {
  const { theme, setTheme, accentColor, setAccentColor } = useThemeStore()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Themes</h1>
        <p className="text-muted-foreground">Customize the appearance of your workspace</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Theme Mode</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "p-6 rounded-lg border-2 transition-all hover:border-primary",
                  theme === "light" ? "border-primary bg-accent" : "border-border",
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <Sun className="w-8 h-8" />
                  <span className="font-medium">Light Mode</span>
                </div>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "p-6 rounded-lg border-2 transition-all hover:border-primary",
                  theme === "dark" ? "border-primary bg-accent" : "border-border",
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <Moon className="w-8 h-8" />
                  <span className="font-medium">Dark Mode</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Accent Color</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all hover:scale-105",
                    accentColor === color.value ? "border-primary" : "border-border",
                  )}
                >
                  <div className="w-full h-12 rounded-md mb-2" style={{ backgroundColor: color.value }} />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Palette className="w-4 h-4" />
              <span>Live Preview</span>
            </div>
            <Card className="p-6 bg-accent/50">
              <h3 className="font-semibold mb-2">Preview Card</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This is how your content will look with the selected theme settings.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Primary Button</Button>
                <Button size="sm" variant="outline">
                  Secondary
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">Theme preferences are saved locally in your browser</p>
    </div>
  )
}
