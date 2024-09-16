"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown, Filter, Download, Share2, Maximize2, BarChart, LineChart, PieChart, TrendingUp, Users, MessageSquare, Zap, Send, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Checkbox } from '@/components/ui/checkbox'

const campaignPerformanceData = [
    { name: 'Campaign A', sent: 1000, delivered: 980, read: 750, responded: 200, conversion: 15 },
    { name: 'Campaign B', sent: 1500, delivered: 1450, read: 1200, responded: 350, conversion: 20 },
    { name: 'Campaign C', sent: 800, delivered: 790, read: 600, responded: 150, conversion: 12 },
    { name: 'Campaign D', sent: 2000, delivered: 1950, read: 1600, responded: 500, conversion: 18 },
]

const audienceEngagementData = [
    { date: '2023-01-01', newSubscribers: 100, activeUsers: 800, churnedUsers: 20 },
    { date: '2023-02-01', newSubscribers: 120, activeUsers: 850, churnedUsers: 25 },
    { date: '2023-03-01', newSubscribers: 150, activeUsers: 900, churnedUsers: 30 },
    { date: '2023-04-01', newSubscribers: 200, activeUsers: 1000, churnedUsers: 35 },
    { date: '2023-05-01', newSubscribers: 180, activeUsers: 1100, churnedUsers: 40 },
    { date: '2023-06-01', newSubscribers: 220, activeUsers: 1200, churnedUsers: 45 },
]

