"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, VideoIcon, VideoOff, Phone, MessageSquare, FileText } from "lucide-react"

export default function VideoConsultation() {
  const params = useParams()
  const consultationId = params.id

  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
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
    },
    reason: "Chest pain, shortness of breath, fatigue",
  })

  useEffect(() => {
    // Simulate loading the video call
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsConnected(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)
  }

  const endCall = () => {
    // In a real app, we would handle ending the call here
    window.history.back()
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 grid md:grid-cols-[1fr_300px] gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="relative bg-muted rounded-lg overflow-hidden h-[calc(100vh-8rem)]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                  <p className="text-muted-foreground">Connecting to secure video call...</p>
                </div>
              </div>
            ) : (
              <>
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Camera is turned off</p>
                  </div>
                )}
                <div className="absolute inset-0">
                  <img
                    src="/virtual-doctor-visit.png"
                    alt="Video stream"
                    className="w-full h-full object-cover"
                    style={{ display: videoEnabled ? "block" : "none" }}
                  />
                </div>
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-muted rounded-lg overflow-hidden border-2 border-background shadow-lg">
                  <img
                    src="/placeholder.svg?height=144&width=192&query=patient video call"
                    alt="Your video"
                    className="w-full h-full object-cover"
                    style={{ display: videoEnabled ? "block" : "none" }}
                  />
                  {!videoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Your camera is off</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={!audioEnabled ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-600" : ""}
              onClick={toggleAudio}
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={!videoEnabled ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-600" : ""}
              onClick={toggleVideo}
            >
              {videoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button variant="destructive" size="icon" onClick={endCall}>
              <Phone className="h-5 w-5 rotate-135" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={consultationData.doctor.avatar || "/placeholder.svg"}
                    alt={consultationData.doctor.name}
                  />
                  <AvatarFallback>
                    {consultationData.doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{consultationData.doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{consultationData.doctor.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={consultationData.patient.avatar || "/placeholder.svg"}
                    alt={consultationData.patient.name}
                  />
                  <AvatarFallback>
                    {consultationData.patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {consultationData.patient.name}, {consultationData.patient.age}
                  </p>
                  <p className="text-sm text-muted-foreground">{consultationData.patient.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="chat">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="info">
                <FileText className="h-4 w-4 mr-2" />
                Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-2">
              <div className="h-[calc(100vh-22rem)] overflow-y-auto border rounded-md p-2 mb-2">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={consultationData.doctor.avatar || "/placeholder.svg"}
                        alt={consultationData.doctor.name}
                      />
                      <AvatarFallback>
                        {consultationData.doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-md p-2 max-w-[80%]">
                      <p className="text-sm">Hello Maria, how are you feeling today?</p>
                      <p className="text-xs text-muted-foreground mt-1">10:02 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-md p-2 max-w-[80%]">
                      <p className="text-sm">I've been having chest pain and shortness of breath for the past week.</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">10:03 AM</p>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={consultationData.patient.avatar || "/placeholder.svg"}
                        alt={consultationData.patient.name}
                      />
                      <AvatarFallback>
                        {consultationData.patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea placeholder="Type a message..." className="min-h-[60px]" />
                <Button className="self-end">Send</Button>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-2">
              <Textarea placeholder="Take notes during the consultation..." className="min-h-[calc(100vh-22rem)]" />
            </TabsContent>
            <TabsContent value="info" className="mt-2">
              <div className="border rounded-md p-4 h-[calc(100vh-22rem)] overflow-y-auto">
                <h3 className="font-medium mb-2">Reason for Consultation</h3>
                <p className="text-sm text-muted-foreground mb-4">{consultationData.reason}</p>

                <h3 className="font-medium mb-2">Medical History</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hypertension (diagnosed 5 years ago)
                  <br />
                  Family history of heart disease
                </p>

                <h3 className="font-medium mb-2">Current Medications</h3>
                <p className="text-sm text-muted-foreground mb-4">Lisinopril 10mg daily</p>

                <h3 className="font-medium mb-2">Allergies</h3>
                <p className="text-sm text-muted-foreground">Penicillin</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
