import { ConsultationQueue } from "@/components/consultation-queue"

export default function ConsultationsPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Video Consultations</h1>
      <ConsultationQueue />
    </div>
  )
}
