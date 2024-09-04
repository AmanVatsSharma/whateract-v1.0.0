"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Search, Settings, LogOut, User, HelpCircle, Moon, Sun, Menu, ChevronDown, Plus, Zap } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        // In a real application, you would apply the theme change here
    }

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-md' : 'bg-transparent'}`}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" className="md:hidden" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <Link href="/" className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-purple-400"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            <path d="M14.5 2v4" />
                            <path d="M18.5 6L16 8.5" />
                            <path d="M19.5 10h-4" />
                        </svg>
                        <span className="hidden font-bold sm:inline-block">
                            <Image
                                src={"/logo.png"}
                                width={200}
                                height={200}
                                className='pr-5'
                                alt='Whaterakt'
                            />
                        </span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <form className="hidden lg:block lg:flex-1" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full bg-gray-800/50 pl-8 text-white placeholder-gray-400 focus:bg-gray-800/80 transition-all duration-300"
                            />
                        </div>
                    </form>
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(true)}>
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="relative bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300">
                                    <Plus className="h-5 w-5" />
                                    <span className="sr-only">Create New</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Create New Campaign</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="sr-only">Notifications</span>
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 p-0 text-xs">
                                    3
                                </Badge>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-gray-800 text-white">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                                <h3 className="font-semibold">Notifications</h3>
                                <Button variant="ghost" size="sm">Mark all as read</Button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start space-x-2 p-2 hover:bg-gray-700 rounded transition-colors duration-200">
                                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">New subscriber joined</p>
                                        <p className="text-xs text-gray-400">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2 p-2 hover:bg-gray-700 rounded transition-colors duration-200">
                                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">Campaign &quot;Summer Sale&quot; completed</p>
                                        <p className="text-xs text-gray-400">1 hour ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2 p-2 hover:bg-gray-700 rounded transition-colors duration-200">
                                    <div className="h-8 w-8 rounded-full bg-yellow-600 flex items-center justify-center">
                                        <Settings className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">System update available</p>
                                        <p className="text-xs text-gray-400">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-2" variant="outline">View all notifications</Button>
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-gray-800 text-white" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">John Doe</p>
                                    <p className="text-xs text-gray-400">john.doe@example.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setIsFeedbackOpen(true)}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Help & Feedback</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Zap className="mr-2 h-4 w-4" />
                                <span>Upgrade Plan</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                                        <span>Dark mode</span>
                                    </div>
                                    <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Search Campaigns</span>
                        </CommandItem>
                        <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Search Subscribers</span>
                        </CommandItem>
                        <CommandItem>
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
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Help & Feedback</DialogTitle>
                        <DialogDescription>
                            We'd love to hear your thoughts on how we can improve your experience.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="feedback-type" className="text-right">
                                Type
                            </Label>
                            <Select className="col-span-3">
                                <SelectTrigger className="bg-gray-700 text-white">
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white">
                                    <SelectItem value="bug">Bug Report</SelectItem>
                                    <SelectItem value="feature">Feature Request</SelectItem>
                                    <SelectItem value="general">General Feedback</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="feedback-message" className="text-right">
                                Message
                            </Label>
                            <Textarea
                                id="feedback-message"
                                placeholder="Type your feedback here..."
                                className="col-span-3 bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Submit Feedback</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    )
}