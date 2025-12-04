/**
 * ============================================
 * HEADER COMPONENT - Modern Light Theme
 * ============================================
 * 
 * Clean, professional app header featuring:
 * - Modern light aesthetic with glassmorphism
 * - Responsive design (mobile + desktop)
 * - Command palette search
 * - Notification center
 * - User profile menu
 * - Theme toggle
 * - Smooth animations
 * - Sticky on scroll with backdrop blur
 * 
 * @component
 * @version 2.0.0
 */

"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuShortcut, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
    Command, 
    CommandDialog, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandItem, 
    CommandList, 
    CommandSeparator 
} from "@/components/ui/command"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Icons
import { 
    Bell, 
    Search, 
    Settings, 
    LogOut, 
    User, 
    HelpCircle, 
    Moon, 
    Sun, 
    Plus, 
    Zap,
    MessageSquare,
    X,
    Command as CommandIcon,
    Crown,
    Sparkles
} from 'lucide-react'

/**
 * Sample notification data
 * TODO: Replace with API data
 */
const notificationsData = [
    {
        id: 1,
        type: 'subscriber',
        title: 'New subscriber joined',
        description: 'Sarah Johnson subscribed to your list',
        time: '2 minutes ago',
        icon: User,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        unread: true
    },
    {
        id: 2,
        type: 'campaign',
        title: 'Campaign completed',
        description: 'Summer Sale campaign reached 98% delivery',
        time: '1 hour ago',
        icon: Zap,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        unread: true
    },
    {
        id: 3,
        type: 'system',
        title: 'System update available',
        description: 'New features and improvements ready',
        time: '1 day ago',
        icon: Settings,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        unread: false
    },
]

/**
 * Main Header Component
 */
