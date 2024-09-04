"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, MessageSquare, BarChart2, Zap, Send, Calendar, Filter, RefreshCw, Settings, Download, Maximize2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const campaignPerformanceData = [
    { name: 'Campaign A', sent: 1000, delivered: 980, read: 750, responded: 200, conversion: 15 },
    { name: 'Campaign B', sent: 1500, delivered: 1450, read: 1200, responded: 350, conversion: 20 },
    { name: 'Campaign C', sent: 800, delivered: 790, read: 600, responded: 150, conversion: 12 },
    { name: 'Campaign D', sent: 2000, delivered: 1950, read: 1600, responded: 500, conversion: 18 },
]

const audienceGrowthData = [
    { name: 'Jan', subscribers: 1000, churn: 50 },
    { name: 'Feb', subscribers: 1200, churn: 60 },
    { name: 'Mar', subscribers: 1400, churn: 55 },
    { name: 'Apr', subscribers: 1600, churn: 70 },
    { name: 'May', subscribers: 1900, churn: 80 },
    { name: 'Jun', subscribers: 2200, churn: 90 },
]

const messageTypeData = [
    { name: 'Promotional', value: 400 },
    { name: 'Transactional', value: 300 },
    { name: 'Customer Support', value: 200 },
    { name: 'Automated', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const recentActivities = [
    { id: 1, type: 'Campaign Sent', name: 'Summer Sale Promo', time: '2 hours ago' },
    { id: 2, type: 'New Subscriber', name: 'John Doe', time: '4 hours ago' },
    { id: 3, type: 'Automation Triggered', name: 'Welcome Series', time: '6 hours ago' },
    { id: 4, type: 'Message Responded', name: 'Support Ticket #1234', time: '8 hours ago' },
]

export default function Dashboard() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isCustomizing, setIsCustomizing] = useState(false)
    const [widgets, setWidgets] = useState([
        { id: 'kpi', title: 'Key Performance Indicators' },
        { id: 'campaign', title: 'Campaign Performance' },
        { id: 'audience', title: 'Audience Growth' },
        { id: 'message', title: 'Message Types' },
        { id: 'activity', title: 'Recent Activity' },
    ])

    const onDragEnd = (result) => {
        if (!result.destination) {
            return
        }

        const items = Array.from(widgets)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setWidgets(items)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8 pt-[90px]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-400">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
                                <Calendar className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white" onClick={() => setIsCustomizing(true)}>
                        <Settings className="mr-2 h-4 w-4" /> Customize
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dashboard">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {widgets.map((widget, index) => (
                                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            {widget.id === 'kpi' && (
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="text-purple-400">Key Performance Indicators</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-gray-400">Total Subscribers</Label>
                                                            <div className="flex items-center">
                                                                <Users className="h-4 w-4 text-purple-400 mr-2" />
                                                                <span className="text-2xl font-bold">2,265</span>
                                                            </div>
                                                            <p className="text-xs text-green-500 flex items-center">
                                                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                                                15% from last month
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-gray-400">Messages Sent</Label>
                                                            <div className="flex items-center">
                                                                <Send className="h-4 w-4 text-purple-400 mr-2" />
                                                                <span className="text-2xl font-bold">15,789</span>
                                                            </div>
                                                            <p className="text-xs text-green-500 flex items-center">
                                                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                                                23% from last month
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-gray-400">Avg. Response Rate</Label>
                                                            <div className="flex items-center">
                                                                <MessageSquare className="h-4 w-4 text-purple-400 mr-2" />
                                                                <span className="text-2xl font-bold">24.3%</span>
                                                            </div>
                                                            <p className="text-xs text-red-500 flex items-center">
                                                                <ArrowDownRight className="h-4 w-4 mr-1" />
                                                                5% from last month
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-gray-400">Active Campaigns</Label>
                                                            <div className="flex items-center">
                                                                <Zap className="h-4 w-4 text-purple-400 mr-2" />
                                                                <span className="text-2xl font-bold">7</span>
                                                            </div>
                                                            <p className="text-xs text-green-500 flex items-center">
                                                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                                                2 more than last month
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {widget.id === 'campaign' && (
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader className="flex flex-row items-center justify-between">
                                                        <CardTitle className="text-purple-400">Campaign Performance</CardTitle>
                                                        <Select defaultValue="sent">
                                                            <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                                                                <SelectValue placeholder="Select metric" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-gray-700 text-white">
                                                                <SelectItem value="sent">Messages Sent</SelectItem>
                                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                                <SelectItem value="read">Read</SelectItem>
                                                                <SelectItem value="responded">Responded</SelectItem>
                                                                <SelectItem value="conversion">Conversion</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ResponsiveContainer width="100%" height={300}>
                                                            <BarChart data={campaignPerformanceData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                                <XAxis dataKey="name" stroke="#888" />
                                                                <YAxis stroke="#888" />
                                                                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                                                <Legend />
                                                                <Bar dataKey="sent" fill="#8884d8" />
                                                                <Bar dataKey="delivered" fill="#82ca9d" />
                                                                <Bar dataKey="read" fill="#ffc658" />
                                                                <Bar dataKey="responded" fill="#ff8042" />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {widget.id === 'audience' && (
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="text-purple-400">Audience Growth</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ResponsiveContainer width="100%" height={300}>
                                                            <AreaChart data={audienceGrowthData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                                <XAxis dataKey="name" stroke="#888" />
                                                                <YAxis stroke="#888" />
                                                                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                                                <Legend />
                                                                <Area type="monotone" dataKey="subscribers" stroke="#8884d8" fill="#8884d8" />
                                                                <Area type="monotone" dataKey="churn" stroke="#82ca9d" fill="#82ca9d" />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {widget.id === 'message' && (
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="text-purple-400">Message Types</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ResponsiveContainer width="100%" height={300}>
                                                            <PieChart>
                                                                <Pie
                                                                    data={messageTypeData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    labelLine={false}
                                                                    outerRadius={80}
                                                                    fill="#8884d8"
                                                                    dataKey="value"
                                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                                >
                                                                    {messageTypeData.map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                    ))}
                                                                </Pie>
                                                                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                                                <Legend />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {widget.id === 'activity' && (
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="text-purple-400">Recent Activity</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ul className="space-y-4">
                                                            {recentActivities.map((activity) => (
                                                                <li key={activity.id} className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">{activity.type}</p>
                                                                        <p className="text-sm text-gray-400">{activity.name}</p>
                                                                    </div>
                                                                    <Badge variant="secondary">{activity.time}</Badge>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Customize Dashboard</DialogTitle>
                        <DialogDescription>Choose which widgets to display and their order.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {widgets.map((widget) => (
                            <div key={widget.id} className="flex items-center justify-between">
                                <Label htmlFor={widget.id}>{widget.title}</Label>
                                <Switch id={widget.id} checked={true} />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}