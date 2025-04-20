"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PaperclipIcon, SendIcon, ImageIcon, FileIcon, MicIcon, SmileIcon } from "lucide-react"

interface Message {
  id: string
  sender: "doctor" | "patient"
  content: string
  timestamp: Date
  read: boolean
  attachments?: Array<{
    id: string
    name: string
    type: "image" | "document" | "lab" | "prescription"
    url: string
  }>
}

interface Conversation {
  id: string
  participantName: string
  participantRole: "doctor" | "patient"
  participantAvatar?: string
  lastMessage?: Message
  unreadCount: number
}

export function SecureMessaging() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participantName: "Dr. Sarah Johnson",
      participantRole: "doctor",
      participantAvatar: "/confident-scientist.png",
      unreadCount: 2,
    },
    {
      id: "2",
      participantName: "Dr. Michael Chen",
      participantRole: "doctor",
      unreadCount: 0,
    },
    {
      id: "3",
      participantName: "Nurse Rodriguez",
      participantRole: "doctor",
      unreadCount: 1,
    },
  ])

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1-1",
        sender: "doctor",
        content:
          "Hello Maria, I've reviewed your latest blood pressure readings. They're looking better, but I'd like to discuss adjusting your medication.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        read: true,
      },
      {
        id: "1-2",
        sender: "patient",
        content:
          "Thank you, doctor. I've been taking my medication regularly and watching my salt intake as you suggested.",
        timestamp: new Date(Date.now() - 82800000), // 23 hours ago
        read: true,
      },
      {
        id: "1-3",
        sender: "doctor",
        content:
          "That's excellent! I'm attaching a new prescription with a slightly lower dose. Please let me know if you experience any dizziness with this new dosage.",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        attachments: [
          {
            id: "a1",
            name: "Lisinopril_Prescription.pdf",
            type: "prescription",
            url: "#",
          },
        ],
      },
      {
        id: "1-4",
        sender: "doctor",
        content: "Also, here are some dietary recommendations that might help further reduce your blood pressure.",
        timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
        read: false,
        attachments: [
          {
            id: "a2",
            name: "BP_Diet_Recommendations.pdf",
            type: "document",
            url: "#",
          },
        ],
      },
    ],
    "2": [
      {
        id: "2-1",
        sender: "doctor",
        content: "Your lab results from last week look normal. Continue with your current treatment plan.",
        timestamp: new Date(Date.now() - 604800000), // 1 week ago
        read: true,
        attachments: [
          {
            id: "a3",
            name: "Lab_Results_May2023.pdf",
            type: "lab",
            url: "#",
          },
        ],
      },
    ],
    "3": [
      {
        id: "3-1",
        sender: "doctor",
        content: "Maria, please remember to log your blood sugar readings twice daily as we discussed.",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        read: true,
      },
      {
        id: "3-2",
        sender: "doctor",
        content: "I noticed you haven't logged any readings for the past 3 days. Is everything okay?",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        read: false,
      },
    ],
  })

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return

    const newMessage: Message = {
      id: `${activeConversation}-${messages[activeConversation].length + 1}`,
      sender: "patient",
      content: messageText,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...prev[activeConversation], newMessage],
    }))

    setMessageText("")
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] border rounded-lg overflow-hidden">
      <div className="grid h-full md:grid-cols-[300px_1fr]">
        {/* Conversation List */}
        <div className="border-r">
          <div className="p-4 border-b">
            <Input placeholder="Search conversations..." className="w-full" />
          </div>
          <Tabs defaultValue="all">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="flagged" className="flex-1">
                  Flagged
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="m-0">
              <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                      activeConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participantName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.participantName}</p>
                          {messages[conversation.id]?.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(messages[conversation.id][messages[conversation.id].length - 1].timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {messages[conversation.id]?.length > 0
                            ? messages[conversation.id][messages[conversation.id].length - 1].content
                            : "No messages yet"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {conversation.participantRole === "doctor" ? "Healthcare Provider" : "Patient"}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {conversation.unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <div className="p-4 text-center text-muted-foreground">
                {conversations.filter((c) => c.unreadCount > 0).length === 0
                  ? "No unread messages"
                  : "Showing unread messages"}
              </div>
            </TabsContent>
            <TabsContent value="flagged" className="m-0">
              <div className="p-4 text-center text-muted-foreground">No flagged messages</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Area */}
        {activeConversation ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      conversations.find((c) => c.id === activeConversation)?.participantAvatar || "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>
                    {conversations
                      .find((c) => c.id === activeConversation)
                      ?.participantName.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {conversations.find((c) => c.id === activeConversation)?.participantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversations.find((c) => c.id === activeConversation)?.participantRole === "doctor"
                      ? "Healthcare Provider"
                      : "Patient"}
                  </p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages[activeConversation]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.sender === "patient" ? "bg-primary text-primary-foreground" : "bg-muted"
                    } rounded-lg p-3`}
                  >
                    <p>{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-2 p-2 bg-background rounded border">
                            {attachment.type === "image" ? (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            ) : attachment.type === "prescription" ? (
                              <FileIcon className="h-4 w-4 text-rose-500" />
                            ) : (
                              <FileIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm truncate flex-1">{attachment.name}</span>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "patient" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                      {message.sender === "patient" && message.read && " • Read"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[80px]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="ghost">
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MicIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <SmileIcon className="h-3 w-3" />
                  <span>End-to-end encrypted • HIPAA compliant</span>
                </div>
                <div className="text-xs text-muted-foreground">Messages are saved to patient record</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}
