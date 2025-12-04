/**
 * ============================================
 * DASHBOARD PAGE - Modern Light Theme
 * ============================================
 * 
 * Main analytics & overview dashboard featuring:
 * - Beautiful KPI cards with gradients
 * - Interactive charts with light theme
 * - Real-time activity feed
 * - Responsive grid layout
 * - Modern card-based design
 * - Smooth animations
 * - Mobile-optimized
 * 
 * @page
 * @version 2.0.0
 */

"use client"

import React, { useState, useEffect } from 'react'

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Charts
import { 
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

// Icons
import { 
    ArrowUpRight, ArrowDownRight, Users, MessageSquare, Zap, Send, 
    Calendar, Filter, RefreshCw, Settings, TrendingUp, Target, Clock,
    Sparkles, Eye, MousePointerClick, DollarSign
} from 'lucide-react'

// Date utilities
import { format } from "date-fns"
import { cn } from "@/lib/utils"

/**
 * Sample data for campaign performance
 */
const campaignPerformanceData = [
    { name: 'Campaign A', sent: 1000, delivered: 980, read: 750, responded: 200 },
    { name: 'Campaign B', sent: 1500, delivered: 1450, read: 1200, responded: 350 },
    { name: 'Campaign C', sent: 800, delivered: 790, read: 600, responded: 150 },
    { name: 'Campaign D', sent: 2000, delivered: 1950, read: 1600, responded: 500 },
]

/**
 * Sample data for audience growth
 */
const audienceGrowthData = [
    { name: 'Jan', subscribers: 1000, churn: 50 },
    { name: 'Feb', subscribers: 1200, churn: 60 },
    { name: 'Mar', subscribers: 1400, churn: 55 },
    { name: 'Apr', subscribers: 1600, churn: 70 },
    { name: 'May', subscribers: 1900, churn: 80 },
    { name: 'Jun', subscribers: 2200, churn: 90 },
]

/**
 * Sample data for message types distribution
 */
const messageTypeData = [
    { name: 'Promotional', value: 400, color: '#8b5cf6' },
    { name: 'Transactional', value: 300, color: '#14b8a6' },
    { name: 'Support', value: 200, color: '#f59e0b' },
    { name: 'Automated', value: 100, color: '#3b82f6' },
]

/**
 * Sample recent activities
 */
const recentActivities = [
    { 
        id: 1, 
        type: 'Campaign Sent', 
        name: 'Summer Sale Promo', 
        time: '2 hours ago', 
        status: 'success',
        icon: Send,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    { 
        id: 2, 
        type: 'New Subscriber', 
        name: 'John Doe', 
        time: '4 hours ago', 
        status: 'info',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    { 
        id: 3, 
        type: 'Automation Triggered', 
        name: 'Welcome Series', 
        time: '6 hours ago', 
        status: 'warning',
        icon: Zap,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
    },
    { 
        id: 4, 
        type: 'Message Responded', 
        name: 'Support Ticket #1234', 
        time: '8 hours ago', 
        status: 'success',
        icon: MessageSquare,
        color: 'text-teal-600',
        bgColor: 'bg-teal-100',
    },
]

/**
 * Dashboard Main Component
 */
export default function Dashboard() {
    // State management
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isCustomizing, setIsCustomizing] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState('sent')
    const [mounted, setMounted] = useState(false)

    /**
     * Component mount effect
     */
    useEffect(() => {
        setMounted(true)
        console.log('🎨 Dashboard: Page loaded with modern light theme')
        console.log('📅 Current date:', date)
        console.log('📊 Selected metric:', selectedMetric)
    }, [date, selectedMetric])

    /**
     * Handle refresh action
     */
    const handleRefresh = () => {
        console.log('🔄 Dashboard: Refreshing data')
        // TODO: Implement data refresh logic
    }

    /**
     * Handle filter action
     */
    const handleFilter = () => {
        console.log('🔍 Dashboard: Opening filters')
        // TODO: Implement filter logic
    }

    /**
     * Handle customize action
     */
    const handleCustomize = () => {
        console.log('⚙️ Dashboard: Opening customization')
        setIsCustomizing(true)
    }

    if (!mounted) {
        return null
    }

    return (
        <div className="flex flex-col space-y-6 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Welcome back! Here's what's happening with your campaigns.
                    </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {date ? format(date, "PPP") : "Pick a date"}
                                </span>
                                <span className="sm:hidden">Date</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    
                    <Button 
                        variant="outline" 
                        className="hover:bg-primary/5 hover:border-primary/50 rounded-xl"
                        onClick={handleFilter}
                    >
                        <Filter className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="hover:bg-primary/5 hover:border-primary/50 rounded-xl"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="hover:bg-primary/5 hover:border-primary/50 rounded-xl"
                        onClick={handleCustomize}
                    >
                        <Settings className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Customize</span>
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid - Modern Light Design */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Subscribers Card */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            Total Subscribers
                        </CardTitle>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            2,265
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-semibold">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +15%
                            </Badge>
                            <span className="text-xs text-muted-foreground">from last month</span>
                        </div>
                        <Progress value={75} className="h-2 bg-blue-100" />
                    </CardContent>
                </Card>

                {/* Messages Sent Card */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-white to-white dark:from-purple-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            Messages Sent
                        </CardTitle>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Send className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                            15,789
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-semibold">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +23%
                            </Badge>
                            <span className="text-xs text-muted-foreground">from last month</span>
                        </div>
                        <Progress value={85} className="h-2 bg-purple-100" />
                    </CardContent>
                </Card>

                {/* Response Rate Card */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 via-white to-white dark:from-orange-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            Avg. Response Rate
                        </CardTitle>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                            24.3%
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-semibold">
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                -5%
                            </Badge>
                            <span className="text-xs text-muted-foreground">from last month</span>
                        </div>
                        <Progress value={24} className="h-2 bg-orange-100" />
                    </CardContent>
                </Card>

                {/* Active Campaigns Card */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 via-white to-white dark:from-green-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            Active Campaigns
                        </CardTitle>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                            7
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-semibold">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +2
                            </Badge>
                            <span className="text-xs text-muted-foreground">more than last month</span>
                        </div>
                        <Progress value={70} className="h-2 bg-green-100" />
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid - Modern Light Design */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Campaign Performance Chart */}
                <Card className="col-span-1 hover:shadow-xl transition-all duration-300 rounded-2xl border-border/50">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 border-b bg-gradient-to-r from-primary/5 to-transparent">
                        <div>
                            <CardTitle className="text-xl font-bold">Campaign Performance</CardTitle>
                            <CardDescription className="text-muted-foreground">Overview of your recent campaigns</CardDescription>
                        </div>
                        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                            <SelectTrigger className="w-[180px] rounded-xl">
                                <SelectValue placeholder="Select metric" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sent">Messages Sent</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="responded">Responded</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={campaignPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Legend />
                                <Bar dataKey="sent" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="delivered" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="read" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="responded" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Audience Growth Chart */}
                <Card className="col-span-1 hover:shadow-xl transition-all duration-300 rounded-2xl border-border/50">
                    <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                        <CardTitle className="text-xl font-bold">Audience Growth</CardTitle>
                        <CardDescription className="text-muted-foreground">Subscriber trends over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={audienceGrowthData}>
                                <defs>
                                    <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }} 
                                />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="subscribers" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorSubs)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="churn" 
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorChurn)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid - Message Types & Recent Activity */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Message Types Pie Chart */}
                <Card className="col-span-1 hover:shadow-xl transition-all duration-300 rounded-2xl border-border/50">
                    <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                        <CardTitle className="text-xl font-bold">Message Types</CardTitle>
                        <CardDescription className="text-muted-foreground">Distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={messageTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {messageTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="col-span-1 lg:col-span-2 hover:shadow-xl transition-all duration-300 rounded-2xl border-border/50">
                    <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                        <CardDescription className="text-muted-foreground">Latest updates and events</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div 
                                        key={activity.id} 
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/20 group"
                                    >
                                        <div className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 transition-transform group-hover:scale-110",
                                            activity.bgColor
                                        )}>
                                            <activity.icon className={cn("h-6 w-6", activity.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{activity.type}</p>
                                            <p className="text-sm text-muted-foreground truncate">{activity.name}</p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-medium flex-shrink-0">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {activity.time}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Customize Dashboard Dialog */}
            <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Customize Dashboard</DialogTitle>
                        <DialogDescription>
                            Choose which widgets to display and their order.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Label htmlFor="kpi-cards" className="font-semibold">KPI Cards</Label>
                            <Switch id="kpi-cards" checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Label htmlFor="campaign-chart" className="font-semibold">Campaign Performance</Label>
                            <Switch id="campaign-chart" checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Label htmlFor="audience-chart" className="font-semibold">Audience Growth</Label>
                            <Switch id="audience-chart" checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Label htmlFor="message-types" className="font-semibold">Message Types</Label>
                            <Switch id="message-types" checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Label htmlFor="recent-activity" className="font-semibold">Recent Activity</Label>
                            <Switch id="recent-activity" checked={true} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsCustomizing(false)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-primary to-primary/80 font-semibold rounded-xl"
                            onClick={() => {
                                console.log('💾 Dashboard: Saving customization')
                                setIsCustomizing(false)
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
