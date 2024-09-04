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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown, Plus, Search, Settings, Trash, Users, UserPlus, Filter, Download, Upload, PieChart as PieChartIcon, Target, BellRing, Smartphone, Globe, TrendingUp, MoreVertical, Edit, UserCheck, UserX, Tags } from "lucide-react"

const contacts = [
    { id: 1, name: "Alice Johnson", phone: "+1234567890", tags: ["VIP", "Frequent Buyer"], lastInteraction: "2023-06-15" },
    { id: 2, name: "Bob Smith", phone: "+1987654321", tags: ["New Customer"], lastInteraction: "2023-06-20" },
    { id: 3, name: "Charlie Brown", phone: "+1122334455", tags: ["Inactive"], lastInteraction: "2023-05-01" },
    { id: 4, name: "Diana Prince", phone: "+1555666777", tags: ["VIP", "Influencer"], lastInteraction: "2023-06-22" },
    { id: 5, name: "Ethan Hunt", phone: "+1999888777", tags: ["Frequent Buyer"], lastInteraction: "2023-06-18" },
]

const segments = [
    { id: 1, name: "VIP Customers", count: 250, criteria: "Spent over $1000 in last 3 months" },
    { id: 2, name: "Inactive Users", count: 1500, criteria: "No purchase in last 6 months" },
    { id: 3, name: "New Subscribers", count: 750, criteria: "Joined in last 30 days" },
    { id: 4, name: "Frequent Buyers", count: 1000, criteria: "More than 5 purchases in last 3 months" },
    { id: 5, name: "Birthday This Month", count: 300, criteria: "Birthday falls in current month" },
]

const engagementData = [
    { name: 'VIP Customers', value: 400 },
    { name: 'Inactive Users', value: 300 },
    { name: 'New Subscribers', value: 300 },
    { name: 'Frequent Buyers', value: 200 },
]

