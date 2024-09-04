import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Link, Undo, Redo, Smartphone, Smile } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

let ReactQuill = () => null
let Quill = null

if (typeof window !== 'undefined') {
    ReactQuill = require('react-quill')
    Quill = require('quill')
    require('react-quill/dist/quill.snow.css')
}

const MAX_MESSAGE_LENGTH = 1600 // WhatsApp's max message length
const WHATSAPP_BLUE_TICK = '✓✓'

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
]

export default function RichTextEditor() {
    const [editorContent, setEditorContent] = useState('')
    const [templateName, setTemplateName] = useState('')
    const [previewContent, setPreviewContent] = useState('')
    const [quillLoaded, setQuillLoaded] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const [messageCount, setMessageCount] = useState(1)
    const [variables, setVariables] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        setQuillLoaded(true)
    }, [])

    const handleEditorChange = (content) => {
        setEditorContent(content)
        const strippedContent = content.replace(/<[^>]+>/g, '')
        setPreviewContent(strippedContent)
        setCharCount(strippedContent.length)
        setMessageCount(Math.ceil(strippedContent.length / MAX_MESSAGE_LENGTH))
    }

    const handleSave = () => {
        console.log('Template Name:', templateName)
        console.log('Editor Content:', editorContent)
        console.log('Variables:', variables)
        console.log('Image:', selectedImage)
        // Here you would typically send this data to your backend or state management system
    }

    const handleAddVariable = () => {
        const variableName = prompt('Enter variable name:')
        if (variableName) {
            setVariables([...variables, variableName])
            const quill = ReactQuill.getEditor()
            const range = quill.getSelection(true)
            quill.insertText(range.index, `{{${variableName}}}`, 'user')
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target.result)
                const quill = ReactQuill.getEditor()
                const range = quill.getSelection(true)
                quill.insertEmbed(range.index, 'image', e.target.result, 'user')
            }
            reader.readAsDataURL(file)
        }
    }

    const insertEmoji = useCallback((emoji) => {
        const quill = ReactQuill.getEditor()
        const range = quill.getSelection(true)
        quill.insertText(range.index, emoji.native)
    }, [])

    const CustomToolbar = () => (
        <div className="flex flex-wrap gap-2 p-2 border-b border-gray-600">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600" onClick={() => document.getElementById('image-upload').click()}>
                <ImageIcon className="h-4 w-4" />
            </Button>
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                <Redo className="h-4 w-4" />
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-600">
                        <Smile className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Picker data={data} onEmojiSelect={insertEmoji} theme="dark" />
                </PopoverContent>
            </Popover>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-600" onClick={handleAddVariable}>
                Add Variable
            </Button>
        </div>
    )

    return (
        <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">Rich Text Editor</CardTitle>
                <CardDescription className="text-gray-400">Create and edit your message templates with rich formatting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="template-name" className="text-gray-300">Template Name</Label>
                    <Input
                        id="template-name"
                        placeholder="Enter template name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <Tabs defaultValue="editor" className="space-y-4">
                    <TabsList className="bg-gray-700">
                        <TabsTrigger value="editor" className="data-[state=active]:bg-gray-600">Editor</TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-gray-600">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="space-y-2">
                        <Label htmlFor="editor-content" className="text-gray-300">Template Content</Label>
                        <div className="bg-gray-700 border border-gray-600 rounded-md">
                            <CustomToolbar />
                            {quillLoaded && (
                                <ReactQuill
                                    theme="snow"
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                    modules={modules}
                                    formats={formats}
                                    className="bg-gray-700 text-white rounded-b-md"
                                />
                            )}
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Characters: {charCount}/{MAX_MESSAGE_LENGTH}</span>
                            <span>Messages: {messageCount}</span>
                        </div>
                    </TabsContent>
                    <TabsContent value="preview" className="space-y-2">
                        <Label className="text-gray-300">WhatsApp Preview</Label>
                        <div className="bg-[#0a1014] p-4 rounded-lg max-w-sm mx-auto">
                            <div className="flex items-center space-x-2 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Bot" />
                                    <AvatarFallback>Bot</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-semibold">WhatsApp Bot</p>
                                    <p className="text-xs text-gray-400">Online</p>
                                </div>
                            </div>
                            <div className="bg-[#005c4b] p-3 rounded-lg mb-2 max-w-[80%] ml-auto">
                                {selectedImage && (
                                    <img src={selectedImage} alt="Uploaded" className="mb-2 rounded-md" />
                                )}
                                <p className="text-white text-sm whitespace-pre-wrap">{previewContent || "Your message will appear here"}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-right text-xs text-gray-300">12:00 PM</p>
                                    <span className="text-xs text-gray-300">{WHATSAPP_BLUE_TICK}</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                {variables.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-gray-300">Template Variables</Label>
                        <div className="flex flex-wrap gap-2">
                            {variables.map((variable, index) => (
                                <Badge key={index} variant="secondary" className="bg-gray-700 text-white">
                                    {`{{${variable}}}`}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    Save Template
                </Button>
            </CardFooter>
        </Card>
    )
}