const messageTypeData = [
    { name: 'Promotional', value: 400 },
    { name: 'Transactional', value: 300 },
    { name: 'Customer Support', value: 200 },
    { name: 'Automated', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const cohortData = [
    { cohort: 'Jan 2023', month1: 100, month2: 80, month3: 70, month4: 65, month5: 60, month6: 58 },
    { cohort: 'Feb 2023', month1: 120, month2: 95, month3: 85, month4: 78, month5: 72 },
    { cohort: 'Mar 2023', month1: 150, month2: 125, month3: 110, month4: 100 },
    { cohort: 'Apr 2023', month1: 200, month2: 170, month3: 155 },
    { cohort: 'May 2023', month1: 180, month2: 155 },
    { cohort: 'Jun 2023', month1: 220 },
]

const predictiveData = [
    { month: 'Jul', actual: null, predicted: 1300 },
    { month: 'Aug', actual: null, predicted: 1450 },
    { month: 'Sep', actual: null, predicted: 1600 },
    { month: 'Oct', actual: null, predicted: 1800 },
]

export default function Analytics() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isCustomReportModalOpen, setIsCustomReportModalOpen] = useState(false)

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-400">Analytics</h1>
                <div className="flex items-center space-x-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal bg-gray-800 border-gray-700 text-white",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date range</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                            <Calendar
                                mode="range"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                className="bg-gray-800 text-white"
                            />
                        </PopoverContent>
                    </Popover>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Filter by campaign" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="all">All Campaigns</SelectItem>
                            <SelectItem value="campaign-a">Campaign A</SelectItem>
                            <SelectItem value="campaign-b">Campaign B</SelectItem>
                            <SelectItem value="campaign-c">Campaign C</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
                        <Filter className="mr-2 h-4 w-4" />
                        More Filters
                    </Button>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white" onClick={() => setIsCustomReportModalOpen(true)}>
                        <BarChart className="mr-2 h-4 w-4" />
                        Custom Report
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-gray-800">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
                    <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">Campaigns</TabsTrigger>
                    <TabsTrigger value="audience" className="data-[state=active]:bg-purple-600">Audience</TabsTrigger>
                    <TabsTrigger value="messages" className="data-[state=active]:bg-purple-600">Messages</TabsTrigger>
                    <TabsTrigger value="predictive" className="data-[state=active]:bg-purple-600">Predictive Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-300">Total Sent</CardTitle>
                                <Send className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">5,300</div>
                                <p className="text-xs text-green-500 flex items-center">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    12% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-300">Delivery Rate</CardTitle>
                                <TrendingUp className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">98.2%</div>
                                <p className="text-xs text-green-500 flex items-center">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    0.5% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-300">Open Rate</CardTitle>
                                <MessageSquare className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">75.8%</div>
                                <p className="text-xs text-red-500 flex items-center">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    2.3% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-300">Response Rate</CardTitle>
                                <Users className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">22.6%</div>
                                <p className="text-xs text-green-500 flex items-center">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    3.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Campaign Performance Overview</CardTitle>
                            <CardDescription className="text-gray-400">Comparison of key metrics across campaigns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsBarChart data={campaignPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Bar dataKey="sent" fill="#8884d8" />
                                    <Bar dataKey="delivered" fill="#82ca9d" />
                                    <Bar dataKey="read" fill="#ffc658" />
                                    <Bar dataKey="responded" fill="#ff8042" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Campaign Conversion Rates</CardTitle>
                            <CardDescription className="text-gray-400">Conversion rates for each campaign</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsBarChart data={campaignPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Bar dataKey="conversion" fill="#8884d8" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Campaign Comparison</CardTitle>
                            <CardDescription className="text-gray-400">Side-by-side comparison of campaign metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Sent</TableHead>
                                        <TableHead>Delivered</TableHead>
                                        <TableHead>Read</TableHead>
                                        <TableHead>Responded</TableHead>
                                        <TableHead>Conversion</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignPerformanceData.map((campaign) => (
                                        <TableRow key={campaign.name}>
                                            <TableCell>{campaign.name}</TableCell>
                                            <TableCell>{campaign.sent}</TableCell>
                                            <TableCell>{campaign.delivered}</TableCell>
                                            <TableCell>{campaign.read}</TableCell>
                                            <TableCell>{campaign.responded}</TableCell>
                                            <TableCell>{campaign.conversion}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audience" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Audience Engagement Trends</CardTitle>
                            <CardDescription className="text-gray-400">New subscribers, active users, and churn over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={audienceEngagementData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="date" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="newSubscribers" stackId="1" stroke="#8884d8" fill="#8884d8" />
                                    <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                    <Area type="monotone" dataKey="churnedUsers" stackId="1" stroke="#ffc658" fill="#ffc658" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Cohort Analysis</CardTitle>
                            <CardDescription className="text-gray-400">Retention rates for different cohorts over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsLineChart data={cohortData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="cohort" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="month1" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="month2" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="month3" stroke="#ffc658" />
                                    <Line type="monotone" dataKey="month4" stroke="#ff8042" />
                                    <Line type="monotone" dataKey="month5" stroke="#a4de6c" />
                                    <Line type="monotone" dataKey="month6" stroke="#d0ed57" />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Message Type Distribution</CardTitle>
                            <CardDescription className="text-gray-400">Breakdown of messages by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsPieChart>
                                    <Pie
                                        data={messageTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={150}
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
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Message Engagement Analysis</CardTitle>
                            <CardDescription className="text-gray-400">Correlation between message length and engagement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis type="number" dataKey="messageLength" name="Message Length" unit=" chars" stroke="#888" />
                                    <YAxis type="number" dataKey="engagementRate" name="Engagement Rate" unit="%" stroke="#888" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Scatter name="Messages" data={[
                                        { messageLength: 50, engagementRate: 15 },
                                        { messageLength: 100, engagementRate: 25 },
                                        { messageLength: 150, engagementRate: 20 },
                                        { messageLength: 200, engagementRate: 18 },
                                        { messageLength: 250, engagementRate: 15 },
                                    ]} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="predictive" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Predictive Subscriber Growth</CardTitle>
                            <CardDescription className="text-gray-400">Forecasted subscriber growth for the next 3 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsLineChart data={[...audienceEngagementData, ...predictiveData]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="date" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="predicted" stroke="#8884d8" strokeDasharray="5 5" />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Churn Risk Analysis</CardTitle>
                            <CardDescription className="text-gray-400">Subscribers at risk of churning in the next 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subscriber</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead>Engagement Score</TableHead>
                                        <TableHead>Churn Risk</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>user1@example.com</TableCell>
                                        <TableCell>15 days ago</TableCell>
                                        <TableCell>35%</TableCell>
                                        <TableCell><Badge className="bg-red-600">High</Badge></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>user2@example.com</TableCell>
                                        <TableCell>7 days ago</TableCell>
                                        <TableCell>60%</TableCell>
                                        <TableCell><Badge className="bg-yellow-600">Medium</Badge></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>user3@example.com</TableCell>
                                        <TableCell>2 days ago</TableCell>
                                        <TableCell>85%</TableCell>
                                        <TableCell><Badge className="bg-green-600">Low</Badge></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isCustomReportModalOpen} onOpenChange={setIsCustomReportModalOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Generate Custom Report</DialogTitle>
                        <DialogDescription>Select metrics and date range for your custom report.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="metrics" className="text-right">Metrics</Label>
                            <div className="col-span-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="sent" />
                                    <Label htmlFor="sent">Messages Sent</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="delivered" />
                                    <Label htmlFor="delivered">Delivery Rate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="opened" />
                                    <Label htmlFor="opened">Open Rate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="responded" />
                                    <Label htmlFor="responded">Response Rate</Label>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date-range" className="text-right">Date Range</Label>
                            <Select>
                                <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white">
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="format" className="text-right">Format</Label>
                            <Select>
                                <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white">
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="xlsx">Excel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Generate Report</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}