const growthData = [
    { name: 'Jan', subscribers: 4000 },
    { name: 'Feb', subscribers: 4500 },
    { name: 'Mar', subscribers: 5000 },
    { name: 'Apr', subscribers: 5500 },
    { name: 'May', subscribers: 6200 },
    { name: 'Jun', subscribers: 7000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AudienceManagement() {
    const [isAddingContact, setIsAddingContact] = useState(false)
    const [isCreatingSegment, setIsCreatingSegment] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-gray-800 p-4 lg:p-6 border-r border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-purple-400">WhatsApp Pro Max</h2>
                <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Users className="mr-2 h-4 w-4" />
                        Contacts
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Target className="mr-2 h-4 w-4" />
                        Segments
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <PieChartIcon className="mr-2 h-4 w-4" />
                        Analytics
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                        <Download className="mr-2 h-4 w-4" />
                        Export
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
                        <h1 className="text-3xl font-bold text-purple-400">Audience Management</h1>
                        <p className="text-gray-400">Manage and analyze your WhatsApp contacts and segments</p>
                    </div>
                    <Button onClick={() => setIsAddingContact(true)} className="bg-purple-600 hover:bg-purple-700">
                        <UserPlus className="mr-2 h-4 w-4" /> Add Contact
                    </Button>
                </div>

                <Tabs defaultValue="contacts" className="space-y-4">
                    <TabsList className="bg-gray-800">
                        <TabsTrigger value="contacts" className="data-[state=active]:bg-purple-600">Contacts</TabsTrigger>
                        <TabsTrigger value="segments" className="data-[state=active]:bg-purple-600">Segments</TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="contacts" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Input placeholder="Search contacts..." className="w-64 bg-gray-800 border-gray-700 text-white" />
                                <Button variant="outline" size="icon" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex space-x-2">
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                                        <SelectValue placeholder="Filter by tag" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                        <SelectItem value="all">All Contacts</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                        <SelectItem value="frequent">Frequent Buyer</SelectItem>
                                        <SelectItem value="new">New Customer</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <Filter className="mr-2 h-4 w-4" />
                                    More Filters
                                </Button>
                            </div>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-purple-400">Contact List</CardTitle>
                                <CardDescription className="text-gray-400">Manage your WhatsApp contacts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-700">
                                                <TableHead className="text-gray-300">Name</TableHead>
                                                <TableHead className="text-gray-300">Phone</TableHead>
                                                <TableHead className="text-gray-300">Tags</TableHead>
                                                <TableHead className="text-gray-300">Last Interaction</TableHead>
                                                <TableHead className="text-gray-300">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contacts.map((contact) => (
                                                <TableRow key={contact.id} className="border-gray-700">
                                                    <TableCell className="font-medium text-white">
                                                        <div className="flex items-center space-x-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={contact.name} />
                                                                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{contact.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">{contact.phone}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {contact.tags.map((tag, index) => (
                                                                <Badge key={index} variant="outline" className="bg-gray-700 text-gray-300">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">{contact.lastInteraction}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem className="hover:bg-gray-700">
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Contact
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-gray-700">
                                                                    <Tags className="mr-2 h-4 w-4" />
                                                                    Manage Tags
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-gray-700">
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    Add to Segment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-gray-700" />
                                                                <DropdownMenuItem className="hover:bg-gray-700 text-red-500">
                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                    Remove Contact
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

                    <TabsContent value="segments" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Input placeholder="Search segments..." className="w-64 bg-gray-800 border-gray-700 text-white" />
                            <Button onClick={() => setIsCreatingSegment(true)} className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="mr-2 h-4 w-4" /> Create Segment
                            </Button>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-purple-400">Audience Segments</CardTitle>
                                <CardDescription className="text-gray-400">Manage your custom audience segments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <div className="space-y-4">
                                        {segments.map((segment) => (
                                            <div key={segment.id} className="p-4 border border-gray-700 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">{segment.name}</h3>
                                                        <p className="text-sm text-gray-400">{segment.criteria}</p>
                                                    </div>
                                                    <Badge>{segment.count} contacts</Badge>
                                                </div>
                                                <div className="mt-4 flex justify-end space-x-2">
                                                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                                                        Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                                                        View Contacts
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Total Contacts</CardTitle>
                                    <Users className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">10,482</div>
                                    <p className="text-xs text-gray-400">+2.5% from last month</p>
                                    <Progress value={75} className="mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Active Segments</CardTitle>
                                    <Target className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">24</div>
                                    <p className="text-xs text-gray-400">+4 new segments this month</p>
                                    <Progress value={60} className="mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Engagement Rate</CardTitle>
                                    <div className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">68.7%</div>
                                    <p className="text-xs text-gray-400">+5.4% from last month</p>
                                    <Progress value={68.7} className="mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-300">Avg. Response Time</CardTitle>
                                    <BellRing className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">3.2h</div>
                                    <p className="text-xs text-gray-400">-0.5h from last month</p>
                                    <Progress value={80} className="mt-2" />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-purple-400">Audience Growth</CardTitle>
                                    <CardDescription className="text-gray-400">Monthly subscriber growth</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={growthData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="name" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="subscribers" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-purple-400">Segment Engagement</CardTitle>
                                    <CardDescription className="text-gray-400">Engagement levels across segments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={engagementData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {engagementData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Add Contact Dialog */}
                <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                    <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-purple-400">Add New Contact</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Enter the details of the new contact to add to your list.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right text-gray-300">
                                    Name
                                </Label>
                                <Input id="name" placeholder="John Doe" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right text-gray-300">
                                    Phone
                                </Label>
                                <Input id="phone" placeholder="+1234567890" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tags" className="text-right text-gray-300">
                                    Tags
                                </Label>
                                <Input id="tags" placeholder="VIP, New Customer" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingContact(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                            <Button className="bg-purple-600 hover:bg-purple-700">Add Contact</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Create Segment Dialog */}
                <Dialog open={isCreatingSegment} onOpenChange={setIsCreatingSegment}>
                    <DialogContent className="sm:max-w-[625px] bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-purple-400">Create New Segment</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Define the criteria for your new audience segment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="segment-name" className="text-right text-gray-300">
                                    Segment Name
                                </Label>
                                <Input id="segment-name" placeholder="e.g., High Value Customers" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="segment-description" className="text-right text-gray-300">
                                    Description
                                </Label>
                                <Input id="segment-description" placeholder="Briefly describe this segment" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">Criteria</Label>
                                <div className="col-span-3 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Select>
                                            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                                                <SelectValue placeholder="Select criteria" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                                <SelectItem value="tags">Tags</SelectItem>
                                                <SelectItem value="last_interaction">Last Interaction</SelectItem>
                                                <SelectItem value="total_spent">Total Spent</SelectItem>
                                                <SelectItem value="location">Location</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select>
                                            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                                                <SelectValue placeholder="Condition" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                                <SelectItem value="equals">Equals</SelectItem>
                                                <SelectItem value="contains">Contains</SelectItem>
                                                <SelectItem value="greater_than">Greater Than</SelectItem>
                                                <SelectItem value="less_than">Less Than</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Value" />
                                    </div>
                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Condition
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreatingSegment(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                            <Button className="bg-purple-600 hover:bg-purple-700">Create Segment</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}