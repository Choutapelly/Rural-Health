"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { DiagnosticTestRecommendations } from "@/components/diagnostic-test-recommendations"
import { generateMockMedicalRecords } from "@/utils/medical-records"

// Mock data
const mockPatients = [
  { id: "p1", name: "John Smith" },
  { id: "p2", name: "Maria Gonzalez" },
  { id: "p3", name: "Raj Patel" },
]

export default function TestRecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatientId, setSelectedPatientId] = useState("p1")
  const [patientData, setPatientData] = useState<any>(null)
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [previousTests, setPreviousTests] = useState<any[]>([])
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    setOrderSuccess(false)

    setTimeout(() => {
      // Generate mock medical records
      const records = generateMockMedicalRecords(
        mockPatients.map((p) => p.id),
        mockPatients.map((p) => p.name),
      )

      const patientRecord = records[selectedPatientId]
      setPatientData(patientRecord)

      // Format diagnoses for the component
      const formattedDiagnoses = patientRecord.conditions.map((condition: any) => ({
        id: condition.id,
        name: condition.name,
        status: condition.status,
        diagnosisDate: condition.diagnosisDate,
      }))

      // Add some suspected diagnoses based on symptoms
      if (selectedPatientId === "p1") {
        formattedDiagnoses.push({
          id: "d4",
          name: "Coronary Artery Disease",
          status: "suspected",
        })
      } else if (selectedPatientId === "p2") {
        formattedDiagnoses.push({
          id: "d5",
          name: "Migraine",
          status: "suspected",
        })
      } else if (selectedPatientId === "p3") {
        formattedDiagnoses.push({
          id: "d6",
          name: "Gastroesophageal Reflux Disease",
          status: "suspected",
        })
      }

      setDiagnoses(formattedDiagnoses)

      // Format previous tests
      const formattedTests = patientRecord.labResults.map((lab: any) => ({
        id: lab.id,
        name: lab.name,
        lastPerformed: lab.date,
        result: `${lab.value} ${lab.unit}`,
        normalRange: lab.referenceRange,
        abnormal: lab.abnormal,
      }))

      setPreviousTests(formattedTests)
      setIsLoading(false)
    }, 1000)
  }, [selectedPatientId])

  const handleOrderTests = (tests: string[], diagnosisId: string, notes: string, priority: string) => {
    console.log("Ordering tests:", tests)
    console.log("For diagnosis:", diagnosisId)
    console.log("Notes:", notes)
    console.log("Priority:", priority)

    // In a real application, this would call an API to order the tests
    setOrderSuccess(true)

    // Hide the success message after 5 seconds
    setTimeout(() => {
      setOrderSuccess(false)
    }, 5000)
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Diagnostic Test Recommendations</h1>
          <div className="flex items-center gap-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-select">Select Patient</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId} disabled={isLoading}>
                <SelectTrigger id="patient-select" className="w-[200px]">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {orderSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800 mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Tests ordered successfully</AlertTitle>
            <AlertDescription>
              The selected diagnostic tests have been ordered and will be processed according to the specified priority.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid gap-4 mt-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : (
          <div className="mt-4">
            <DiagnosticTestRecommendations
              diagnoses={diagnoses}
              previousTests={previousTests}
              onOrderTests={handleOrderTests}
            />
          </div>
        )}
      </DashboardShell>
    </>
  )
}
