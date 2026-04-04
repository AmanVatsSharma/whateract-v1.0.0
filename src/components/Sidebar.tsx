/**
 * ============================================
 * SIDEBAR COMPONENT - Modern Light Theme
 * ============================================
 * 
 * Professional, clean navigation sidebar with:
 * - Modern light design aesthetic
 * - Responsive mobile drawer
 * - Smooth animations & transitions
 * - Collapsible functionality
 * - Search capabilities
 * - User profile section
 * - Beautiful hover states
 * - Accessibility focused
 * 
 * @component
 * @version 2.0.0
 */

"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import { initialsFromEmail, readBrowserCookie } from "@/lib/workspace-display"

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
    Store,
    Search,
    Star,
    LogOut,
    X,
    Crown,
} from 'lucide-react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { isAutomationsFeatureEnabled, isInboxFeatureEnabled } from '@/lib/feature-flags'

type SidebarNavItem = {
    name: string
    icon: React.ComponentType<{ className?: string }>
    href: string
    description: string
    badge?: string
    badgeVariant?: 'default' | 'secondary' | 'destructive'
}

/**
 * Navigation Items Configuration
 * Structured data for sidebar navigation with icons and badges
 */
const sidebarItems: SidebarNavItem[] = [
    { 
        name: 'Dashboard', 
        icon: LayoutDashboard, 
        href: '/dashboard',
        description: 'Overview & Analytics'
    },
    { 
        name: 'Inbox', 
        icon: MessageSquare, 
        href: '/inbox', 
        description: 'Messages & Conversations'
    },
    { 
        name: 'Campaigns', 
        icon: Zap, 
        href: '/campaigns', 
        description: 'Marketing Campaigns'
    },
    { 
        name: 'Audience', 
        icon: Users, 
        href: '/audience',
        description: 'Subscriber Management'
    },
    { 
        name: 'Analytics', 
        icon: BarChart, 
        href: '/analytics',
        description: 'Performance Insights'
    },
    { 
        name: 'Templates', 
        icon: FileText, 
        href: '/message-templates',
        description: 'Message Templates'
    },
    { 
        name: 'Scheduler', 
        icon: Calendar, 
        href: '/scheduler',
        description: 'Schedule Messages'
    },
    { 
        name: 'Automations', 
        icon: Zap, 
        href: '/automations',
        description: 'Automated Workflows'
    },
    { 
        name: 'Notifications', 
        icon: Bell, 
        href: '/notifications', 
        description: 'System Notifications'
    },
    {
        name: 'Shopify',
        icon: Store,
        href: '/shopify',
        description: 'Store Connection & Sync'
    },
    {
        name: 'Team',
        icon: Users,
        href: '/team',
        description: 'Members & Invitations'
    },
    { 
        name: 'Settings', 
        icon: Settings, 
        href: '/settings',
        description: 'App Configuration'
    },
    { 
        name: 'Help & Support', 
        icon: HelpCircle, 
        href: '/support',
        description: 'Get Help'
    },
]

/**
 * Main Sidebar Component
 * Handles both desktop and mobile navigation
 */
