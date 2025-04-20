"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { VideoWaitingRoom } from "@/components/video-waiting-room"
import { EnhancedVideoConsultation } from "@/components/enhanced-video-consultation"

export default function WaitingRoomPage() {
  const params = useParams()
  const router = useRouter()
  const consultationId = params.id as string
  const [joinedConsultation, setJoinedConsultation] = useState(false)

  const handleJoinConsultation = () => {
    setJoinedConsultation(true)
  }

  if (joinedConsultation) {
    return <EnhancedVideoConsultation consultationId={consultationId} isDoctor={false} />
  }

  return <VideoWaitingRoom consultationId={consultationId} onJoin={handleJoinConsultation} />
}
