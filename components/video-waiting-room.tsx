"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mic, MicOff, VideoIcon, VideoOff, AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface WaitingRoomProps {
  consultationId: string
  onJoin: () => void
}

export function VideoWaitingRoom({ consultationId, onJoin }: WaitingRoomProps) {
  const router = useRouter()
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [devicesTested, setDevicesTested] = useState(false)
  const [connectionTested, setConnectionTested] = useState(false)
  const [doctorStatus, setDoctorStatus] = useState<"unavailable" | "preparing" | "ready">("unavailable")
  const [countdown, setCountdown] = useState<number | null>(null)

  // Mock consultation data
  const consultationData = {
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "/confident-scientist.png",
    },
    scheduledTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    duration: 30, // minutes
  }

  // Simulate doctor status changes
  useEffect(() => {
    const statusTimer = setTimeout(() => {
      setDoctorStatus("preparing")

      const readyTimer = setTimeout(() => {
        setDoctorStatus("ready")
        setCountdown(10)
      }, 8000)

      return () => clearTimeout(readyTimer)
    }, 5000)

    return () => clearTimeout(statusTimer)
  }, [])

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      onJoin()
    }
  }, [countdown, onJoin])

  // Format time until appointment
  const formatTimeUntil = () => {
    const now = new Date()
    const diff = consultationData.scheduledTime.getTime() - now.getTime()

    if (diff <= 0) return "Now"

    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""}`

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`
  }

  // Test devices
  const handleTestDevices = () => {
    // In a real app, we would test microphone and camera access here
    setTimeout(() => {
      setDevicesTested(true)
    }, 2000)
  }

  // Test connection
  const handleTestConnection = () => {
    // In a real app, we would test network speed and stability here
    setTimeout(() => {
      setConnectionTested(true)
    }, 3000)
  }

  // Join consultation
  const handleJoinNow = () => {
    onJoin()
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Video Consultation Waiting Room</CardTitle>
          <CardDescription>
            Your appointment with {consultationData.doctor.name} is scheduled to begin in {formatTimeUntil()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Doctor status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
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
            <Badge
              variant="outline"
              className={`
                ${doctorStatus === "unavailable" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                ${doctorStatus === "preparing" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                ${doctorStatus === "ready" ? "bg-green-50 text-green-700 border-green-200" : ""}
              `}
            >
              {doctorStatus === "unavailable" && (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Doctor Unavailable
                </>
              )}
              {doctorStatus === "preparing" && (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Doctor Preparing
                </>
              )}
              {doctorStatus === "ready" && (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Doctor Ready
                </>
              )}
            </Badge>
          </div>

          {/* Video preview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Your Video Preview</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {!videoEnabled ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <VideoOff className="h-8 w-8 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src="/telehealth-preview.png"
                    alt="Your video preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={!audioEnabled ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-600" : ""}
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                  {audioEnabled ? "Microphone On" : "Microphone Off"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={!videoEnabled ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-600" : ""}
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? <VideoIcon className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
                  {videoEnabled ? "Camera On" : "Camera Off"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Pre-Consultation Checklist</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${devicesTested ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {devicesTested ? <CheckCircle2 className="h-4 w-4" /> : "1"}
                    </div>
                    <span>Test audio and video</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleTestDevices} disabled={devicesTested}>
                    {devicesTested ? "Tested" : "Test Now"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${connectionTested ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {connectionTested ? <CheckCircle2 className="h-4 w-4" /> : "2"}
                    </div>
                    <span>Test your connection</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={connectionTested}>
                    {connectionTested ? "Tested" : "Test Now"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                      3
                    </div>
                    <span>Prepare your questions</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Tips
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Connection settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Connection Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bandwidth-saver">Bandwidth Saver Mode</Label>
                  <p className="text-xs text-muted-foreground">Reduces video quality for better stability</p>
                </div>
                <Switch id="bandwidth-saver" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="audio-only">Audio-Only Fallback</Label>
                  <p className="text-xs text-muted-foreground">Switch to audio if connection is poor</p>
                </div>
                <Switch id="audio-only" defaultChecked />
              </div>
            </div>
          </div>

          {/* Important information */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-700">Important Information</p>
                <ul className="text-sm text-yellow-600 list-disc list-inside space-y-1 mt-1">
                  <li>Find a quiet, private space for your consultation</li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Have your medication list and symptom notes ready</li>
                  <li>The consultation will last approximately {consultationData.duration} minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            {doctorStatus === "ready" && countdown !== null && (
              <div className="text-sm">
                Joining automatically in <span className="font-medium">{countdown}</span> seconds
              </div>
            )}
            <Button onClick={handleJoinNow} disabled={doctorStatus === "unavailable"}>
              {doctorStatus === "ready" ? "Join Now" : "Join When Ready"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
