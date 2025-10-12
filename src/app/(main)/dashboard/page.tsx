/**
 * Dashboard Page - Main Analytics & Overview
 * 
 * Features:
 * - Responsive grid layout
 * - Key Performance Indicators (KPIs)
 * - Interactive charts and graphs
 * - Recent activity feed
 * - Customizable widgets
 * - Modern card-based design
 * - Mobile-optimized layout
 * 
 * @page
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

// Charts
import { 
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

// Icons
import { 
    ArrowUpRight, ArrowDownRight, Users, MessageSquare, Zap, Send, 
    Calendar, Filter, RefreshCw, Settings, TrendingUp, Target, Clock
} from 'lucide-react'

// Date utilities
import { format } from "date-fns"

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
    { name: 'Promotional', value: 400, color: 'hsl(var(--chart-1))' },
    { name: 'Transactional', value: 300, color: 'hsl(var(--chart-2))' },
    { name: 'Support', value: 200, color: 'hsl(var(--chart-3))' },
    { name: 'Automated', value: 100, color: 'hsl(var(--chart-4))' },
]

/**
 * Sample recent activities
 */
const recentActivities = [
    { id: 1, type: 'Campaign Sent', name: 'Summer Sale Promo', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'New Subscriber', name: 'John Doe', time: '4 hours ago', status: 'info' },
    { id: 3, type: 'Automation Triggered', name: 'Welcome Series', time: '6 hours ago', status: 'warning' },
    { id: 4, type: 'Message Responded', name: 'Support Ticket #1234', time: '8 hours ago', status: 'success' },
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
        console.log('Dashboard: Component mounted', { date, selectedMetric })
    }, [date, selectedMetric])

    /**
     * Handle refresh action
     */
    const handleRefresh = () => {
        console.log('Dashboard: Refreshing data')
        // TODO: Implement data refresh logic
    }

    /**
     * Handle filter action
     */
    const handleFilter = () => {
        console.log('Dashboard: Opening filters')
        // TODO: Implement filter logic
    }

    /**
     * Handle customize action
     */
    const handleCustomize = () => {
        console.log('Dashboard: Opening customization')
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
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here&apos;s what&apos;s happening with your campaigns.
                    </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="hover:bg-primary/10 transition-colors"
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
                        className="hover:bg-primary/10"
                        onClick={handleFilter}
                    >
                        <Filter className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="hover:bg-primary/10"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="hover:bg-primary/10"
                        onClick={handleCustomize}
                    >
                        <Settings className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Customize</span>
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid - Responsive */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Subscribers Card */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Subscribers
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">2,265</div>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            15% from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Messages Sent Card */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Messages Sent
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">15,789</div>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            23% from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Response Rate Card */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg. Response Rate
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">24.3%</div>
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-2">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            5% from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Active Campaigns Card */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Campaigns
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">7</div>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            2 more than last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid - Responsive */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Campaign Performance Chart */}
                <Card className="col-span-1 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle>Campaign Performance</CardTitle>
                            <CardDescription>Overview of your recent campaigns</CardDescription>
                        </div>
                        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                            <SelectTrigger className="w-[180px]">
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
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={campaignPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <Legend />
                                <Bar dataKey="sent" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="delivered" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="read" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="responded" fill="hsl(var(--chart-4))" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Audience Growth Chart */}
                <Card className="col-span-1 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Audience Growth</CardTitle>
                        <CardDescription>Subscriber trends over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={audienceGrowthData}>
                                <defs>
                                    <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="subscribers" 
                                    stroke="hsl(var(--chart-1))" 
                                    fillOpacity={1} 
                                    fill="url(#colorSubs)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="churn" 
                                    stroke="hsl(var(--chart-5))" 
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
                <Card className="col-span-1 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Message Types</CardTitle>
                        <CardDescription>Distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="col-span-1 lg:col-span-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div 
                                    key={activity.id} 
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-2 w-2 rounded-full ${
                                            activity.status === 'success' ? 'bg-green-500' :
                                            activity.status === 'warning' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                        }`} />
                                        <div>
                                            <p className="font-medium text-sm">{activity.type}</p>
                                            <p className="text-xs text-muted-foreground">{activity.name}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {activity.time}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customize Dashboard Dialog */}
            <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Customize Dashboard</DialogTitle>
                        <DialogDescription>
                            Choose which widgets to display and their order.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="kpi-cards">KPI Cards</Label>
                            <Switch id="kpi-cards" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="campaign-chart">Campaign Performance</Label>
                            <Switch id="campaign-chart" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="audience-chart">Audience Growth</Label>
                            <Switch id="audience-chart" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="message-types">Message Types</Label>
                            <Switch id="message-types" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="recent-activity">Recent Activity</Label>
                            <Switch id="recent-activity" checked={true} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsCustomizing(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-primary to-primary/80"
                            onClick={() => {
                                console.log('Dashboard: Saving customization')
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
