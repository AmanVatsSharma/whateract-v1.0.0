"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
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
} from 'lucide-react'

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Campaigns', icon: MessageSquare, href: '/campaigns', badge: '3' },
    { name: 'Audience', icon: Users, href: '/audience' },
    { name: 'Analytics', icon: BarChart, href: '/analytics' },
    { name: 'Templates', icon: FileText, href: '/message-templates' },
    { name: 'Scheduler', icon: Calendar, href: '/scheduler' },
    { name: 'Automations', icon: Zap, href: '/automations' },
    { name: 'Notifications', icon: Bell, href: '/notifications', badge: '5' },
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Help & Support', icon: HelpCircle, href: '/support' },
]

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDarkMode, setIsDarkMode] = useState(false)
    // const router = useRouter()

    const toggleSidebar = () => setIsCollapsed(!isCollapsed)
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDarkMode(mediaQuery.matches)
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    const filteredItems = sidebarItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sidebarVariants = {
        expanded: { width: '240px' },
        collapsed: { width: '72px' }
    }

    const searchVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -20 }
    }

    return (
        <motion.div
            className={cn(
                "fixed left-0 top-0 bottom-0 z-40 flex flex-col pt-[60px] bg-gray-900 text-white transition-all duration-300",
                isDarkMode ? "bg-gray-900" : "bg-white text-gray-900"
            )}
            initial="expanded"
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
        >
            <div className="md:hidden flex items-center justify-between p-4">
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center space-x-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:hidden h-6 w-6 text-purple-400"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                <path d="M14.5 2v4" />
                                <path d="M18.5 6L16 8.5" />
                                <path d="M19.5 10h-4" />
                            </svg>
                            <span className="font-bold">WhatsApp Pro Max</span>
                        </Link>
                    )}
                </motion.div>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isCollapsed ? <Menu className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                </Button>
            </div>
            <motion.div
                className="md:hidden px-4 mb-4"
                initial="expanded"
                animate={isCollapsed ? 'collapsed' : 'expanded'}
                variants={searchVariants}
            >
                {!isCollapsed && (
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 bg-gray-800 text-white placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </motion.div>
            <ScrollArea className="flex-1 py-4">
                <nav className="space-y-2 px-2">
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className='absolute right-3'>
                    {isCollapsed ? <Menu className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                </Button>
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {/* <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center space-x-2 rounded-lg px-3 py-2 transition-all hover:bg-gray-800",
                                                    router.pathname === item.href ? "bg-gray-800 text-purple-400" : "text-gray-400"
                                                )}
                                            > */}
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center space-x-2 rounded-lg px-3 py-2 transition-all hover:bg-gray-800 text-gray-400"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <motion.span
                                                    initial={{ opacity: 1 }}
                                                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={cn("flex-1", isCollapsed && "hidden")}
                                                >
                                                    {item.name}
                                                </motion.span>
                                                {item.badge && (
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gray-800 text-white">
                                            {item.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>
            </ScrollArea>
            <div className="mt-auto p-4 space-y-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <motion.span
                                initial={{ opacity: 1 }}
                                animate={{ opacity: isCollapsed ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                                className={cn("flex-1 text-left", isCollapsed && "hidden")}
                            >
                                John Doe
                            </motion.span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 bg-gray-800 text-white" align="end">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-400">john.doe@example.com</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Button variant="ghost" className="w-full justify-start">
                                <Star className="mr-2 h-4 w-4" /> Upgrade to Pro
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={toggleDarkMode}>
                                {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-red-400">
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <div className={cn("space-y-2", isCollapsed && "hidden")}>
                    <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span>75% / 100GB</span>
                    </div>
                    <Progress value={75} className="w-full" />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Zap className="mr-2 h-4 w-4" />
                    <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isCollapsed ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                        className={cn("flex-1", isCollapsed && "hidden")}
                    >
                        Upgrade Plan
                    </motion.span>
                </Button>
            </div>
        </motion.div>
    )
}