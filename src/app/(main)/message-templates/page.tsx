"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown, Plus, Search, Settings, Trash, MessageSquare, Edit, Copy, BarChart2, PieChart as PieChartIcon, Send, Eye, ThumbsUp, AlertCircle, CheckCircle2, MoreVertical, FileText, Tag, Clock, ArrowUpRight, Image, FileVideo, Paperclip, History, Sparkles, LayoutGrid } from "lucide-react"
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const templates = [
    { id: 1, name: "Welcome Message", content: "Welcome to our community! We're excited to have you on board. Here's what you can expect from us...", category: "Onboarding", status: "Active", usageCount: 1250, conversionRate: 15, sentiment: 0.8, version: 2, lastUpdated: "2023-06-15" },
    { id: 2, name: "Product Launch", content: "Exciting news! Our new product [Product Name] is now available. Be among the first to try it out! Use code LAUNCH20 for 20% off.", category: "Promotional", status: "Active", usageCount: 3000, conversionRate: 22, sentiment: 0.9, version: 3, lastUpdated: "2023-06-20" },
    { id: 3, name: "Abandoned Cart Reminder", content: "Hey there! We noticed you left some items in your cart. Don't miss out on these great deals. Complete your purchase now and get free shipping!", category: "Retargeting", status: "Active", usageCount: 5000, conversionRate: 18, sentiment: 0.7, version: 1, lastUpdated: "2023-06-18" },
    { id: 4, name: "Customer Feedback", content: "We value your opinion! Please take a moment to share your thoughts on your recent experience with us. Your feedback helps us improve.", category: "Engagement", status: "Active", usageCount: 2000, conversionRate: 12, sentiment: 0.6, version: 4, lastUpdated: "2023-06-22" },
    { id: 5, name: "Holiday Sale", content: "🎉 Our biggest sale of the year is here! Enjoy up to 50% off on all products. Shop now before stocks run out!", category: "Promotional", status: "Draft", usageCount: 0, conversionRate: 0, sentiment: 0, version: 1, lastUpdated: "2023-06-23" },
]

const templatePerformanceData = [
    { name: "Welcome Message", usage: 1250, engagement: 75, conversion: 15, sentiment: 80 },
    { name: "Product Launch", usage: 3000, engagement: 85, conversion: 22, sentiment: 90 },
    { name: "Abandoned Cart", usage: 5000, engagement: 60, conversion: 18, sentiment: 70 },
    { name: "Customer Feedback", usage: 2000, engagement: 50, conversion: 12, sentiment: 60 },
]

