/**
 * ============================================
 * CAMPAIGNS PAGE - Modern Light Theme
 * ============================================
 * 
 * Professional campaign management interface featuring:
 * - Clean light design aesthetic
 * - Campaign list with filters
 * - Beautiful status indicators
 * - Performance metrics
 * - Create campaign wizard
 * - Responsive tables
 * - Modern card layouts
 * 
 * @page
 * @version 2.0.0
 */

"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Plus, Search, Settings, Trash, Zap, BarChart2, Send, Eye, MessageSquare, Filter, Copy, Edit, MoreVertical, Sparkles, TrendingUp, Users, Target, Calendar } from "lucide-react"
import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns"
import { SectionLoader } from "@/components/shared/section-loader"

/**
 * Campaign data with modern structure
 */
const defaultCampaignData = [
  { id: 1, name: "Summer Blowout", status: "Active", sent: 10000, delivered: 9500, read: 8000, responded: 1500, conversionRate: 15, roi: 250, date: "2024-06-15" },
  { id: 2, name: "New Product Teaser", status: "Scheduled", sent: 0, delivered: 0, read: 0, responded: 0, conversionRate: 0, roi: 0, date: "2024-07-01" },
  { id: 3, name: "Customer Loyalty Program", status: "Completed", sent: 5000, delivered: 4900, read: 4000, responded: 750, conversionRate: 15.3, roi: 180, date: "2024-05-20" },
  { id: 4, name: "Flash Sale Alert", status: "Draft", sent: 0, delivered: 0, read: 0, responded: 0, conversionRate: 0, roi: 0, date: null },
  { id: 5, name: "Feedback Survey", status: "Paused", sent: 2000, delivered: 1950, read: 1500, responded: 300, conversionRate: 20, roi: 120, date: "2024-06-10" },
]

/**
 * Analytics data for charts
 */
const analyticsData = [
  { name: 'Summer', sent: 10000, delivered: 9500, read: 8000, responded: 1500 },
  { name: 'Product', sent: 7500, delivered: 7300, read: 6000, responded: 900 },
  { name: 'Loyalty', sent: 5000, delivered: 4900, read: 4000, responded: 750 },
  { name: 'Flash', sent: 15000, delivered: 14800, read: 13000, responded: 2600 },
]

/**
 * Status badge styling
 */
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700 border-green-200'
    case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'Draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'Paused': return 'bg-orange-100 text-orange-700 border-orange-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

/**
 * Main Campaign Component
 */
