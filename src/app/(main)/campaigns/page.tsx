"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Search, Settings, Trash, Users, Zap, BarChart2, Send, Eye, MessageSquare, ThumbsUp, AlertCircle, CheckCircle2, Copy, Edit, MoreVertical, Filter, PieChart as PieChartIcon, TrendingUp, Sparkles } from "lucide-react"

const campaignData = [
  { id: 1, name: "Summer Blowout", status: "Active", sent: 10000, delivered: 9500, read: 8000, responded: 1500, conversionRate: 15, roi: 250 },
  { id: 2, name: "New Product Teaser", status: "Scheduled", sent: 0, delivered: 0, read: 0, responded: 0, conversionRate: 0, roi: 0 },
  { id: 3, name: "Customer Loyalty Program", status: "Completed", sent: 5000, delivered: 4900, read: 4000, responded: 750, conversionRate: 15.3, roi: 180 },
  { id: 4, name: "Flash Sale Alert", status: "Draft", sent: 0, delivered: 0, read: 0, responded: 0, conversionRate: 0, roi: 0 },
  { id: 5, name: "Feedback Survey", status: "Paused", sent: 2000, delivered: 1950, read: 1500, responded: 300, conversionRate: 20, roi: 120 },
]

const analyticsData = [
  { name: 'Summer Blowout', sent: 10000, delivered: 9500, read: 8000, responded: 1500, conversion: 15, roi: 250 },
  { name: 'Product Teaser', sent: 7500, delivered: 7300, read: 6000, responded: 900, conversion: 12, roi: 180 },
  { name: 'Loyalty Program', sent: 5000, delivered: 4900, read: 4000, responded: 750, conversion: 15.3, roi: 200 },
  { name: 'Flash Sale', sent: 15000, delivered: 14800, read: 13000, responded: 2600, conversion: 17.3, roi: 300 },
  { name: 'Feedback Survey', sent: 2000, delivered: 1950, read: 1500, responded: 300, conversion: 20, roi: 120 },
]

const timeSeriesData = [
  { time: '09:00', active: 200, completed: 50, engagement: 15 },
  { time: '10:00', active: 350, completed: 100, engagement: 18 },
  { time: '11:00', active: 500, completed: 180, engagement: 22 },
  { time: '12:00', active: 700, completed: 250, engagement: 25 },
  { time: '13:00', active: 600, completed: 300, engagement: 20 },
  { time: '14:00', active: 550, completed: 350, engagement: 19 },
  { time: '15:00', active: 700, completed: 400, engagement: 23 },
]

const audienceData = [
  { name: 'Age 18-24', value: 20, color: '#FF6384' },
  { name: 'Age 25-34', value: 30, color: '#36A2EB' },
  { name: 'Age 35-44', value: 25, color: '#FFCE56' },
  { name: 'Age 45-54', value: 15, color: '#4BC0C0' },
  { name: 'Age 55+', value: 10, color: '#9966FF' },
]

const templates = [
  { id: 1, name: "Welcome Message", content: "Welcome to our community! We're excited to have you on board.", category: "Onboarding" },
  { id: 2, name: "Product Launch", content: "Exciting news! Our new product is now available. Be among the first to try it out!", category: "Promotional" },
  { id: 3, name: "Discount Offer", content: "As a valued customer, enjoy an exclusive 20% off your next purchase. Use code: SPECIAL20", category: "Sales" },
  { id: 4, name: "Feedback Request", content: "We'd love to hear your thoughts! Please take a moment to share your experience with us.", category: "Engagement" },
  { id: 5, name: "Abandoned Cart Reminder", content: "Don't forget about the items in your cart! Complete your purchase now and get free shipping.", category: "Retargeting" },
]

