"use client"

import { useParams } from "next/navigation"
import { EnhancedVideoConsultation } from "@/components/enhanced-video-consultation"

export default function VideoConsultationPage() {
  const params = useParams()
  const consultationId = params.id as string

  return <EnhancedVideoConsultation consultationId={consultationId} isDoctor={true} />
}
