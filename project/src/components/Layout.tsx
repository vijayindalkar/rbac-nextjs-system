"use client"

import { Sidebar } from './Sidebar'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    setIsSidebarOpen(!isSmallScreen)
    setIsCollapsed(isSmallScreen)
  }, [isSmallScreen])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Backdrop */}
      {isSidebarOpen && isSmallScreen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 lg:relative",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed && !isSmallScreen ? "lg:w-[80px]" : "lg:w-64"
        )}
      >
        <Sidebar 
          isCollapsed={isSmallScreen ? true : isCollapsed} 
          onCollapsedChange={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto bg-background p-6 lg:p-8",
        "transition-all duration-300 ease-in-out"
      )}>
        <div className="lg:hidden h-8" /> {/* Spacer for mobile menu button */}
        {children}
      </main>
    </div>
  )
}