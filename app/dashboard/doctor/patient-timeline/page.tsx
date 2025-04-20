"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PatientTimeline } from "@/components/patient-timeline"
import { TreatmentSymptomCorrelation } from "@/components/treatment-symptom-correlation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generatePatientTimeline } from "@/utils/timeline-data"
import { generateMockPatientData } from "@/utils/chart-data"

export default function PatientTimelinePage() {
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId") || "p1"

  const [isLoading, setIsLoading] = useState(true)
  const [patientData, setPatientData] = useState<any>(null)
  const [medicalRecord, setMedicalRecord] = useState<any>(null)
  const [timelineEvents, setTimelineEvents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("timeline")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch patient symptom data
        const mockPatients = generateMockPatientData()
        const patient = mockPatients.find((p) => p.patientId === patientId)

        if (!patient) {
          throw new Error("Patient not found")
        }

        setPatientData(patient)

        // Fetch medical records
        const response = await fetch(`/api/medical-records?patientId=${patientId}`)
        const data = await response.json()
        setMedicalRecord(data)

        // Generate timeline events
        const events = generatePatientTimeline(patient, data)
        setTimelineEvents(events)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [patientId])

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/doctor/symptom-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Skeleton className="h-8 w-40" />
          </div>

          <Skeleton className="h-12 w-full mb-6" />

          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[600px] w-full" />
            </CardContent>
          </Card>
        </DashboardShell>
      </>
    )
  }

  if (!patientData) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/doctor/symptom-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Patient not found.</p>
            </CardContent>
          </Card>
        </DashboardShell>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/doctor/symptom-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{patientData.patientName}'s Health Timeline</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="correlation">Treatment Correlation</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <PatientTimeline events={timelineEvents} patientName={patientData.patientName} />
          </TabsContent>

          <TabsContent value="correlation">
            <TreatmentSymptomCorrelation events={timelineEvents} />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </>
  )
}
