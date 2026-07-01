import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PatientDetailView } from "@/components/patient-detail-view"
import { generateMockPatientData } from "@/utils/chart-data"

interface PatientPageProps {
  params: Promise<{
    patientId: string
  }>
}

export default async function PatientDetailPage({ params }: PatientPageProps) {
  // Get patient data from mock data
  const { patientId } = await params
  const allPatients = generateMockPatientData()
  const patient = allPatients.find((p) => p.patientId === patientId)
  const medicalRecords = null // In production, fetch from API

  if (!patient) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
          <p className="text-muted-foreground mb-6">The patient you're looking for doesn't exist or has been removed.</p>
          <Button variant="outline" asChild>
            <a href="/dashboard/doctor/symptom-dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/doctor/symptom-dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Patient Details</h1>
          <p className="text-muted-foreground">Manage and attend to {patient.patientName}</p>
        </div>
      </div>

      {/* Patient Detail View */}
      <PatientDetailView patient={patient} medicalRecords={medicalRecords} />
    </div>
  )
}
