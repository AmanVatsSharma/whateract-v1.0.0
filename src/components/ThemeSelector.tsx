/**
 * ============================================
 * THEME SELECTOR COMPONENT
 * ============================================
 * 
 * Beautiful theme selector with 3 options:
 * - ☀️ Light - Professional, clean, modern
 * - 🌙 Dark - Elegant, high-contrast
 * - 🌊 Ocean - Beautiful blue/teal aesthetic
 * 
 * Features:
 * - Visual preview of each theme
 * - Smooth transitions
 * - Active state indicators
 * - Accessible keyboard navigation
 * 
 * @component
 * @version 2.0.0
 */

"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Waves, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Theme configuration
 */
const themes = [
  {
    name: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Clean & Professional',
    preview: 'bg-gradient-to-br from-white to-slate-50',
    color: 'text-purple-600',
    border: 'border-purple-200',
    activeBg: 'bg-purple-50',
  },
  {
    name: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Elegant & Comfortable',
    preview: 'bg-gradient-to-br from-slate-900 to-slate-950',
    color: 'text-purple-400',
    border: 'border-slate-700',
    activeBg: 'bg-slate-800',
  },
  {
    name: 'ocean',
    label: 'Ocean',
    icon: Waves,
    description: 'Beautiful & Calm',
    preview: 'bg-gradient-to-br from-cyan-600 to-teal-700',
    color: 'text-cyan-400',
    border: 'border-cyan-600',
    activeBg: 'bg-cyan-950',
  },
]

interface ThemeSelectorProps {
  variant?: 'default' | 'compact'
}

/**
 * Theme Selector Component
 */
export function ThemeSelector({ variant = 'default' }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Handle hydration
  React.useEffect(() => {
    setMounted(true)
    console.log('🎨 ThemeSelector: Mounted with theme', theme)
  }, [theme])

  if (!mounted) {
    return null
  }

  /**
   * Handle theme change
   */
  const handleThemeChange = (themeName: string) => {
    console.log('🌈 ThemeSelector: Changing theme', { from: theme, to: themeName })
    setTheme(themeName)
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {themes.map((t) => {
          const Icon = t.icon
          const isActive = theme === t.name
          
          return (
            <Button
              key={t.name}
              variant="ghost"
              size="sm"
              onClick={() => handleThemeChange(t.name)}
              className={cn(
                "relative h-9 w-9 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary ring-2 ring-primary/20" 
                  : "hover:bg-muted"
              )}
              title={`${t.label} Theme - ${t.description}`}
            >
              <Icon className="h-4 w-4" />
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground mb-3">
        Choose Your Theme
      </p>
      <div className="grid gap-3">
        {themes.map((t) => {
          const Icon = t.icon
          const isActive = theme === t.name
          
          return (
            <button
              key={t.name}
              onClick={() => handleThemeChange(t.name)}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-lg",
                isActive
                  ? `${t.border} ${t.activeBg} shadow-md`
                  : "border-border hover:border-primary/30 bg-card"
              )}
            >
              {/* Theme Preview Circle */}
              <div className={cn(
                "relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all",
                isActive ? "ring-primary" : "ring-transparent group-hover:ring-primary/30"
              )}>
                <div className={cn("h-full w-full", t.preview)} />
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              
              {/* Theme Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", isActive && t.color)} />
                  <span className={cn(
                    "font-semibold text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {t.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.description}
                </p>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">Active</span>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Export compact variant as separate component for convenience
 */
export function CompactThemeSelector() {
  return <ThemeSelector variant="compact" />
}
