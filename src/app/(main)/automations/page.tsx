"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Settings, Play, Pause, Edit, Trash, ArrowRight, Clock, Users, MessageSquare, BarChart2, Zap, Send, Filter, ChevronDown } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

const automationRules = [
    { id: 1, name: "Welcome Series", trigger: "New Subscriber", actions: ["Send Welcome Message", "Add to Onboarding List"], status: "Active", performance: { sent: 1000, opened: 800, clicked: 500 } },
    { id: 2, name: "Re-engagement", trigger: "Inactive for 30 days", actions: ["Send Discount Offer", "Update Segment"], status: "Paused", performance: { sent: 500, opened: 300, clicked: 150 } },
    { id: 3, name: "Order Confirmation", trigger: "Purchase Completed", actions: ["Send Order Details", "Trigger Feedback Request (Delay: 3 days)"], status: "Active", performance: { sent: 2000, opened: 1900, clicked: 1500 } },
    { id: 4, name: "Abandoned Cart", trigger: "Cart Abandoned", actions: ["Send Reminder (Delay: 1 hour)", "Send Discount (Delay: 24 hours)"], status: "Active", performance: { sent: 1500, opened: 1200, clicked: 800 } },
]

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Trigger' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'Action 1' } },
    { id: '3', position: { x: 0, y: 200 }, data: { label: 'Action 2' } },
]

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
]