export default function CampaignsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [step, setStep] = useState<number>(1)
  const [campaignMessage, setCampaignMessage] = useState<string>("")
  const { data: campaignsFromApi, isLoading } = useCampaigns()

  const campaignRows = campaignsFromApi?.length
    ? campaignsFromApi.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status:
          campaign.status.charAt(0) +
          campaign.status.slice(1).toLowerCase(),
        sent: 0,
        delivered: 0,
        read: 0,
        responded: 0,
        conversionRate: 0,
        roi: 0,
        date: campaign.scheduledAt || null,
      }))
    : defaultCampaignData

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-fadeIn">
      {isLoading && <SectionLoader label="Loading campaigns..." />}
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Campaign Central
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Supercharge your WhatsApp marketing efforts
          </p>
        </div>
        <Button 
          onClick={() => { setIsCreating(true); setStep(1) }} 
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg shadow-primary/25 rounded-xl hover:scale-105 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" /> New Campaign
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl border">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-semibold">
            <MessageSquare className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-semibold">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search campaigns..." className="pl-9 rounded-xl border-border/50 focus:border-primary" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-[180px] rounded-xl border-border/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl border-border/50 hover:bg-primary/5">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-xl transition-all rounded-2xl border-primary/10 bg-gradient-to-br from-blue-50 via-white to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Total Sent</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">54,231</div>
                <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                <Progress value={75} className="mt-3 h-2 bg-blue-100" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all rounded-2xl border-primary/10 bg-gradient-to-br from-green-50 via-white to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Avg. Open Rate</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">32.5%</div>
                <p className="text-xs text-muted-foreground mt-1">+4.3% from last month</p>
                <Progress value={32.5} className="mt-3 h-2 bg-green-100" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all rounded-2xl border-primary/10 bg-gradient-to-br from-purple-50 via-white to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Avg. Response Rate</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">18.2%</div>
                <p className="text-xs text-muted-foreground mt-1">+2.7% from last month</p>
                <Progress value={18.2} className="mt-3 h-2 bg-purple-100" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all rounded-2xl border-primary/10 bg-gradient-to-br from-orange-50 via-white to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Avg. ROI</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">215%</div>
                <p className="text-xs text-muted-foreground mt-1">+15.3% from last month</p>
                <Progress value={75} className="mt-3 h-2 bg-orange-100" />
              </CardContent>
            </Card>
          </div>

          {/* Campaigns Table */}
          <Card className="rounded-2xl border-border/50 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-xl font-bold">Active Campaigns</CardTitle>
              <CardDescription className="text-muted-foreground">Real-time overview of your running campaigns</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/30">
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Sent</TableHead>
                      <TableHead className="font-bold">Delivered</TableHead>
                      <TableHead className="font-bold">Read</TableHead>
                      <TableHead className="font-bold">Responded</TableHead>
                      <TableHead className="font-bold">Conversion</TableHead>
                      <TableHead className="font-bold">ROI</TableHead>
                      <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignRows.map((campaign) => (
                      <TableRow key={campaign.id} className="border-border/30 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge className={cn("font-semibold border", getStatusColor(campaign.status))}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{campaign.sent.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{campaign.delivered.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{campaign.read.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{campaign.responded.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-semibold">
                            {campaign.conversionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-semibold text-green-700">
                            {campaign.roi}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10 rounded-lg">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Campaign Performance Chart */}
            <Card className="rounded-2xl border-border/50 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-xl font-bold">Campaign Performance</CardTitle>
                <CardDescription>Comparative analysis of your campaigns</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
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

            {/* Conversion Rates */}
            <Card className="rounded-2xl border-border/50 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-xl font-bold">Conversion Distribution</CardTitle>
                <CardDescription>Campaign effectiveness overview</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="responded"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#14b8a6', '#f59e0b', '#3b82f6'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[725px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Create New Campaign
            </DialogTitle>
            <DialogDescription>
              Set up your new WhatsApp marketing campaign in 3 easy steps
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-semibold">Step {step} of 3</div>
              <div className="space-x-2">
                <Button 
                  variant={step===1?"default":"outline"} 
                  size="sm" 
                  onClick={()=>setStep(1)}
                  className="rounded-lg"
                >
                  Details
                </Button>
                <Button 
                  variant={step===2?"default":"outline"} 
                  size="sm" 
                  onClick={()=>setStep(2)}
                  className="rounded-lg"
                >
                  Message
                </Button>
                <Button 
                  variant={step===3?"default":"outline"} 
                  size="sm" 
                  onClick={()=>setStep(3)}
                  className="rounded-lg"
                >
                  Schedule
                </Button>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="campaign-name" className="text-right font-semibold">Name</Label>
                  <Input id="campaign-name" placeholder="Enter campaign name" className="col-span-3 rounded-xl" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="campaign-type" className="text-right font-semibold">Type</Label>
                  <Select>
                    <SelectTrigger id="campaign-type" className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="informational">Informational</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target-audience" className="text-right font-semibold">Audience</Label>
                  <Select>
                    <SelectTrigger id="target-audience" className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                      <SelectItem value="new">New Subscribers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="campaign-message" className="text-right font-semibold mt-2">Message</Label>
                  <div className="col-span-3 space-y-3">
                    <Textarea
                      id="campaign-message"
                      placeholder="Enter your campaign message..."
                      className="min-h-[150px] rounded-xl"
                      value={campaignMessage}
                      onChange={(e: any) => setCampaignMessage(e.target.value)}
                    />
                    <Button variant="outline" className="w-full rounded-xl border-primary/30 hover:bg-primary/5">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Generate Message
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Schedule</Label>
                  <Select>
                    <SelectTrigger className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Send immediately" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">A/B Testing</Label>
                  <div className="col-span-3">
                    <Button variant="outline" className="rounded-xl">
                      <Target className="mr-2 h-4 w-4" />
                      Enable A/B Testing
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step-1)}
                className="rounded-xl"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step+1)}
                className="bg-gradient-to-r from-primary to-primary/80 font-semibold rounded-xl"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-primary/80 font-semibold rounded-xl"
                onClick={() => {
                  console.log('✨ Campaign created successfully')
                  setIsCreating(false)
                }}
              >
                Create Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
