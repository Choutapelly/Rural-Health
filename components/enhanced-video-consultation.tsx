"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Phone,
  MessageSquare,
  FileText,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  ScreenShare,
  ScreenShareOff,
  Download,
  Camera,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VideoParticipantGrid } from "./video-participant-grid"
import { ParticipantManagement, type Participant } from "./participant-management"

interface VideoConsultationProps {
  consultationId: string
  isDoctor?: boolean
}

export function EnhancedVideoConsultation({ consultationId, isDoctor = false }: VideoConsultationProps) {
  // Connection states
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "reconnecting" | "disconnected"
  >("connecting")
  const [networkQuality, setNetworkQuality] = useState<"high" | "medium" | "low" | "poor">("medium")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Media states
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioLevel, setAudioLevel] = useState(80)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [captureSnapshot, setCaptureSnapshot] = useState(false)

  // UI states
  const [activeTab, setActiveTab] = useState("chat")
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: string; content: string; timestamp: Date }>
  >([])
  const [messageText, setMessageText] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [showBandwidthWarning, setShowBandwidthWarning] = useState(false)
  const [showClinicalTools, setShowClinicalTools] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  // Participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "doctor-1",
      name: "Dr. Sarah Johnson",
      role: "host",
      avatar: "/confident-scientist.png",
      isActive: true,
      isSpeaking: false,
      hasAudio: true,
      hasVideo: true,
    },
    {
      id: "patient-1",
      name: "Maria Gonzalez",
      role: "patient",
      avatar: "/thoughtful-artist.png",
      isActive: true,
      isSpeaking: false,
      hasAudio: true,
      hasVideo: true,
    },
  ])

  // Refs
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  // Mock consultation data
  const [consultationData, setConsultationData] = useState({
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "/confident-scientist.png",
    },
    patient: {
      name: "Maria Gonzalez",
      age: 42,
      location: "Rural Mexico",
      avatar: "/thoughtful-artist.png",
      vitalSigns: {
        heartRate: "78 bpm",
        bloodPressure: "132/85 mmHg",
        temperature: "98.6°F",
        oxygenSaturation: "97%",
      },
    },
    scheduledTime: new Date(),
    duration: 30, // minutes
    reason: "Chest pain, shortness of breath, fatigue",
  })

  // Simulate connection process
  useEffect(() => {
    // Simulate connection sequence
    const connectingTimer = setTimeout(() => {
      setConnectionStatus("connected")

      // Add initial system message
      setChatMessages([
        {
          id: "system-1",
          sender: "system",
          content: "Video consultation has started. This session is encrypted end-to-end.",
          timestamp: new Date(),
        },
      ])

      // Simulate occasional network quality changes
      const networkInterval = setInterval(() => {
        const qualities = ["high", "medium", "low", "poor"] as const
        const randomQuality = qualities[Math.floor(Math.random() * 4)]
        setNetworkQuality(randomQuality)

        if (randomQuality === "poor") {
          setShowBandwidthWarning(true)
          setTimeout(() => setShowBandwidthWarning(false), 5000)
        }
      }, 30000) // Check every 30 seconds

      // Simulate occasional speaking changes
      const speakingInterval = setInterval(() => {
        setParticipants((prev) =>
          prev.map((p) => ({
            ...p,
            isSpeaking: Math.random() > 0.7,
          })),
        )
      }, 3000)

      return () => {
        clearInterval(networkInterval)
        clearInterval(speakingInterval)
      }
    }, 3000)

    return () => clearTimeout(connectingTimer)
  }, [])

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: isDoctor ? "doctor" : "patient",
      content: messageText,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, newMessage])
    setMessageText("")

    // Simulate response after a delay
    if (!isDoctor) {
      setTimeout(() => {
        const responseMessage = {
          id: `msg-${Date.now()}`,
          sender: "doctor",
          content: "Thank you for sharing that information. Let me make a note of your symptoms.",
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, responseMessage])
      }, 8000)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Toggle screen sharing
  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing)
    // In a real implementation, this would use the browser's screen sharing API
  }

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, this would start/stop recording
  }

  // End call
  const endCall = () => {
    setConnectionStatus("disconnected")
    // In a real app, we would handle ending the call here
    setTimeout(() => {
      window.history.back()
    }, 2000)
  }

  // Format time for chat messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Participant management
  const handleAddParticipant = (email: string, role: Participant["role"]) => {
    const newParticipant: Participant = {
      id: `participant-${Date.now()}`,
      name: email.split("@")[0], // Use part of email as name for demo
      role,
      isActive: false, // They'll join soon
      isSpeaking: false,
      hasAudio: true,
      hasVideo: true,
    }

    setParticipants((prev) => [...prev, newParticipant])

    // Add system message
    setChatMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        sender: "system",
        content: `${newParticipant.name} has been invited to join the consultation.`,
        timestamp: new Date(),
      },
    ])

    // Simulate participant joining after a delay
    setTimeout(() => {
      setParticipants((prev) => prev.map((p) => (p.id === newParticipant.id ? { ...p, isActive: true } : p)))

      setChatMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "system",
          content: `${newParticipant.name} has joined the consultation.`,
          timestamp: new Date(),
        },
      ])
    }, 5000)
  }

  const handleRemoveParticipant = (id: string) => {
    const participant = participants.find((p) => p.id === id)
    if (!participant) return

    setParticipants((prev) => prev.filter((p) => p.id !== id))

    // Add system message
    setChatMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        sender: "system",
        content: `${participant.name} has left the consultation.`,
        timestamp: new Date(),
      },
    ])
  }

  const handleToggleParticipantAudio = (id: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p)))
  }

  const handleToggleParticipantPin = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : { ...p, isPinned: false })),
    )
  }

  // Render connection status indicator
  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case "connecting":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Connecting...
          </Badge>
        )
      case "connected":
        return (
          <Badge
            variant="outline"
            className={`
            ${networkQuality === "high" ? "bg-green-50 text-green-700 border-green-200" : ""}
            ${networkQuality === "medium" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
            ${networkQuality === "low" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
            ${networkQuality === "poor" ? "bg-red-50 text-red-700 border-red-200" : ""}
          `}
          >
            {networkQuality === "high" && <Wifi className="h-3 w-3 mr-1" />}
            {networkQuality === "medium" && <Wifi className="h-3 w-3 mr-1" />}
            {networkQuality === "low" && <WifiOff className="h-3 w-3 mr-1" />}
            {networkQuality === "poor" && <WifiOff className="h-3 w-3 mr-1" />}
            {networkQuality.charAt(0).toUpperCase() + networkQuality.slice(1)} Connection
          </Badge>
        )
      case "reconnecting":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Reconnecting...
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Disconnected
          </Badge>
        )
    }
  }

  // If disconnected, show end screen
  if (connectionStatus === "disconnected") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Phone className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Call Ended</h2>
            <p className="text-muted-foreground mb-6">Your video consultation has ended.</p>
            <div className="space-y-4 w-full">
              <Button className="w-full" onClick={() => window.history.back()}>
                Return to Dashboard
              </Button>
              <Button variant="outline" className="w-full">
                View Consultation Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-[calc(100vh-6rem)]"}`}>
      {/* Connection warning */}
      {showBandwidthWarning && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md flex items-center shadow-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Low bandwidth detected. Video quality reduced.</span>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 grid md:grid-cols-[1fr_350px] gap-4 p-4">
        {/* Video area */}
        <div className="flex flex-col gap-4">
          <div className="relative bg-muted rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
            {connectionStatus === "connecting" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Establishing secure connection...</p>
                  <p className="text-xs text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            ) : (
              <>
                {/* Multi-participant video grid */}
                <VideoParticipantGrid
                  participants={participants}
                  onTogglePin={handleToggleParticipantPin}
                  className="h-full w-full"
                />

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-2 py-1 rounded-md flex items-center text-sm">
                    <span className="h-2 w-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
                    Recording
                  </div>
                )}

                {/* Screen sharing indicator */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center text-sm">
                    <ScreenShare className="h-3 w-3 mr-1" />
                    Screen Sharing
                  </div>
                )}

                {/* Connection quality indicator */}
                <div className="absolute top-4 right-4">{renderConnectionStatus()}</div>

                {/* Clinical tools overlay - only for doctors */}
                {isDoctor && showClinicalTools && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/90 p-3 rounded-lg border shadow-md">
                    <h4 className="font-medium text-sm mb-2">Patient Vitals</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Heart Rate:</span>
                        <span>{consultationData.patient.vitalSigns.heartRate}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">BP:</span>
                        <span>{consultationData.patient.vitalSigns.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Temp:</span>
                        <span>{consultationData.patient.vitalSigns.temperature}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">O2 Sat:</span>
                        <span>{consultationData.patient.vitalSigns.oxygenSaturation}</span>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Update
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        History
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Video controls */}
          <div className="flex flex-wrap justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={!audioEnabled ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-600" : ""}
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{audioEnabled ? "Mute microphone" : "Unmute microphone"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={!videoEnabled ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-600" : ""}
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{videoEnabled ? "Turn off camera" : "Turn on camera"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={isScreenSharing ? "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600" : ""}
                    onClick={toggleScreenSharing}
                  >
                    {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isScreenSharing ? "Stop sharing screen" : "Share your screen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={
                      showParticipants ? "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600" : ""
                    }
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage participants</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isDoctor && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={isRecording ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600" : ""}
                      onClick={toggleRecording}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${isRecording ? "bg-red-500" : "bg-muted-foreground"} mr-1`}
                      ></span>
                      <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRecording ? "Stop recording" : "Start recording"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setCaptureSnapshot(true)}>
                    <Camera className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take snapshot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isDoctor && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={
                        showClinicalTools ? "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600" : ""
                      }
                      onClick={() => setShowClinicalTools(!showClinicalTools)}
                    >
                      <FileText className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showClinicalTools ? "Hide clinical tools" : "Show clinical tools"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="destructive" size="icon" onClick={endCall}>
              <Phone className="h-5 w-5 rotate-135" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Participant info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={isDoctor ? consultationData.patient.avatar : consultationData.doctor.avatar}
                      alt={isDoctor ? consultationData.patient.name : consultationData.doctor.name}
                    />
                    <AvatarFallback>
                      {(isDoctor ? consultationData.patient.name : consultationData.doctor.name)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {isDoctor
                        ? `${consultationData.patient.name}, ${consultationData.patient.age}`
                        : consultationData.doctor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isDoctor ? consultationData.patient.location : consultationData.doctor.specialty}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {participants.length}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>30:00</span>
                </div>
                {renderConnectionStatus()}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for chat, notes, participants, etc. */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="participants">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </TabsTrigger>
            </TabsList>

            {/* Chat tab */}
            <TabsContent value="chat" className="mt-2">
              <div className="h-[calc(100vh-22rem)] overflow-y-auto border rounded-md p-2 mb-2">
                <div className="flex flex-col gap-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.sender === "system" ? "justify-center" : message.sender === (isDoctor ? "doctor" : "patient") ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "system" ? (
                        <div className="bg-muted/50 rounded-md p-2 text-xs text-center text-muted-foreground max-w-[90%]">
                          {message.content}
                        </div>
                      ) : message.sender !== (isDoctor ? "doctor" : "patient") ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                message.sender === "doctor"
                                  ? consultationData.doctor.avatar
                                  : consultationData.patient.avatar
                              }
                              alt={
                                message.sender === "doctor"
                                  ? consultationData.doctor.name
                                  : consultationData.patient.name
                              }
                            />
                            <AvatarFallback>
                              {(message.sender === "doctor"
                                ? consultationData.doctor.name
                                : consultationData.patient.name
                              )
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-md p-2 max-w-[80%]">
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatMessageTime(message.timestamp)}</p>
                          </div>
                        </>
                      ) : (
                        <div className="bg-primary text-primary-foreground rounded-md p-2 max-w-[80%]">
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-primary-foreground/70 mt-1">
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  className="min-h-[60px]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button className="self-end" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </TabsContent>

            {/* Notes tab */}
            <TabsContent value="notes" className="mt-2">
              <Textarea
                placeholder={
                  isDoctor
                    ? "Take clinical notes during the consultation..."
                    : "Take personal notes during the consultation..."
                }
                className="min-h-[calc(100vh-22rem)]"
              />
              {isDoctor && (
                <div className="flex justify-between mt-2">
                  <Button variant="outline" size="sm">
                    Save to EHR
                  </Button>
                  <Button size="sm">Save Notes</Button>
                </div>
              )}
            </TabsContent>

            {/* Participants tab */}
            <TabsContent value="participants" className="mt-2">
              <ParticipantManagement
                participants={participants}
                onAddParticipant={handleAddParticipant}
                onRemoveParticipant={handleRemoveParticipant}
                onToggleAudio={handleToggleParticipantAudio}
                onTogglePin={handleToggleParticipantPin}
                consultationId={consultationId}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Video Call Settings</DialogTitle>
            <DialogDescription>Adjust your audio, video, and connection settings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Audio Settings</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-enabled">Microphone</Label>
                <Switch id="audio-enabled" checked={audioEnabled} onCheckedChange={setAudioEnabled} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="volume">Speaker Volume</Label>
                  <span className="text-sm text-muted-foreground">{audioLevel}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="volume"
                    value={[audioLevel]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAudioLevel(value[0])}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Video Settings</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="video-enabled">Camera</Label>
                <Switch id="video-enabled" checked={videoEnabled} onCheckedChange={setVideoEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hd-enabled">HD Video</Label>
                <Switch id="hd-enabled" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Connection Settings</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="bandwidth-saver">Bandwidth Saver Mode</Label>
                <Switch id="bandwidth-saver" />
              </div>
              <p className="text-xs text-muted-foreground">
                Reduces video quality to improve stability on slow connections.
              </p>

              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="audio-only">Audio-Only Fallback</Label>
                <Switch id="audio-only" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">
                Automatically switch to audio-only when connection is poor.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snapshot dialog */}
      <Dialog open={captureSnapshot} onOpenChange={setCaptureSnapshot}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultation Snapshot</DialogTitle>
            <DialogDescription>Save this image to the patient record or download it.</DialogDescription>
          </DialogHeader>
          <div className="border rounded-md overflow-hidden">
            <img src="/virtual-doctor-visit.png" alt="Consultation snapshot" className="w-full h-auto" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaptureSnapshot(false)}>
              Cancel
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Participants dialog */}
      <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Participants</DialogTitle>
            <DialogDescription>Add or remove participants from this consultation.</DialogDescription>
          </DialogHeader>
          <ParticipantManagement
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            onToggleAudio={handleToggleParticipantAudio}
            onTogglePin={handleToggleParticipantPin}
            consultationId={consultationId}
          />
          <DialogFooter>
            <Button onClick={() => setShowParticipants(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
