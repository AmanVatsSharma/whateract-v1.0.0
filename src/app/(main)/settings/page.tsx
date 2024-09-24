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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, HelpCircle, Globe, Bell, Lock, Users, Key, Webhook, Database, Zap, Sliders, BarChart, Send } from 'lucide-react'

export default function Settings() {
    const [showApiKey, setShowApiKey] = useState(false)
    const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false)

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-6">Settings</h1>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="bg-gray-800 flex flex-wrap">
                    <TabsTrigger value="general" className="data-[state=active]:bg-purple-600 flex items-center"><Globe className="mr-2 h-4 w-4" />General</TabsTrigger>
                    <TabsTrigger value="account" className="data-[state=active]:bg-purple-600 flex items-center"><Users className="mr-2 h-4 w-4" />Account</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600 flex items-center"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-purple-600 flex items-center"><Lock className="mr-2 h-4 w-4" />Security</TabsTrigger>
                    <TabsTrigger value="integrations" className="data-[state=active]:bg-purple-600 flex items-center"><Zap className="mr-2 h-4 w-4" />Integrations</TabsTrigger>
                    <TabsTrigger value="api" className="data-[state=active]:bg-purple-600 flex items-center"><Key className="mr-2 h-4 w-4" />API</TabsTrigger>
                    <TabsTrigger value="data" className="data-[state=active]:bg-purple-600 flex items-center"><Database className="mr-2 h-4 w-4" />Data Management</TabsTrigger>
                    <TabsTrigger value="customization" className="data-[state=active]:bg-purple-600 flex items-center"><Sliders className="mr-2 h-4 w-4" />Customization</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 max-w-3xl">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">General Settings</CardTitle>
                            <CardDescription className="text-gray-400">Manage your WhatsApp Marketing Pro Max general settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="utc">UTC</SelectItem>
                                        <SelectItem value="est">Eastern Time</SelectItem>
                                        <SelectItem value="pst">Pacific Time</SelectItem>
                                        <SelectItem value="gmt">GMT</SelectItem>
                                        <SelectItem value="cet">Central European Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                        <SelectItem value="zh">Chinese</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date-format">Date Format</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select date format" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                        <SelectItem value="gbp">GBP (£)</SelectItem>
                                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-reply" />
                                <Label htmlFor="auto-reply">Enable auto-reply for incoming messages</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="analytics" />
                                <Label htmlFor="analytics">Enable advanced analytics tracking</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Account Information</CardTitle>
                            <CardDescription className="text-gray-400">Manage your account details and subscription</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" value="user@example.com" className="bg-gray-700 text-white" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="Your full name" className="bg-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <Input id="company" placeholder="Your company name" className="bg-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" placeholder="Your phone number" className="bg-gray-700 text-white" />
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Current Plan</Label>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="bg-purple-600 text-white">Pro</Badge>
                                    <span className="text-gray-300">$49/month</span>
                                </div>
                            </div>
                            <Button variant="outline" className="mt-2">Upgrade Plan</Button>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>User Roles</Label>
                                <RadioGroup defaultValue="admin">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="admin" id="admin" />
                                        <Label htmlFor="admin">Admin</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="manager" id="manager" />
                                        <Label htmlFor="manager">Manager</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="user" id="user" />
                                        <Label htmlFor="user">User</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Update Account</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Notification Preferences</CardTitle>
                            <CardDescription className="text-gray-400">Manage how and when you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-gray-400">Receive updates via email</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-gray-400">Receive updates on your device</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>SMS Notifications</Label>
                                    <p className="text-sm text-gray-400">Receive important alerts via SMS</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Notification Frequency</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="realtime">Real-time</SelectItem>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="daily">Daily Digest</SelectItem>
                                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Notification Types</Label>
                                <div className="space-y-2">
                                    <Checkbox id="campaign-start" />
                                    <Label htmlFor="campaign-start" className="ml-2">Campaign Start</Label>
                                </div>
                                <div className="space-y-2">
                                    <Checkbox id="campaign-end" />
                                    <Label htmlFor="campaign-end" className="ml-2">Campaign End</Label>
                                </div>
                                <div className="space-y-2">
                                    <Checkbox id="new-subscriber" />
                                    <Label htmlFor="new-subscriber" className="ml-2">New Subscriber</Label>
                                </div>
                                <div className="space-y-2">
                                    <Checkbox id="unsubscribe" />
                                    <Label htmlFor="unsubscribe" className="ml-2">Unsubscribe</Label>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Security Settings</CardTitle>
                            <CardDescription className="text-gray-400">Manage your account security and privacy</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" className="bg-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" className="bg-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" className="bg-gray-700 text-white" />
                            </div>
                            <Separator className="my-4" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-gray-400">Enable 2FA for enhanced security</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Session Management</Label>
                                <Button variant="outline" className="w-full">View Active Sessions</Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Account Deletion</Label>
                                <Button variant="destructive" className="w-full">Delete Account</Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Update Security Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Integrations</CardTitle>
                            <CardDescription className="text-gray-400">Connect your WhatsApp Marketing Pro Max with other services</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>CRM Integration</Label>
                                    <p className="text-sm text-gray-400">Connect with your CRM system</p>
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                                        <SelectValue placeholder="Select CRM" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="salesforce">Salesforce</SelectItem>
                                        <SelectItem value="hubspot">HubSpot</SelectItem>
                                        <SelectItem value="zoho">Zoho</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>E-commerce Platform</Label>
                                    <p className="text-sm text-gray-400">Sync with your online store</p>
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                                        <SelectValue placeholder="Select Platform" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="shopify">Shopify</SelectItem>
                                        <SelectItem value="woocommerce">WooCommerce</SelectItem>
                                        <SelectItem value="magento">Magento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Analytics Tools</Label>
                                    <p className="text-sm text-gray-400">Integrate with analytics services</p>
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                                        <SelectValue placeholder="Select Tool" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="google-analytics">Google Analytics</SelectItem>
                                        <SelectItem value="mixpanel">Mixpanel</SelectItem>
                                        <SelectItem value="amplitude">Amplitude</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Payment Gateways</Label>
                                    <p className="text-sm text-gray-400">Connect payment processors</p>
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                                        <SelectValue placeholder="Select Gateway" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="stripe">Stripe</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                        <SelectItem value="square">Square</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Save Integrations</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">API Settings</CardTitle>
                            <CardDescription className="text-gray-400">Manage your API keys and webhooks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="api-key">API Key</Label>
                                <div className="flex">
                                    <Input
                                        id="api-key"
                                        value={showApiKey ? "your-api-key-here" : "••••••••••••••••"}
                                        className="bg-gray-700 text-white flex-grow"
                                        readOnly
                                    />
                                    <Button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="ml-2 bg-gray-700 hover:bg-gray-600"
                                    >
                                        {showApiKey ? "Hide" : "Show"}
                                    </Button>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">Generate New API Key</Button>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Webhook URL</Label>
                                <Input value="https://your-webhook-url.com" className="bg-gray-700 text-white" readOnly />
                            </div>
                            <Button onClick={() => setIsWebhookModalOpen(true)} variant="outline" className="w-full">Configure Webhook</Button>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>API Rate Limiting</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select rate limit" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="1000">1000 requests/hour</SelectItem>
                                        <SelectItem value="5000">5000 requests/hour</SelectItem>
                                        <SelectItem value="10000">10000 requests/hour</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Save API Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Data Management</CardTitle>
                            <CardDescription className="text-gray-400">Manage your data and privacy settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Data Retention</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select retention period" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="90">90 days</SelectItem>
                                        <SelectItem value="180">180 days</SelectItem>
                                        <SelectItem value="365">1 year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="data-anonymization" />
                                <Label htmlFor="data-anonymization">Enable data anonymization</Label>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Data Export</Label>
                                <Button variant="outline" className="w-full">Export All Data</Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Data Import</Label>
                                <Input id="file-upload" type="file" className="bg-gray-700 text-white" />
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Data Deletion</Label>
                                <Button variant="destructive" className="w-full">Delete All Data</Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Save Data Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="customization" className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-purple-400">Customization</CardTitle>
                            <CardDescription className="text-gray-400">Personalize your WhatsApp Marketing Pro Max experience</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <RadioGroup defaultValue="dark">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="light" id="light" />
                                        <Label htmlFor="light">Light</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="dark" id="dark" />
                                        <Label htmlFor="dark">Dark</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="system" id="system" />
                                        <Label htmlFor="system">System</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Accent Color</Label>
                                <div className="flex space-x-2">
                                    {['red', 'green', 'blue', 'yellow', 'purple'].map((color) => (
                                        <div
                                            key={color}
                                            className={`w-8 h-8 rounded-full cursor-pointer bg-${color}-500`}
                                            onClick={() => {/* Set accent color logic */ }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Dashboard Layout</Label>
                                <Select>
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Select layout" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 text-white">
                                        <SelectItem value="grid">Grid</SelectItem>
                                        <SelectItem value="list">List</SelectItem>
                                        <SelectItem value="compact">Compact</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Label>Custom CSS</Label>
                                <Textarea className="bg-gray-700 text-white" placeholder="Enter your custom CSS here" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-purple-600 hover:bg-purple-700">Save Customization</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Configure Webhook</DialogTitle>
                        <DialogDescription>Set up your webhook to receive real-time updates</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="webhook-url" className="text-right">
                                Webhook URL
                            </Label>
                            <Input id="webhook-url" placeholder="https://your-webhook-url.com" className="col-span-3 bg-gray-700 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="secret-key" className="text-right">
                                Secret Key
                            </Label>
                            <Input id="secret-key" placeholder="Your secret key" className="col-span-3 bg-gray-700 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label>Events to Send</Label>
                            <div className="space-y-2">
                                <Checkbox id="message-sent" />
                                <Label htmlFor="message-sent" className="ml-2">Message Sent</Label>
                            </div>
                            <div className="space-y-2">
                                <Checkbox id="message-delivered" />
                                <Label htmlFor="message-delivered" className="ml-2">Message Delivered</Label>
                            </div>
                            <div className="space-y-2">
                                <Checkbox id="message-read" />
                                <Label htmlFor="message-read" className="ml-2">Message Read</Label>
                            </div>
                            <div className="space-y-2">
                                <Checkbox id="new-subscriber" />
                                <Label htmlFor="new-subscriber" className="ml-2">New Subscriber</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Webhook Configuration</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}