export default function Header() {
    // State management
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [unreadCount, setUnreadCount] = useState(2)
    
    // Hooks
    const { theme, setTheme } = useTheme()

    /**
     * Handle scroll effect for header backdrop
     */
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 10
            if (scrolled !== isScrolled) {
                console.log('📜 Header: Scroll state changed', { scrolled })
                setIsScrolled(scrolled)
            }
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isScrolled])

    /**
     * Component mount effect
     */
    useEffect(() => {
        setMounted(true)
        console.log('🎨 Header: Component mounted with modern light theme')
        console.log('🎭 Current theme:', theme)
    }, [theme])

    /**
     * Toggle theme
     */
    const toggleDarkMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        console.log('🌓 Header: Switching theme', { from: theme, to: newTheme })
        setTheme(newTheme)
    }

    /**
     * Handle feedback submission
     */
    const handleFeedbackSubmit = () => {
        console.log('📝 Header: Feedback submitted')
        setIsFeedbackOpen(false)
        // TODO: Implement actual feedback submission
    }

    /**
     * Handle create new action
     */
    const handleCreateNew = () => {
        console.log('➕ Header: Create new campaign clicked')
        // TODO: Implement create new campaign logic
    }

    /**
     * Handle notification click
     */
    const handleNotificationClick = (notificationId: number) => {
        console.log('🔔 Header: Notification clicked', { notificationId })
        setUnreadCount(Math.max(0, unreadCount - 1))
        // TODO: Mark notification as read
    }

    // Wait for theme hydration
    if (!mounted) {
        return null
    }

    return (
        <>
            {/* Main Header */}
            <header 
                className={cn(
                    "fixed top-0 left-0 right-0 z-50",
                    "transition-all duration-300 ease-in-out",
                    isScrolled 
                        ? 'bg-card/80 backdrop-blur-xl shadow-lg border-b border-border/50' 
                        : 'bg-transparent'
                )}
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    
                    {/* Left Section - Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            {/* Logo Icon with modern gradient effect */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-40 group-hover:opacity-60" />
                                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
                                    <MessageSquare className="h-6 w-6 text-primary-foreground" />
                                </div>
                            </div>
                            
                            {/* Logo Text */}
                            <span className="hidden sm:flex items-center gap-2">
                                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    WhatsApp Pro
                                </span>
                                <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                                    v2.0
                                </Badge>
                            </span>
                        </Link>
                    </div>
                    
                    {/* Center Section - Search (Desktop) */}
                    <div className="flex-1 flex items-center justify-center px-4 max-w-2xl">
                        <form 
                            className="hidden lg:flex w-full" 
                            onSubmit={(e) => {
                                e.preventDefault()
                                console.log('🔍 Header: Search submitted')
                            }}
                        >
                            <div className="relative w-full group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <CommandIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search campaigns, contacts, analytics... (Ctrl+K)"
                                    className="w-full pl-10 pr-20 bg-muted/50 border-border/50 focus:bg-background focus:border-primary transition-all duration-200 rounded-xl h-10 hover:bg-muted"
                                    onClick={() => setIsSearchOpen(true)}
                                />
                                <kbd className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    ⌘K
                                </kbd>
                            </div>
                        </form>
                    </div>
                    
                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2">
                        
                        {/* Mobile Search Toggle */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="lg:hidden h-10 w-10 hover:bg-primary/5 hover:text-primary rounded-xl" 
                                        onClick={() => {
                                            console.log('📱 Header: Opening mobile search')
                                            setIsSearchOpen(true)
                                        }}
                                    >
                                        <Search className="h-5 w-5" />
                                        <span className="sr-only">Search</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search (⌘K)</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        {/* Create New Button */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        size="sm"
                                        className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 font-semibold rounded-xl hover:scale-105 transition-all duration-200"
                                        onClick={handleCreateNew}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">New Campaign</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create New Campaign</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        {/* Notifications */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="relative h-10 w-10 hover:bg-primary/5 hover:text-primary rounded-xl"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">Notifications</span>
                                    {unreadCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive p-0 text-[10px] font-bold flex items-center justify-center border-2 border-background animate-pulse">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
                                <div className="flex justify-between items-center border-b p-4 bg-gradient-to-br from-primary/5 to-transparent">
                                    <h3 className="font-bold text-lg">Notifications</h3>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-xs hover:bg-primary/10 h-7 font-semibold"
                                        onClick={() => {
                                            console.log('✅ Header: Mark all as read')
                                            setUnreadCount(0)
                                        }}
                                    >
                                        Mark all read
                                    </Button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto scrollbar-modern">
                                    {notificationsData.map((notification) => (
                                        <div 
                                            key={notification.id}
                                            className={cn(
                                                "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors duration-200 cursor-pointer border-b border-border/30 last:border-0",
                                                notification.unread && "bg-primary/5"
                                            )}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
                                                notification.bgColor
                                            )}>
                                                <notification.icon className={cn("h-5 w-5", notification.color)} />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-semibold">{notification.title}</p>
                                                    {notification.unread && (
                                                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{notification.description}</p>
                                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t bg-gradient-to-t from-muted/20 to-transparent">
                                    <Button 
                                        variant="ghost" 
                                        className="w-full hover:bg-primary/5 font-semibold"
                                        onClick={() => console.log('📋 Header: View all notifications')}
                                    >
                                        View all notifications
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        
                        {/* User Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200 p-0"
                                >
                                    <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors">
                                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold">
                                            JD
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-72" align="end" forceMount sideOffset={8}>
                                <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-br from-primary/5 to-transparent">
                                    <div className="flex gap-3">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                                                JD
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold">John Doe</p>
                                            <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                                            <Badge variant="secondary" className="w-fit text-xs mt-1">Free Plan</Badge>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log('👤 Header: Profile clicked')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log('⚙️ Header: Settings clicked')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)}>
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Help & Feedback</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-primary font-semibold" onClick={() => console.log('💎 Header: Upgrade clicked')}>
                                    <Crown className="mr-2 h-4 w-4" />
                                    <span>Upgrade to Pro</span>
                                    <Sparkles className="ml-auto h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            {theme === 'dark' ? (
                                                <Moon className="mr-2 h-4 w-4" />
                                            ) : (
                                                <Sun className="mr-2 h-4 w-4" />
                                            )}
                                            <span>Dark mode</span>
                                        </div>
                                        <Switch checked={theme === 'dark'} onCheckedChange={toggleDarkMode} />
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive font-semibold"
                                    onClick={() => console.log('👋 Header: Logout clicked')}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            
            {/* Command Palette / Search Dialog */}
            <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => console.log('🔍 Search: Campaigns')}>
                            <Zap className="mr-2 h-4 w-4" />
                            <span>Search Campaigns</span>
                        </CommandItem>
                        <CommandItem onSelect={() => console.log('🔍 Search: Subscribers')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Search Subscribers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => console.log('🔍 Search: Settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Open Settings</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Recent">
                        <CommandItem>Summer Sale Campaign</CommandItem>
                        <CommandItem>New Product Launch</CommandItem>
                        <CommandItem>Customer Feedback Survey</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            
            {/* Feedback Dialog */}
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Help & Feedback</DialogTitle>
                        <DialogDescription>
                            We'd love to hear your thoughts on how we can improve your experience.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="feedback-type">Type</Label>
                            <Select>
                                <SelectTrigger id="feedback-type">
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bug">🐛 Bug Report</SelectItem>
                                    <SelectItem value="feature">✨ Feature Request</SelectItem>
                                    <SelectItem value="general">💬 General Feedback</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="feedback-message">Message</Label>
                            <Textarea
                                id="feedback-message"
                                placeholder="Type your feedback here..."
                                className="min-h-[120px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsFeedbackOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-semibold"
                            onClick={handleFeedbackSubmit}
                        >
                            Submit Feedback
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
