import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  theme: "light" | "dark"
  accentColor: string
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark") => void
  setAccentColor: (color: string) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      accentColor: "#3b82f6",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light"
          document.documentElement.classList.toggle("dark", newTheme === "dark")
          return { theme: newTheme }
        }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark")
        set({ theme })
      },
      setAccentColor: (color) => {
        set({ accentColor: color })
        document.documentElement.style.setProperty("--primary", color)
      },
    }),
    {
      name: "nexus-theme",
    },
  ),
)