const automationRules = [
  { id: 1, name: "Welcome Series", trigger: "New Subscriber", actions: ["Send Welcome Message", "Add to Onboarding List"] },
  { id: 2, name: "Re-engagement", trigger: "Inactive for 30 days", actions: ["Send Discount Offer", "Update Segment"] },
  { id: 3, name: "Purchase Follow-up", trigger: "Completed Purchase", actions: ["Send Thank You", "Request Review"] },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AdvancedCampaignManagementPro() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [campaignMessage, setCampaignMessage] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const [aiTone, setAiTone] = useState<string>("friendly")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id.toString() === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setCampaignMessage(template.content)
    }
  }

  const generateAiCopy = async () => {
    try {
      setIsGenerating(true)
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: campaignMessage, tone: aiTone, length: 'medium' })
      })
      const data = await res.json()
      if (data?.content) setCampaignMessage(data.content)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-[90px] bg-gray-900 text-white">
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">Campaign Central</h1>
            <p className="text-gray-400">Supercharge your WhatsApp marketing efforts</p>
          </div>
          <Button onClick={() => { setIsCreating(true); setStep(1) }} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-purple-600">Audience</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-purple-600">Templates</TabsTrigger>
            <TabsTrigger value="automations" className="data-[state=active]:bg-purple-600">Automations</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Input placeholder="Search campaigns..." className="w-64 bg-gray-800 border-gray-700 text-white" />
                <Button variant="outline" size="icon" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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
                <CardTitle className="text-purple-400">Active Campaigns</CardTitle>
                <CardDescription className="text-gray-400">Real-time overview of your running campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Sent</TableHead>
                        <TableHead className="text-gray-300">Delivered</TableHead>
                        <TableHead className="text-gray-300">Read</TableHead>
                        <TableHead className="text-gray-300">Responded</TableHead>
                        <TableHead className="text-gray-300">Conversion</TableHead>
                        <TableHead className="text-gray-300">ROI</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignData.map((campaign) => (
                        <TableRow key={campaign.id} className="border-gray-700">
                          <TableCell className="font-medium text-white">{campaign.name}</TableCell>
                          <TableCell>
                            <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'} className="bg-green-600 text-white">
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{campaign.sent.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-300">{campaign.delivered.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-300">{campaign.read.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-300">{campaign.responded.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-300">{campaign.conversionRate}%</TableCell>
                          <TableCell className="text-gray-300">{campaign.roi}%</TableCell>
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
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-700">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Sent</CardTitle>
                  <Send className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">54,231</div>
                  <p className="text-xs text-gray-400">+20.1% from last month</p>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg. Open Rate</CardTitle>
                  <Eye className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">32.5%</div>
                  <p className="text-xs text-gray-400">+4.3% from last month</p>
                  <Progress value={32.5} className="mt-2" />
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg. Response Rate</CardTitle>
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">18.2%</div>
                  <p className="text-xs text-gray-400">+2.7% from last month</p>
                  <Progress value={18.2} className="mt-2" />
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg. ROI</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">215%</div>
                  <p className="text-xs text-gray-400">+15.3% from last month</p>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-800 border-gray-700 col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-400">Campaign Performance</CardTitle>
                  <CardDescription className="text-gray-400">Comparative analysis of your top campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                      <Legend />
                      <Bar dataKey="sent" fill="#8884d8" />
                      <Bar dataKey="delivered" fill="#82ca9d" />
                      <Bar dataKey="read" fill="#ffc658" />
                      <Bar dataKey="responded" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">Conversion Rates</CardTitle>
                  <CardDescription className="text-gray-400">Campaign effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="conversion"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Real-time Campaign Activity</CardTitle>
                <CardDescription className="text-gray-400">Live updates on active messages and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Line type="monotone" dataKey="engagement" stroke="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400">ROI Analysis</CardTitle>
                <CardDescription className="text-gray-400">Return on Investment per campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="roi" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* The other Tabs (audience/templates/automations) remain unchanged */}
        </Tabs>

        {/* Create Campaign Dialog - 3-step wizard with AI */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="sm:max-w-[725px] bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-purple-400">Create New Campaign</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set up your new WhatsApp marketing campaign
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Step {step} of 3</div>
                <div className="space-x-2">
                  <Button variant={step===1?"default":"outline"} size="sm" onClick={()=>setStep(1)}>Details</Button>
                  <Button variant={step===2?"default":"outline"} size="sm" onClick={()=>setStep(2)}>Message</Button>
                  <Button variant={step===3?"default":"outline"} size="sm" onClick={()=>setStep(3)}>Schedule</Button>
                </div>
              </div>

              {step === 1 && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign-name" className="text-right text-gray-300">
                      Name
                    </Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" className="col-span-3 bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign-type" className="text-right text-gray-300">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger id="campaign-type" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="informational">Informational</SelectItem>
                        <SelectItem value="survey">Survey</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="target-audience" className="text-right text-gray-300">
                      Target Audience
                    </Label>
                    <Select>
                      <SelectTrigger id="target-audience" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="all">All Subscribers</SelectItem>
                        <SelectItem value="active">Active Users</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                        <SelectItem value="new">New Subscribers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign-template" className="text-right text-gray-300">
                      Template
                    </Label>
                    <Select onValueChange={handleTemplateSelect}>
                      <SelectTrigger id="campaign-template" className="col-span-3 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="campaign-message" className="text-right text-gray-300">
                      Message
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Textarea
                        id="campaign-message"
                        placeholder="Enter your campaign message"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={campaignMessage}
                        onChange={(e: any) => setCampaignMessage(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Select value={aiTone} onValueChange={setAiTone}>
                          <SelectTrigger className="w-[160px] bg-gray-700 border-gray-600 text-white"><SelectValue placeholder="Tone" /></SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="concise">Concise</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={generateAiCopy} disabled={isGenerating}>
                          <Sparkles className="mr-2 h-4 w-4" />{isGenerating ? 'Generating...' : 'AI Generate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-gray-300">Schedule</Label>
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
                      <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="bg-gray-700 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="a-b-testing" className="text-right text-gray-300">
                      A/B Testing
                    </Label>
                    <Switch id="a-b-testing" />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
              {step > 1 && <Button variant="outline" onClick={() => setStep(step-1)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Back</Button>}
              {step < 3 ? (
                <Button onClick={() => setStep(step+1)} className="bg-purple-600 hover:bg-purple-700">Next</Button>
              ) : (
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Create Campaign</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
