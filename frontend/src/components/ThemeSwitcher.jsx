"use client"

import { useTheme } from "@/context/ThemeContext"
import { Palette, Check } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu"

const ThemeSwitcher = () => {
  const { changeTheme, themes, theme } = useTheme()

  const themeOptions = [
    { key: 'default', name: 'Ocean Blue', color: '#4f46e5', description: 'Professional & modern' },
    { key: 'dark', name: 'Midnight', color: '#22c55e', description: 'Dark with green accents' },
    { key: 'purple', name: 'Royal Purple', color: '#8b5cf6', description: 'Elegant & creative' },
    { key: 'green', name: 'Forest Green', color: '#059669', description: 'Natural & calming' },
    { key: 'blue', name: 'Sky Blue', color: '#0ea5e9', description: 'Fresh & vibrant' }
  ]

  const getCurrentThemeColor = () => {
    const currentTheme = themeOptions.find(t => theme === themes[t.key])
    return currentTheme?.color || '#3b82f6'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg relative hover:bg-accent">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
          <div
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
            style={{ backgroundColor: getCurrentThemeColor() }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 card-professional">
        <DropdownMenuLabel className="text-sm font-medium">Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeOptions.map((themeOption) => {
          const isActive = theme === themes[themeOption.key]
          return (
            <DropdownMenuItem
              key={themeOption.key}
              onClick={() => changeTheme(themes[themeOption.key])}
              className={`flex items-center gap-3 p-3 cursor-pointer ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="h-4 w-4 rounded-full border border-border/50"
                  style={{ backgroundColor: themeOption.color }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{themeOption.name}</div>
                  <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                </div>
              </div>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSwitcher
