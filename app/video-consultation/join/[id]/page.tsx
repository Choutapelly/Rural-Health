"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { EnhancedVideoConsultation } from "@/components/enhanced-video-consultation"

export default function JoinConsultationPage() {
  const params = useParams()
  const router = useRouter()
  const consultationId = params.id as string

  const [name, setName] = useState("")
  const [role, setRole] = useState("family")
  const [hasJoined, setHasJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleJoin = () => {
    if (!name.trim()) return

    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setHasJoined(true)
      setIsLoading(false)
    }, 2000)
  }

  if (hasJoined) {
    return <EnhancedVideoConsultation consultationId={consultationId} isDoctor={false} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Video Consultation</CardTitle>
          <CardDescription>
            You've been invited to join a secure medical consultation. Please enter your details to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Your Role</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id="family" />
                <Label htmlFor="family">Family Member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specialist" id="specialist" />
                <Label htmlFor="specialist">Healthcare Specialist</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="interpreter" id="interpreter" />
                <Label htmlFor="interpreter">Interpreter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="observer" id="observer" />
                <Label htmlFor="observer">Observer</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            <p className="font-medium mb-1">Important Information</p>
            <ul className="list-disc list-inside space-y-1">
              <li>This is a secure medical consultation</li>
              <li>Your connection will be encrypted end-to-end</li>
              <li>Please join from a quiet, private location</li>
              <li>You'll need to allow camera and microphone access</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={!name.trim() || isLoading}>
            {isLoading ? "Connecting..." : "Join Consultation"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
