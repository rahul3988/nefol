import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      // Check localStorage first, then system preference
      const savedTheme = localStorage.getItem('nefol-theme') as Theme
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    
    return 'light'
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Apply theme to document root
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      
      // Also apply to body for extra safety
      document.body.classList.remove('light', 'dark')
      document.body.classList.add(theme)
      
      // Save to localStorage
      localStorage.setItem('nefol-theme', theme)
      
      console.log('Theme applied:', theme) // Debug log
    }
  }, [theme])

  // Additional effect to ensure theme is applied on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force apply theme immediately
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      
      document.body.classList.remove('light', 'dark')
      document.body.classList.add(theme)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
