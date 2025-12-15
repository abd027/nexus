import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light"
          document.documentElement.classList.toggle("dark", newTheme === "dark")
          return { theme: newTheme }
        }),
    }),
    {
      name: "nexus-theme",
    },
  ),
)
