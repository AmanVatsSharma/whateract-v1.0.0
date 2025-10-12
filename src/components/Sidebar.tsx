/**
 * Sidebar Component - Mobile-First Responsive Navigation
 * 
 * Features:
 * - Mobile drawer on small screens (< md)
 * - Fixed sidebar on desktop (>= md)
 * - Collapsible functionality
 * - Search functionality
 * - Modern glassmorphism effects
 * - Smooth animations
 * - Theme toggle integration
 * - User profile section
 * - Storage progress indicator
 * 
 * @component
 */

"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

// UI Components
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Icons
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    BarChart,
    Settings,
    HelpCircle,
    Menu,
    ChevronLeft,
    Zap,
    FileText,
    Calendar,
    Bell,
    Search,
    Star,
    LogOut,
    Moon,
    Sun,
    X,
} from 'lucide-react'

/**
 * Sidebar navigation items configuration
 * Each item contains: name, icon, href, and optional badge
 */
const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Inbox', icon: MessageSquare, href: '/inbox', badge: '2' },
    { name: 'Campaigns', icon: Zap, href: '/campaigns', badge: '3' },
    { name: 'Audience', icon: Users, href: '/audience' },
    { name: 'Analytics', icon: BarChart, href: '/analytics' },
    { name: 'Templates', icon: FileText, href: '/message-templates' },
    { name: 'Scheduler', icon: Calendar, href: '/scheduler' },
    { name: 'Automations', icon: Zap, href: '/automations' },
    { name: 'Notifications', icon: Bell, href: '/notifications', badge: '5' },
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Help & Support', icon: HelpCircle, href: '/support' },
]

/**
 * Main Sidebar Component
 */
