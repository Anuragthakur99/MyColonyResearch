"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Define our 5 themes
const themes = {
  default: "default",
  dark: "dark",
  purple: "purple",
  green: "green",
  blue: "blue",
}

// Define theme properties
const themeProperties = {
  default: {
    isDark: false, // Changed to false since default is now light
    textColor: "text-gray-800",
    heroTextColor: "text-gray-800",
  },
  dark: {
    isDark: true,
    textColor: "text-white",
    heroTextColor: "text-white",
  },
  purple: {
    isDark: false,
    textColor: "text-gray-800",
    heroTextColor: "text-gray-800",
  },
  green: {
    isDark: false,
    textColor: "text-gray-800",
    heroTextColor: "text-gray-800",
  },
  blue: {
    isDark: false,
    textColor: "text-gray-800",
    heroTextColor: "text-gray-800",
  },
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themes.default)
  const [themeProps, setThemeProps] = useState(themeProperties.default)

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || themes.default
    setTheme(savedTheme)
    setThemeProps(themeProperties[savedTheme])
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  // Update theme in localStorage and on HTML element
  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    setThemeProps(themeProperties[newTheme])
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return <ThemeContext.Provider value={{ theme, themeProps, changeTheme, themes }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
