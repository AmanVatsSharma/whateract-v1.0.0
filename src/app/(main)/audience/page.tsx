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
        <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            {/* <aside className="w-full lg:w-64 bg-gray-800 p-4 lg:p-6 border-r border-gray-700">
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
            </aside> */}

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Audience Management</h1>
                        <p className="text-muted-foreground">Manage and analyze your WhatsApp contacts and segments</p>
                    </div>
                    <Button onClick={() => setIsAddingContact(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <UserPlus className="mr-2 h-4 w-4" /> Add Contact
                    </Button>
                </div>

                <Tabs defaultValue="contacts" className="space-y-4">
                    <TabsList className="bg-secondary">
                        <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contacts</TabsTrigger>
                        <TabsTrigger value="segments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Segments</TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="contacts" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Input placeholder="Search contacts..." className="w-64 bg-card border-border text-foreground" />
                                <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex space-x-2">
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
                                        <SelectValue placeholder="Filter by tag" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="all">All Contacts</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                        <SelectItem value="frequent">Frequent Buyer</SelectItem>
                                        <SelectItem value="new">New Customer</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                    <Filter className="mr-2 h-4 w-4" />
                                    More Filters
                                </Button>
                            </div>
                        </div>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-primary">Contact List</CardTitle>
                                <CardDescription className="text-muted-foreground">Manage your WhatsApp contacts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border">
                                                <TableHead className="text-foreground">Name</TableHead>
                                                <TableHead className="text-foreground">Phone</TableHead>
                                                <TableHead className="text-foreground">Tags</TableHead>
                                                <TableHead className="text-foreground">Last Interaction</TableHead>
                                                <TableHead className="text-foreground">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contacts.map((contact) => (
                                                <TableRow key={contact.id} className="border-border">
                                                    <TableCell className="font-medium text-foreground">
                                                        <div className="flex items-center space-x-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={contact.name} />
                                                                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{contact.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">{contact.phone}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {contact.tags.map((tag, index) => (
                                                                <Badge key={index} variant="outline" className="bg-secondary text-foreground">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">{contact.lastInteraction}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem className="hover:bg-secondary">
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Contact
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-secondary">
                                                                    <Tags className="mr-2 h-4 w-4" />
                                                                    Manage Tags
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="hover:bg-secondary">
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    Add to Segment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-border" />
                                                                <DropdownMenuItem className="hover:bg-secondary text-destructive">
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
                            <Input placeholder="Search segments..." className="w-64 bg-card border-border text-foreground" />
                            <Button onClick={() => setIsCreatingSegment(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Plus className="mr-2 h-4 w-4" /> Create Segment
                            </Button>
                        </div>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-primary">Audience Segments</CardTitle>
                                <CardDescription className="text-muted-foreground">Manage your custom audience segments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <div className="space-y-4">
                                        {segments.map((segment) => (
                                            <div key={segment.id} className="p-4 border border-border rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">{segment.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{segment.criteria}</p>
                                                    </div>
                                                    <Badge>{segment.count} contacts</Badge>
                                                </div>
                                                <div className="mt-4 flex justify-end space-x-2">
                                                    <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-secondary">
                                                        Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-secondary">
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
                            <Card className="bg-card border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
                                    <Users className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">10,482</div>
                                    <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                                    <Progress value={75} className="mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Segments</CardTitle>
                                    <Target className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">24</div>
                                    <p className="text-xs text-muted-foreground">+4 new segments this month</p>
                                    <Progress value={60} className="mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
                                    <div className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">68.7%</div>
                                    <p className="text-xs text-muted-foreground">+5.4% from last month</p>
                                    <Progress value={68.7} className="mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
                                    <BellRing className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">3.2h</div>
                                    <p className="text-xs text-muted-foreground">-0.5h from last month</p>
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
                    <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                        <DialogHeader>
                            <DialogTitle className="text-primary">Add New Contact</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Enter the details of the new contact to add to your list.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right text-foreground">
                                    Name
                                </Label>
                                <Input id="name" placeholder="John Doe" className="col-span-3 bg-muted border-border text-foreground" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right text-foreground">
                                    Phone
                                </Label>
                                <Input id="phone" placeholder="+1234567890" className="col-span-3 bg-muted border-border text-foreground" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tags" className="text-right text-foreground">
                                    Tags
                                </Label>
                                <Input id="tags" placeholder="VIP, New Customer" className="col-span-3 bg-muted border-border text-foreground" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingContact(false)} className="border-border text-muted-foreground hover:bg-secondary">Cancel</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Contact</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Create Segment Dialog */}
                <Dialog open={isCreatingSegment} onOpenChange={setIsCreatingSegment}>
                    <DialogContent className="sm:max-w-[625px] bg-card text-foreground">
                        <DialogHeader>
                            <DialogTitle className="text-primary">Create New Segment</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Define the criteria for your new audience segment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="segment-name" className="text-right text-foreground">
                                    Segment Name
                                </Label>
                                <Input id="segment-name" placeholder="e.g., High Value Customers" className="col-span-3 bg-muted border-border text-foreground" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="segment-description" className="text-right text-foreground">
                                    Description
                                </Label>
                                <Input id="segment-description" placeholder="Briefly describe this segment" className="col-span-3 bg-muted border-border text-foreground" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-foreground">Criteria</Label>
                                <div className="col-span-3 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Select>
                                            <SelectTrigger className="w-[180px] bg-muted border-border text-foreground">
                                                <SelectValue placeholder="Select criteria" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border text-foreground">
                                                <SelectItem value="tags">Tags</SelectItem>
                                                <SelectItem value="last_interaction">Last Interaction</SelectItem>
                                                <SelectItem value="total_spent">Total Spent</SelectItem>
                                                <SelectItem value="location">Location</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select>
                                            <SelectTrigger className="w-[180px] bg-muted border-border text-foreground">
                                                <SelectValue placeholder="Condition" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border text-foreground">
                                                <SelectItem value="equals">Equals</SelectItem>
                                                <SelectItem value="contains">Contains</SelectItem>
                                                <SelectItem value="greater_than">Greater Than</SelectItem>
                                                <SelectItem value="less_than">Less Than</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input className="bg-muted border-border text-foreground" placeholder="Value" />
                                    </div>
                                    <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-secondary">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Condition
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreatingSegment(false)} className="border-border text-muted-foreground hover:bg-secondary">Cancel</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Segment</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}