export default function Sidebar() {
    // State management
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    
    // Hooks
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    /**
     * Handle component mount for theme hydration
     */
    useEffect(() => {
        setMounted(true)
        console.log('Sidebar: Component mounted', { theme, pathname })
    }, [theme, pathname])

    /**
     * Toggle sidebar collapse state
     */
    const toggleSidebar = () => {
        console.log('Sidebar: Toggling collapse state', { from: isCollapsed, to: !isCollapsed })
        setIsCollapsed(!isCollapsed)
    }

    /**
     * Toggle dark mode
     */
    const toggleDarkMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        console.log('Sidebar: Toggling theme', { from: theme, to: newTheme })
        setTheme(newTheme)
    }

    /**
     * Handle mobile menu close
     */
    const handleMobileClose = () => {
        console.log('Sidebar: Closing mobile menu')
        setIsMobileOpen(false)
    }

    /**
     * Filter sidebar items based on search term
     */
    const filteredItems = sidebarItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    /**
     * Animation variants for sidebar
     */
    const sidebarVariants = {
        expanded: { width: '240px' },
        collapsed: { width: '72px' }
    }

    const searchVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -20 }
    }

    /**
     * Render sidebar navigation item
     */
    const renderNavItem = (item: typeof sidebarItems[0], isMobile = false) => {
        const isActive = pathname?.startsWith(item.href)
        
        return (
            <TooltipProvider key={item.name}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={item.href}
                            onClick={isMobile ? handleMobileClose : undefined}
                            className={cn(
                                "flex items-center space-x-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                                "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
                                isActive 
                                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-sm" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {(!isCollapsed || isMobile) && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 truncate font-medium"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {item.badge && (!isCollapsed || isMobile) && (
                                <Badge 
                                    variant="secondary" 
                                    className="ml-auto bg-primary/20 text-primary hover:bg-primary/30"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    </TooltipTrigger>
                    {!isMobile && (
                        <TooltipContent side="right" className="z-50">
                            {item.name}
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        )
    }

    /**
     * Render user profile section
     */
    const renderUserProfile = (isMobile = false) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={cn(
                        "w-full justify-start hover:bg-primary/5 transition-all duration-200",
                        !isCollapsed || isMobile ? "px-3" : "px-0 justify-center"
                    )}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                            JD
                        </AvatarFallback>
                    </Avatar>
                    {(!isCollapsed || isMobile) && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ml-3 flex-1 text-left font-medium"
                        >
                            John Doe
                        </motion.span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 glass-effect" align="end" sideOffset={8}>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
                <div className="mt-4 space-y-2">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start hover:bg-primary/10"
                        onClick={() => console.log('Sidebar: Upgrade to Pro clicked')}
                    >
                        <Star className="mr-2 h-4 w-4 text-yellow-500" /> 
                        Upgrade to Pro
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start hover:bg-primary/10" 
                        onClick={toggleDarkMode}
                    >
                        {mounted && theme === 'dark' ? (
                            <><Sun className="mr-2 h-4 w-4" /> Light Mode</>
                        ) : (
                            <><Moon className="mr-2 h-4 w-4" /> Dark Mode</>
                        )}
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:bg-destructive/10"
                        onClick={() => console.log('Sidebar: Logout clicked')}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )

    /**
     * Render sidebar content (shared between mobile and desktop)
     */
    const renderSidebarContent = (isMobile = false) => (
        <>
            {/* Search Bar */}
            <motion.div
                className={cn("px-3 mb-4", isMobile ? "" : isCollapsed && "opacity-0")}
                initial="expanded"
                animate={!isMobile && isCollapsed ? 'collapsed' : 'expanded'}
                variants={searchVariants}
            >
                {(!isCollapsed || isMobile) && (
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 bg-secondary/50 border-border/50 focus:border-primary transition-all duration-200"
                            value={searchTerm}
                            onChange={(e) => {
                                console.log('Sidebar: Search term changed', { term: e.target.value })
                                setSearchTerm(e.target.value)
                            }}
                        />
                    </div>
                )}
            </motion.div>

            {/* Navigation Items */}
            <ScrollArea className="flex-1 px-3">
                <nav className="space-y-1">
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderNavItem(item, isMobile)}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>
            </ScrollArea>

            {/* Bottom Section */}
            <div className="mt-auto p-3 space-y-4 border-t border-border/50">
                {/* User Profile */}
                {renderUserProfile(isMobile)}
                
                {/* Storage Indicator */}
                {(!isCollapsed || isMobile) && (
                    <div className="space-y-2 px-3">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Storage</span>
                            <span>75% / 100GB</span>
                        </div>
                        <Progress value={75} className="h-2" />
                    </div>
                )}
                
                {/* Upgrade Button */}
                <Button 
                    className={cn(
                        "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                        "shadow-lg shadow-primary/20 transition-all duration-200"
                    )}
                    onClick={() => console.log('Sidebar: Upgrade Plan clicked')}
                >
                    <Zap className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-2")} />
                    {(!isCollapsed || isMobile) && "Upgrade Plan"}
                </Button>
            </div>
        </>
    )

    // Wait for theme to hydrate
    if (!mounted) {
        return null
    }

    return (
        <>
            {/* Mobile Sidebar - Sheet/Drawer */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="fixed top-4 left-4 z-50 md:hidden"
                        onClick={() => {
                            console.log('Sidebar: Opening mobile menu')
                            setIsMobileOpen(true)
                        }}
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent 
                    side="left" 
                    className="w-[280px] p-0 flex flex-col"
                >
                    <SheetHeader className="p-6 pb-4 border-b border-border/50">
                        <SheetTitle className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="gradient-text text-lg">WhatsApp Pro</span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 flex flex-col overflow-hidden py-4">
                        {renderSidebarContent(true)}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar - Fixed */}
            <motion.div
                className={cn(
                    "hidden md:flex fixed left-0 top-16 bottom-0 z-40",
                    "flex-col bg-card/95 backdrop-blur-lg border-r border-border/50",
                    "shadow-xl transition-all duration-300"
                )}
                initial="expanded"
                animate={isCollapsed ? 'collapsed' : 'expanded'}
                variants={sidebarVariants}
            >
                {/* Collapse Toggle Button */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border border-border/50 bg-card shadow-md hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                    <ChevronLeft className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isCollapsed && "rotate-180"
                    )} />
                </Button>

                {/* Sidebar Content */}
                <div className="flex-1 flex flex-col overflow-hidden py-6">
                    {renderSidebarContent(false)}
                </div>
            </motion.div>
        </>
    )
}
