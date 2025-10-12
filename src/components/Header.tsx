/**
 * Header Component - Mobile-First Responsive App Bar
 * 
 * Features:
 * - Sticky header with glassmorphism effect
 * - Mobile-responsive navigation
 * - Search functionality (desktop + mobile)
 * - Notifications popover
 * - User profile dropdown
 * - Theme toggle
 * - Modern gradient effects
 * - Smooth scroll effects
 * 
 * @component
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
    X
} from 'lucide-react'

/**
 * Sample notification data
 */
const notificationsData = [
    {
        id: 1,
        type: 'subscriber',
        title: 'New subscriber joined',
        time: '2 minutes ago',
        icon: User,
        color: 'bg-primary'
    },
    {
        id: 2,
        type: 'campaign',
        title: 'Campaign "Summer Sale" completed',
        time: '1 hour ago',
        icon: Zap,
        color: 'bg-green-600'
    },
    {
        id: 3,
        type: 'system',
        title: 'System update available',
        time: '1 day ago',
        icon: Settings,
        color: 'bg-yellow-600'
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
    
    // Hooks
    const { theme, setTheme } = useTheme()

    /**
     * Handle scroll effect for header backdrop
     */
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 10
            if (scrolled !== isScrolled) {
                console.log('Header: Scroll state changed', { scrolled })
                setIsScrolled(scrolled)
            }
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isScrolled])

    /**
     * Handle component mount for theme hydration
     */
    useEffect(() => {
        setMounted(true)
        console.log('Header: Component mounted', { theme })
    }, [theme])

    /**
     * Toggle dark mode
     */
    const toggleDarkMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        console.log('Header: Toggling theme', { from: theme, to: newTheme })
        setTheme(newTheme)
    }

    /**
     * Handle feedback submission
     */
    const handleFeedbackSubmit = () => {
        console.log('Header: Feedback submitted')
        setIsFeedbackOpen(false)
        // TODO: Implement actual feedback submission logic
    }

    /**
     * Handle create new action
     */
    const handleCreateNew = () => {
        console.log('Header: Create new campaign clicked')
        // TODO: Implement create new campaign logic
    }

    /**
     * Handle notification click
     */
    const handleNotificationClick = (notificationId: number) => {
        console.log('Header: Notification clicked', { notificationId })
        // TODO: Implement notification handling logic
    }

    // Wait for theme to hydrate
    if (!mounted) {
        return null
    }

    return (
        <>
            {/* Main Header */}
            <header 
                className={`
                    fixed top-0 left-0 right-0 z-50 
                    transition-all duration-300 ease-in-out
                    ${isScrolled 
                        ? 'bg-card/95 backdrop-blur-lg shadow-lg border-b border-border/50' 
                        : 'bg-transparent'
                    }
                `}
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    
                    {/* Left Section - Logo */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2 group">
                            {/* Logo Icon with gradient effect */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-lg blur-sm group-hover:blur-md transition-all duration-200 opacity-50" />
                                <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                                    <MessageSquare className="h-5 w-5 text-primary-foreground" />
                                </div>
                            </div>
                            
                            {/* Logo Text */}
                            <span className="hidden sm:inline-block">
                                <Image
                                    src={"/logo.png"}
                                    width={150}
                                    height={40}
                                    className="object-contain"
                                    alt="Whaterakt"
                                    priority
                                />
                            </span>
                        </Link>
                    </div>
                    
                    {/* Center Section - Search (Desktop) */}
                    <div className="flex-1 flex items-center justify-center px-4 max-w-2xl">
                        <form 
                            className="hidden lg:flex w-full" 
                            onSubmit={(e) => {
                                e.preventDefault()
                                console.log('Header: Search submitted')
                            }}
                        >
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search campaigns, contacts, analytics..."
                                    className="w-full pl-10 pr-4 bg-secondary/50 border-border/50 focus:border-primary transition-all duration-200 rounded-xl"
                                />
                            </div>
                        </form>
                    </div>
                    
                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        
                        {/* Mobile Search Toggle */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="lg:hidden hover:bg-primary/10 transition-colors duration-200" 
                                        onClick={() => {
                                            console.log('Header: Opening mobile search')
                                            setIsSearchOpen(true)
                                        }}
                                    >
                                        <Search className="h-5 w-5" />
                                        <span className="sr-only">Search</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        {/* Create New Button */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="relative bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 border-primary/20 transition-all duration-200"
                                        onClick={handleCreateNew}
                                    >
                                        <Plus className="h-5 w-5 text-primary" />
                                        <span className="sr-only">Create New</span>
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
                                    className="relative hover:bg-primary/10 transition-colors duration-200"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">Notifications</span>
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0 text-[10px] font-bold flex items-center justify-center border-2 border-card">
                                        3
                                    </Badge>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                                <div className="flex justify-between items-center border-b border-border/50 p-4">
                                    <h3 className="font-semibold text-lg">Notifications</h3>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-xs hover:bg-primary/10"
                                        onClick={() => console.log('Header: Mark all as read')}
                                    >
                                        Mark all as read
                                    </Button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notificationsData.map((notification) => (
                                        <div 
                                            key={notification.id}
                                            className="flex items-start space-x-3 p-4 hover:bg-secondary/50 transition-colors duration-200 cursor-pointer border-b border-border/30 last:border-0"
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className={`h-10 w-10 rounded-xl ${notification.color} flex items-center justify-center flex-shrink-0`}>
                                                <notification.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{notification.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-border/50">
                                    <Button 
                                        variant="ghost" 
                                        className="w-full hover:bg-primary/10"
                                        onClick={() => console.log('Header: View all notifications')}
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
                                    className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                                            JD
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="end" forceMount sideOffset={8}>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-semibold">John Doe</p>
                                        <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log('Header: Profile clicked')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log('Header: Settings clicked')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)}>
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Help & Feedback</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log('Header: Upgrade clicked')}>
                                    <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                                    <span>Upgrade Plan</span>
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
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => console.log('Header: Logout clicked')}
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
            
            {/* Mobile Search Dialog */}
            <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => console.log('Search: Campaigns')}>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Search Campaigns</span>
                        </CommandItem>
                        <CommandItem onSelect={() => console.log('Search: Subscribers')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Search Subscribers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => console.log('Search: Settings')}>
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
                        <DialogTitle>Help & Feedback</DialogTitle>
                        <DialogDescription>
                            We&apos;d love to hear your thoughts on how we can improve your experience.
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
                                    <SelectItem value="bug">Bug Report</SelectItem>
                                    <SelectItem value="feature">Feature Request</SelectItem>
                                    <SelectItem value="general">General Feedback</SelectItem>
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
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