const templateUsageTrendData = [
    { date: '2023-01', Welcome: 100, ProductLaunch: 150, AbandonedCart: 200, CustomerFeedback: 80 },
    { date: '2023-02', Welcome: 120, ProductLaunch: 180, AbandonedCart: 220, CustomerFeedback: 90 },
    { date: '2023-03', Welcome: 140, ProductLaunch: 200, AbandonedCart: 240, CustomerFeedback: 100 },
    { date: '2023-04', Welcome: 160, ProductLaunch: 220, AbandonedCart: 260, CustomerFeedback: 110 },
    { date: '2023-05', Welcome: 180, ProductLaunch: 240, AbandonedCart: 280, CustomerFeedback: 120 },
    { date: '2023-06', Welcome: 200, ProductLaunch: 260, AbandonedCart: 300, CustomerFeedback: 130 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function EnhancedMessageTemplates() {
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [isEditingTemplate, setIsEditingTemplate] = useState(false)
    const [isScheduling, setIsScheduling] = useState(false)
    const [isABTesting, setIsABTesting] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [editorContent, setEditorContent] = useState('')

    const handleEditorChange = (content) => {
        setEditorContent(content)
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-gray-800 p-4 lg:p-6 border-r border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-purple-400">WhatsApp Pro Max</h2>
                <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        All Templates
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Tag className="mr-2 h-4 w-4" />
                        Categories
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Active
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Clock className="mr-2 h-4 w-4" />
                        Drafts
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analytics
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <History className="mr-2 h-4 w-4" />
                        Version History
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Sparkles className="mr-2 h-4 w-4" />
                        A/B Testing
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-purple-400">Message Templates</h1>
                        <p className="text-gray-400">Create, manage, and analyze your WhatsApp message templates</p>
                    </div>
                    <Button onClick={() => setIsCreatingTemplate(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" /> New Template
                    </Button>
                </div>

                <Tabs defaultValue="templates" className="space-y-4">
                    <TabsList className="bg-gray-800">
                        <TabsTrigger value="templates" className="data-[state=active]:bg-purple-600">Templates</TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
                        <TabsTrigger value="ab-testing" className="data-[state=active]:bg-purple-600">A/B Testing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="templates" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Input placeholder="Search templates..." className="w-64 bg-gray-800 border-gray-700 text-white" />
                                <Button variant="outline" size="icon" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex space-x-2">
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="onboarding">Onboarding</SelectItem>
                                        <SelectItem value="promotional">Promotional</SelectItem>
                                        <SelectItem value="retargeting">Retargeting</SelectItem>
                                        <SelectItem value="engagement">Engagement</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <LayoutGrid className="mr-2 h-4 w-4" />
                                    Grid View
                                </Button>
                            </div>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-purple-400">Template Library</CardTitle>
                                <CardDescription className="text-gray-400">Manage and edit your message templates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-700">
                                                <TableHead className="text-gray-300">Name</TableHead>
                                                <TableHead className="text-gray-300">Category</TableHead>
                                                <TableHead className="text-gray-300">Status</TableHead>
                                                <TableHead className="text-gray-300">Usage</TableHead>
                                                <TableHead className="text-gray-300">Conversion Rate</TableHead>
                                                <TableHead className="text-gray-300">Sentiment</TableHead>
                                                <TableHead className="text-gray-300">Version</TableHead>
                                                <TableHead className="text-gray-300">Last Updated</TableHead>
                                                <TableHead className="text-gray-300">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {templates.map((template) => (
                                                <TableRow key={template.id} className="border-gray-700">
                                                    <TableCell className="font-medium text-white">{template.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-gray-700 text-gray-300">
                                                            {template.category}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={template.status === 'Active' ? 'default' : 'secondary'} className={template.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'}>
                                                            {template.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">{template.usageCount.toLocaleString()}</TableCell>
                                                    <TableCell className="text-gray-300">{template.conversionRate}%</TableCell>
                                                    <TableCell className="text-gray-300">{(template.sentiment * 100).toFixed(0)}%</TableCell>
                                                    <TableCell className="text-gray-300">v{template.version}</TableCell>
                                                    <TableCell className="text-gray-300">{template.lastUpdated}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem className="hover:bg-gray-700" onClick={() => setSelectedTemplate(template)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-gray-700" onClick={() => {
                                                                    setSelectedTemplate(template)
                                                                    setIsEditingTemplate(true)
                                                                }}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-gray-700">
                                                                    <Copy className="mr-2 h-4 w-4" />
                                                                    Duplicate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-gray-700" onClick={() => setIsScheduling(true)}>
                                                                    <Clock className="mr-2 h-4 w-4" />
                                                                    Schedule
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-gray-700" onClick={() => setIsABTesting(true)}>
                                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                                    A/B Test
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-gray-700" />
                                                                <DropdownMenuItem className="hover:bg-gray-700 text-red-500">
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Total Templates</CardTitle>
                                    <FileText className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">24</div>
                                    <p className="text-xs text-gray-400">+2 new this month</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Avg. Usage</CardTitle>
                                    <ArrowUpRight className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">2,834</div>
                                    <p className="text-xs text-gray-400">+12.3% from last month</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Avg. Engagement Rate</CardTitle>
                                    <Eye className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">67.5%</div>
                                    <p className="text-xs text-gray-400">+5.2% from last month</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Avg. Conversion Rate</CardTitle>
                                    <ThumbsUp className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">16.8%</div>
                                    <p className="text-xs text-gray-400">+2.4% from last month</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-purple-400">Template Performance</CardTitle>
                                    <CardDescription className="text-gray-400">Comparison of usage, engagement, conversion rates, and sentiment</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={templatePerformanceData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="name" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                            <Legend />
                                            <Bar dataKey="usage" fill="#8884d8" />
                                            <Bar dataKey="engagement" fill="#82ca9d" />
                                            <Bar dataKey="conversion" fill="#ffc658" />
                                            <Bar dataKey="sentiment" fill="#ff8042" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-purple-400">Template Usage Trend</CardTitle>
                                    <CardDescription className="text-gray-400">Monthly usage trends for top templates</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={templateUsageTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="date" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="Welcome" stroke="#8884d8" />
                                            <Line type="monotone" dataKey="ProductLaunch" stroke="#82ca9d" />
                                            <Line type="monotone" dataKey="AbandonedCart" stroke="#ffc658" />
                                            <Line type="monotone" dataKey="CustomerFeedback" stroke="#ff7300" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-purple-400">Sentiment Analysis</CardTitle>
                                <CardDescription className="text-gray-400">Customer sentiment trends for each template</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={templateUsageTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                        <XAxis dataKey="date" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="Welcome" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="ProductLaunch" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="AbandonedCart" stroke="#ffc658" />
                                        <Line type="monotone" dataKey="CustomerFeedback" stroke="#ff7300" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ab-testing" className="space-y-4">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-purple-400">A/B Test Results</CardTitle>
                                <CardDescription className="text-gray-400">Compare performance of different template variations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-white">Welcome Message Test</h3>
                                        <Badge>Active</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-300 mb-2">Variation A</h4>
                                            <p className="text-sm text-gray-400 mb-2">Welcome! We're excited to have you join our community...</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Open Rate:</span>
                                                    <span className="text-white">68%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Click-through Rate:</span>
                                                    <span className="text-white">12%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Conversion Rate:</span>
                                                    <span className="text-white">5%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-300 mb-2">Variation B</h4>
                                            <p className="text-sm text-gray-400 mb-2">Hi there! Thanks for joining us. Here's what you can expect...</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Open Rate:</span>
                                                    <span className="text-white">72%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Click-through Rate:</span>
                                                    <span className="text-white">15%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Conversion Rate:</span>
                                                    <span className="text-white">7%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="outline" className="mr-2">View Details</Button>
                                        <Button>End Test & Choose Winner</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Create/Edit Template Dialog */}
                <Dialog open={isCreatingTemplate || isEditingTemplate} onOpenChange={(open) => {
                    setIsCreatingTemplate(open)
                    setIsEditingTemplate(open)
                }}>
                    <DialogContent className="sm:max-w-[800px] bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-purple-400">{isEditingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                {isEditingTemplate ? 'Edit your existing message template.' : 'Create a new message template for your WhatsApp campaigns.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="template-name" className="text-right text-gray-300">
                                    Name
                                </Label>
                                <Input id="template-name" placeholder="e.g., Welcome Message" className="col-span-3 bg-gray-700 border-gray-600 text-white" defaultValue={selectedTemplate?.name} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="template-category" className="text-right text-gray-300">
                                    Category
                                </Label>
                                <Select defaultValue={selectedTemplate?.category}>
                                    <SelectTrigger id="template-category" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                        <SelectItem value="onboarding">Onboarding</SelectItem>
                                        <SelectItem value="promotional">Promotional</SelectItem>
                                        <SelectItem value="retargeting">Retargeting</SelectItem>
                                        <SelectItem value="engagement">Engagement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="template-content" className="text-right text-gray-300 mt-2">
                                    Content
                                </Label>
                                <div className="col-span-3">
                                    <ReactQuill
                                        theme="snow"
                                        value={editorContent || selectedTemplate?.content}
                                        onChange={handleEditorChange}
                                        className="bg-gray-700 text-white rounded-md"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                ['link', 'image'],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="template-status" className="text-right text-gray-300">
                                    Status
                                </Label>
                                <div className="flex items-center space-x-2 col-span-3">
                                    <Switch id="template-status" defaultChecked={selectedTemplate?.status === 'Active'} />
                                    <Label htmlFor="template-status" className="text-gray-300">Active</Label>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">
                                    Attachments
                                </Label>
                                <div className="flex items-center space-x-2 col-span-3">
                                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Image className="mr-2 h-4 w-4" />
                                        Add Image
                                    </Button>
                                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <FileVideo className="mr-2 h-4 w-4" />
                                        Add Video
                                    </Button>
                                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Paperclip className="mr-2 h-4 w-4" />
                                        Add Document
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => {
                                setIsCreatingTemplate(false)
                                setIsEditingTemplate(false)
                            }} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                            <Button className="bg-purple-600 hover:bg-purple-700">{isEditingTemplate ? 'Update Template' : 'Create Template'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Template Dialog */}
                <Dialog open={!!selectedTemplate && !isEditingTemplate} onOpenChange={() => setSelectedTemplate(null)}>
                    <DialogContent className="sm:max-w-[625px] bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-purple-400">{selectedTemplate?.name}</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Template details and preview
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Category</Label>
                                <div className="col-span-3">
                                    <Badge variant="outline" className="bg-gray-700 text-gray-300">
                                        {selectedTemplate?.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Status</Label>
                                <div className="col-span-3">
                                    <Badge variant={selectedTemplate?.status === 'Active' ? 'default' : 'secondary'} className={selectedTemplate?.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'}>
                                        {selectedTemplate?.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Content</Label>
                                <div className="col-span-3 bg-gray-700 border border-gray-600 rounded-md p-2">
                                    {selectedTemplate?.content}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Usage</Label>
                                <div className="col-span-3 text-gray-300">{selectedTemplate?.usageCount.toLocaleString()} times</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Conversion Rate</Label>
                                <div className="col-span-3 text-gray-300">{selectedTemplate?.conversionRate}%</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Sentiment</Label>
                                <div className="col-span-3 text-gray-300">{(selectedTemplate?.sentiment * 100).toFixed(0)}% Positive</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Version</Label>
                                <div className="col-span-3 text-gray-300">v{selectedTemplate?.version}</div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Close</Button>
                            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsEditingTemplate(true)}>Edit Template</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Schedule Template Dialog */}
                <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                    <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-purple-400">Schedule Template</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Set up when you want this template to be sent.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="schedule-date" className="text-right text-gray-300">
                                    Date
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="schedule-time" className="text-right text-gray-300">
                                    Time
                                </Label>
                                <Select>
                                    <SelectTrigger id="schedule-time" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                        <SelectItem value="09:00">09:00 AM</SelectItem>
                                        <SelectItem value="12:00">12:00 PM</SelectItem>
                                        <SelectItem value="15:00">03:00 PM</SelectItem>
                                        <SelectItem value="18:00">06:00 PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="schedule-repeat" className="text-right text-gray-300">
                                    Repeat
                                </Label>
                                <Select>
                                    <SelectTrigger id="schedule-repeat" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                        <SelectItem value="once">Once</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsScheduling(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                            <Button className="bg-purple-600 hover:bg-purple-700">Schedule</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* A/B Testing Dialog */}
                <Dialog open={isABTesting} onOpenChange={setIsABTesting}>
                    <DialogContent className="sm:max-w-[625px] bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-purple-400">Create A/B Test</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Set up an A/B test for your template to optimize performance.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="test-name" className="text-right text-gray-300">
                                    Test Name
                                </Label>
                                <Input id="test-name" placeholder="e.g., Welcome Message Test" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right text-gray-300 mt-2">
                                    Variations
                                </Label>
                                <div className="col-span-3 space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-300">Variation A (Control)</h4>
                                        <Textarea placeholder="Enter content for Variation A" className="bg-gray-700 border-gray-600 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-300">Variation B</h4>
                                        <Textarea placeholder="Enter content for Variation B" className="bg-gray-700 border-gray-600 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="test-metric" className="text-right text-gray-300">
                                    Success Metric
                                </Label>
                                <Select>
                                    <SelectTrigger id="test-metric" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select primary metric" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                        <SelectItem value="open-rate">Open Rate</SelectItem>
                                        <SelectItem value="click-through">Click-through Rate</SelectItem>
                                        <SelectItem value="conversion">Conversion Rate</SelectItem>
                                        <SelectItem value="engagement">Engagement Rate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="test-duration" className="text-right text-gray-300">
                                    Test Duration
                                </Label>
                                <Select>
                                    <SelectTrigger id="test-duration" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select test duration" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sample-size" className="text-right text-gray-300">
                                    Sample Size
                                </Label>
                                <div className="col-span-3 flex items-center space-x-2">
                                    <Slider
                                        id="sample-size"
                                        defaultValue={[50]}
                                        max={100}
                                        step={10}
                                        className="w-[60%]"
                                    />
                                    <span className="text-gray-300">50% of audience</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsABTesting(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                            <Button className="bg-purple-600 hover:bg-purple-700">Start A/B Test</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}