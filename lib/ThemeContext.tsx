"use client"
import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext<{
  isDark: boolean
  toggleTheme: () => void
  bg: string
  card: string
  text: string
  subtext: string
  border: string
  tableHead: string
  tableRow: string
}>({
  isDark: true,
  toggleTheme: () => {},
  bg: "bg-gray-950",
  card: "bg-gray-900 border-gray-700",
  text: "text-white",
  subtext: "text-gray-400",
  border: "border-gray-700",
  tableHead: "bg-gray-800 border-gray-700",
  tableRow: "border-gray-800 hover:bg-gray-800/50",
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("adminTheme")
    if (saved !== null) setIsDark(saved === "dark")
  }, [])

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem("adminTheme", next ? "dark" : "light")
      return next
    })
  }

  const theme = isDark ? {
    isDark,
    toggleTheme,
    bg: "bg-gray-950",
    card: "bg-gray-900 border-gray-700",
    text: "text-white",
    subtext: "text-gray-400",
    border: "border-gray-700",
    tableHead: "bg-gray-800 border-gray-700",
    tableRow: "border-gray-800 hover:bg-gray-800/50",
  } : {
    isDark,
    toggleTheme,
    bg: "bg-gray-100",
    card: "bg-white border-gray-200",
    text: "text-gray-900",
    subtext: "text-gray-500",
    border: "border-gray-200",
    tableHead: "bg-gray-50 border-gray-200",
    tableRow: "border-gray-100 hover:bg-gray-50",
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: "100vh", transition: "background 0.2s" }} className={theme.bg}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}