export default function Automation() {
    const [isCreating, setIsCreating] = useState(false)
    const [selectedAutomation, setSelectedAutomation] = useState(null)
    const [isABTestingModalOpen, setIsABTestingModalOpen] = useState(false)
    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false)
    const [nodes, setNodes] = useState(initialNodes)
    const [edges, setEdges] = useState(initialEdges)

    const onDragEnd = (result) => {
        // Implement drag and drop logic here
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-400">Automation</h1>
                <div className="flex space-x-2">
                    <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" /> Create Automation
                    </Button>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="active" className="space-y-4">
                <TabsList className="bg-gray-800">
                    <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">Active</TabsTrigger>
                    <TabsTrigger value="paused" className="data-[state=active]:bg-purple-600">Paused</TabsTrigger>
                    <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">All</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="automations">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {automationRules.filter(rule => rule.status === "Active").map((rule, index) => (
                                        <Draggable key={rule.id} draggableId={rule.id.toString()} index={index}>
                                            {(provided) => (
                                                <Card className="bg-gray-800 border-gray-700 mb-4" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <CardHeader className="flex flex-row items-center justify-between">
                                                        <div>
                                                            <CardTitle className="text-purple-400">{rule.name}</CardTitle>
                                                            <CardDescription className="text-gray-400">Trigger: {rule.trigger}</CardDescription>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-green-600 text-white">{rule.status}</Badge>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            <Label>Actions:</Label>
                                                            <ul className="list-disc list-inside text-gray-300">
                                                                {rule.actions.map((action, index) => (
                                                                    <li key={index}>{action}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="mt-4">
                                                            <Label>Performance:</Label>
                                                            <div className="flex justify-between text-sm text-gray-400 mt-2">
                                                                <span>Sent: {rule.performance.sent}</span>
                                                                <span>Opened: {rule.performance.opened}</span>
                                                                <span>Clicked: {rule.performance.clicked}</span>
                                                            </div>
                                                            <div className="mt-2">
                                                                <Slider
                                                                    defaultValue={[0, (rule.performance.opened / rule.performance.sent) * 100, (rule.performance.clicked / rule.performance.sent) * 100]}
                                                                    max={100}
                                                                    step={1}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex justify-between">
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedAutomation(rule)}>
                                                            <Edit className="h-4 w-4 mr-2" /> Edit
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => setIsABTestingModalOpen(true)}>
                                                            <BarChart2 className="h-4 w-4 mr-2" /> A/B Test
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => setIsPerformanceModalOpen(true)}>
                                                            <BarChart2 className="h-4 w-4 mr-2" /> Analytics
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Pause className="h-4 w-4 mr-2" /> Pause
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </TabsContent>

                <TabsContent value="paused" className="space-y-4">
                    {/* Similar structure as active, but for paused automations */}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    {/* Similar structure as active, but for all automations */}
                </TabsContent>
            </Tabs>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="bg-gray-800 text-white max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Create New Automation</DialogTitle>
                        <DialogDescription>Set up a new automated workflow for your WhatsApp marketing.</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="basic" className="mt-4">
                        <TabsList className="bg-gray-700">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600">Basic Setup</TabsTrigger>
                            <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-600">Advanced Configuration</TabsTrigger>
                            <TabsTrigger value="visual" className="data-[state=active]:bg-purple-600">Visual Workflow</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basic" className="mt-4">
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" placeholder="Automation name" className="col-span-3 bg-gray-700 text-white" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="trigger" className="text-right">Trigger</Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                                            <SelectValue placeholder="Select a trigger" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 text-white">
                                            <SelectItem value="new-subscriber">New Subscriber</SelectItem>
                                            <SelectItem value="purchase">Purchase Completed</SelectItem>
                                            <SelectItem value="abandoned-cart">Abandoned Cart</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="action" className="text-right">Action</Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                                            <SelectValue placeholder="Select an action" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 text-white">
                                            <SelectItem value="send-message">Send Message</SelectItem>
                                            <SelectItem value="update-tag">Update Tag</SelectItem>
                                            <SelectItem value="add-to-list">Add to List</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="message" className="text-right">Message</Label>
                                    <Textarea id="message" placeholder="Enter your message" className="col-span-3 bg-gray-700 text-white" />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="mt-4">
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="delay" className="text-right">Delay</Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Input id="delay" type="number" className="bg-gray-700 text-white w-20" />
                                        <Select>
                                            <SelectTrigger className="bg-gray-700 text-white w-32">
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-700 text-white">
                                                <SelectItem value="minutes">Minutes</SelectItem>
                                                <SelectItem value="hours">Hours</SelectItem>
                                                <SelectItem value="days">Days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="conditions" className="text-right">Conditions</Label>
                                    <div className="col-span-3 space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 text-white w-40">
                                                    <SelectValue placeholder="Select field" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 text-white">
                                                    <SelectItem value="tag">Tag</SelectItem>
                                                    <SelectItem value="custom-field">Custom Field</SelectItem>
                                                    <SelectItem value="engagement">Engagement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 text-white w-40">
                                                    <SelectValue placeholder="Condition" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 text-white">
                                                    <SelectItem value="equals">Equals</SelectItem>
                                                    <SelectItem value="not-equals">Not Equals</SelectItem>
                                                    <SelectItem value="contains">Contains</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input className="bg-gray-700 text-white" placeholder="Value" />
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Plus className="h-4 w-4 mr-2" /> Add Condition
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="segmentation" className="text-right">Segmentation</Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                                            <SelectValue placeholder="Select segment" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 text-white">
                                            <SelectItem value="all">All Subscribers</SelectItem>
                                            <SelectItem value="active">Active Subscribers</SelectItem>
                                            <SelectItem value="inactive">Inactive Subscribers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="visual" className="mt-4">
                            <div style={{ height: '400px' }}>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
                                    onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
                                    onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                                >
                                    <Background />
                                    <Controls />
                                </ReactFlow>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Create Automation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={selectedAutomation !== null} onOpenChange={() => setSelectedAutomation(null)}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Automation: {selectedAutomation?.name}</DialogTitle>
                        <DialogDescription>Modify the settings for this automation workflow.</DialogDescription>
                    </DialogHeader>
                    {/* Add form fields for editing automation, similar to the create form */}
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isABTestingModalOpen} onOpenChange={setIsABTestingModalOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>A/B Testing</DialogTitle>
                        <DialogDescription>Set up an A/B test for your automation</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="test-name" className="text-right">Test Name</Label>
                            <Input id="test-name" placeholder="A/B Test Name" className="col-span-3 bg-gray-700 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="variant-a" className="text-right">Variant A</Label>
                            <Textarea id="variant-a" placeholder="Enter message for Variant A" className="col-span-3 bg-gray-700 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="variant-b" className="text-right">Variant B</Label>
                            <Textarea id="variant-b" placeholder="Enter message for Variant B" className="col-span-3 bg-gray-700 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="test-size" className="text-right">Test Size</Label>
                            <div className="col-span-3 flex items-center space-x-2">
                                <Slider defaultValue={[10]} max={100} step={1} className="w-full" />
                                <span className="w-12 text-center">10%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="success-metric" className="text-right">Success Metric</Label>
                            <Select>
                                <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                                    <SelectValue placeholder="Select success metric" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white">
                                    <SelectItem value="open-rate">Open Rate</SelectItem>
                                    <SelectItem value="click-rate">Click Rate</SelectItem>
                                    <SelectItem value="conversion-rate">Conversion Rate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Start A/B Test</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPerformanceModalOpen} onOpenChange={setIsPerformanceModalOpen}>
                <DialogContent className="bg-gray-800 text-white max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Automation Performance</DialogTitle>
                        <DialogDescription>Detailed analytics for your automation workflow</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={automationRules}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="performance.sent" fill="#8884d8" name="Sent" />
                                <Bar dataKey="performance.opened" fill="#82ca9d" name="Opened" />
                                <Bar dataKey="performance.clicked" fill="#ffc658" name="Clicked" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <Card className="bg-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24.5%</div>
                                <p className="text-sm text-gray-400">+2.5% from last week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg">Avg. Response Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1.5 hours</div>
                                <p className="text-sm text-gray-400">-30 min from last week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg">Engagement Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">8.7/10</div>
                                <p className="text-sm text-gray-400">+0.3 from last week</p>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}