export default function Sidebar() {
    // State management
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [workspaceLabel, setWorkspaceLabel] = useState('')
    const [userEmail, setUserEmail] = useState('')

    // Hooks
    const pathname = usePathname()
    const router = useRouter()
    const { theme, setTheme } = useTheme()

    /**
     * Component mount effect for hydration
     */
    useEffect(() => {
        setMounted(true)
    }, [pathname, theme])

    useEffect(() => {
        setWorkspaceLabel(readBrowserCookie("tenant_label"))
        setUserEmail(readBrowserCookie("user_email"))
    }, [pathname])

    /**
     * Toggle sidebar collapse state
     */
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    const displayWorkspace = workspaceLabel.trim() || "Workspace"
    const displayEmail = userEmail.trim() || ""
    const avatarInitials = displayEmail ? initialsFromEmail(displayEmail) : "WA"

    const navItems = useMemo(
        () =>
            sidebarItems.filter((item) => {
                if (item.href === "/inbox" && !isInboxFeatureEnabled()) return false
                if (item.href === "/automations" && !isAutomationsFeatureEnabled()) return false
                return true
            }),
        []
    )

    const signOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push("/login")
    }

    // Theme switching is now handled by ThemeSelector component

    /**
     * Close mobile sidebar
     */
    const handleMobileClose = () => {
        console.log('📱 Sidebar: Closing mobile menu')
        setIsMobileOpen(false)
    }

    /**
     * Filter sidebar items based on search
     */
    const filteredItems = navItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    /**
     * Animation variants for smooth transitions
     */
    const sidebarVariants = {
        expanded: { width: '260px' },
        collapsed: { width: '80px' }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    }

    /**
     * Render individual navigation item
     */
    const renderNavItem = (item: (typeof sidebarItems)[0], isMobile = false) => {
        const isActive = pathname?.startsWith(item.href)
        
        return (
            <TooltipProvider key={item.name} delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={item.href}
                            onClick={isMobile ? handleMobileClose : undefined}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-3",
                                "transition-all duration-200 ease-in-out",
                                "hover:bg-primary/5 hover:scale-[1.02]",
                                isActive 
                                    ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary shadow-sm border-l-4 border-primary" 
                                    : "text-muted-foreground hover:text-foreground border-l-4 border-transparent"
                            )}
                        >
                            <div className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                                isActive ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary"
                            )}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            
                            {(!isCollapsed || isMobile) && (
                                <div className="flex flex-1 flex-col overflow-hidden">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="truncate font-semibold text-sm"
                                    >
                                        {item.name}
                                    </motion.span>
                                    {item.description && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2, delay: 0.1 }}
                                            className="truncate text-xs text-muted-foreground"
                                        >
                                            {item.description}
                                        </motion.span>
                                    )}
                                </div>
                            )}
                            
                            {item.badge && (!isCollapsed || isMobile) && (
                                <Badge 
                                    variant={item.badgeVariant || "secondary"}
                                    className="ml-auto text-xs font-bold"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                            
                            {item.badge && isCollapsed && !isMobile && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    </TooltipTrigger>
                    {!isMobile && isCollapsed && (
                        <TooltipContent side="right" className="z-50 font-semibold">
                            <p>{item.name}</p>
                            {item.description && (
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
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
                        "w-full justify-start gap-3 hover:bg-primary/5 h-auto py-3",
                        !isCollapsed || isMobile ? "px-3" : "px-0 justify-center"
                    )}
                >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                            {avatarInitials}
                        </AvatarFallback>
                    </Avatar>
                    {(!isCollapsed || isMobile) && (
                        <div className="flex flex-1 flex-col items-start overflow-hidden">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="truncate font-semibold text-sm"
                            >
                                {displayWorkspace}
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="truncate text-xs text-muted-foreground"
                            >
                                {displayEmail || "Signed in"}
                            </motion.span>
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end" sideOffset={8}>
                <div className="p-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                                {avatarInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{displayWorkspace}</p>
                            <p className="text-xs text-muted-foreground">{displayEmail || "—"}</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-2 space-y-1">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 hover:bg-primary/5 text-primary"
                        onClick={() => router.push("/settings")}
                    >
                        <Crown className="h-4 w-4" /> 
                        Upgrade to Pro
                    </Button>
                    
                    <div className="my-2 h-px bg-border" />
                    
                    {/* Theme Selector - Light, Dark, Ocean */}
                    <div className="px-2 py-2">
                        <ThemeSelector variant="default" />
                    </div>
                    
                    <div className="my-2 h-px bg-border" />
                    
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => void signOut()}
                    >
                        <LogOut className="h-4 w-4" /> Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )

    /**
     * Render sidebar content (shared between mobile and desktop)
     */
    const renderSidebarContent = (isMobile = false) => (
        <div className="flex flex-1 flex-col h-full">
            {/* Search Bar */}
            {(!isCollapsed || isMobile) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 mb-4"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 bg-muted/50 border-border/50 focus:bg-background focus:border-primary h-10 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => {
                                console.log('🔍 Sidebar: Searching', e.target.value)
                                setSearchTerm(e.target.value)
                            }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Navigation Items */}
            <ScrollArea className="flex-1 px-3">
                <nav className="space-y-1">
                    <AnimatePresence mode="wait">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                {renderNavItem(item, isMobile)}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>
            </ScrollArea>

            {/* Bottom Section */}
            <div className="mt-auto p-3 space-y-3 border-t bg-gradient-to-t from-muted/20 to-transparent">
                {/* User Profile */}
                {renderUserProfile(isMobile)}
                
                {/* Storage Indicator */}
                {(!isCollapsed || isMobile) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2 px-3 py-3 rounded-lg bg-muted/30"
                    >
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Storage</span>
                            <span className="text-foreground">7.5 / 10 GB</span>
                        </div>
                        <Progress value={75} className="h-2" />
                    </motion.div>
                )}
                
                {/* Upgrade Button */}
                <Button 
                    className={cn(
                        "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                        "shadow-lg shadow-primary/25 font-semibold",
                        "transition-all duration-200 hover:scale-[1.02]"
                    )}
                    onClick={() => console.log('✨ Sidebar: Upgrade button clicked')}
                >
                    <Zap className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-2")} />
                    {(!isCollapsed || isMobile) && "Upgrade to Pro"}
                </Button>
            </div>
        </div>
    )

    // Wait for theme hydration
    if (!mounted) {
        return null
    }

    return (
        <>
            {/* Mobile Sidebar - Sheet/Drawer */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="fixed top-4 left-4 z-50 md:hidden shadow-lg bg-card hover:bg-primary/5 border-border/50"
                        onClick={() => {
                            console.log('📱 Sidebar: Opening mobile menu')
                            setIsMobileOpen(true)
                        }}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent 
                    side="left" 
                    className="w-[280px] p-0 flex flex-col border-r"
                >
                    <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
                        <SheetTitle className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                                <MessageSquare className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                WhatsApp Pro
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 flex flex-col overflow-hidden py-4">
                        {renderSidebarContent(true)}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar - Fixed */}
            <motion.aside
                className={cn(
                    "hidden md:flex fixed left-0 top-16 bottom-0 z-40",
                    "flex-col bg-card/80 backdrop-blur-xl border-r border-border/50",
                    "shadow-2xl"
                )}
                initial="expanded"
                animate={isCollapsed ? 'collapsed' : 'expanded'}
                variants={sidebarVariants}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Collapse Toggle Button */}
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border border-border bg-card shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
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
            </motion.aside>
        </>
    )
}
