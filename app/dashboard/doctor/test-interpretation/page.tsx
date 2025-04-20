"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, FileText } from "lucide-react"
import { TestResultInterpretation } from "@/components/test-result-interpretation"
import { generateMockMedicalRecords } from "@/utils/medical-records"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Mock data
const mockPatients = [
  { id: "p1", name: "John Smith" },
  { id: "p2", name: "Maria Gonzalez" },
  { id: "p3", name: "Raj Patel" },
]

export default function TestInterpretationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatientId, setSelectedPatientId] = useState("p1")
  const [patientData, setPatientData] = useState<any>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [notesSaved, setNotesSaved] = useState(false)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    setNotesSaved(false)

    setTimeout(() => {
      // Generate mock medical records
      const records = generateMockMedicalRecords(
        mockPatients.map((p) => p.id),
        mockPatients.map((p) => p.name),
      )

      const patientRecord = records[selectedPatientId]
      setPatientData(patientRecord)

      // Format lab results for the component
      const formattedResults = patientRecord.labResults.map((lab: any) => {
        // Determine if the result is critical (significantly abnormal)
        const isCritical =
          lab.abnormal &&
          ((lab.name === "Glucose" && Number(lab.value) > 300) ||
            (lab.name === "Potassium" && (Number(lab.value) < 2.5 || Number(lab.value) > 6.5)) ||
            (lab.name === "Sodium" && (Number(lab.value) < 125 || Number(lab.value) > 155)) ||
            (lab.name === "Hemoglobin" && Number(lab.value) < 7) ||
            (lab.name === "White Blood Cell Count" && Number(lab.value) > 20000) ||
            (lab.name === "Platelet Count" && Number(lab.value) < 50000) ||
            (lab.name === "Troponin" && Number(lab.value) > 0.5))

        // Determine trend based on previous results (mock data)
        const trend = Math.random() > 0.7 ? (Math.random() > 0.5 ? "increasing" : "decreasing") : "stable"

        // Generate previous results (mock data)
        const previousResults = []
        if (Math.random() > 0.3) {
          const count = Math.floor(Math.random() * 3) + 1
          for (let i = 0; i < count; i++) {
            const prevDate = new Date(lab.date)
            prevDate.setMonth(prevDate.getMonth() - (i + 1))

            // Generate a value that follows the trend
            let prevValue = Number(lab.value)
            if (trend === "increasing") {
              prevValue = prevValue * (0.85 + Math.random() * 0.1) // 15-25% lower
            } else if (trend === "decreasing") {
              prevValue = prevValue * (1.15 + Math.random() * 0.1) // 15-25% higher
            } else {
              prevValue = prevValue * (0.95 + Math.random() * 0.1) // ±5%
            }

            previousResults.push({
              value: prevValue.toFixed(lab.value.toString().includes(".") ? 1 : 0),
              date: prevDate,
            })
          }
        }

        // Determine category based on test name
        let category = "General"
        if (["Hemoglobin", "White Blood Cell Count", "Platelet Count"].includes(lab.name)) {
          category = "Hematology"
        } else if (["Glucose", "HbA1c"].includes(lab.name)) {
          category = "Diabetes"
        } else if (["Total Cholesterol", "LDL Cholesterol", "HDL Cholesterol", "Triglycerides"].includes(lab.name)) {
          category = "Lipids"
        } else if (["Creatinine", "eGFR", "BUN"].includes(lab.name)) {
          category = "Renal"
        } else if (["ALT", "AST", "Bilirubin", "Alkaline Phosphatase"].includes(lab.name)) {
          category = "Liver"
        } else if (
          ["Sodium", "Potassium", "Chloride", "Bicarbonate", "Calcium", "Magnesium", "Phosphorus"].includes(lab.name)
        ) {
          category = "Electrolytes"
        } else if (["TSH", "Free T4", "Free T3"].includes(lab.name)) {
          category = "Thyroid"
        } else if (["Vitamin D", "Vitamin B12", "Folate", "Ferritin"].includes(lab.name)) {
          category = "Vitamins & Minerals"
        } else if (["Troponin", "BNP", "CK-MB"].includes(lab.name)) {
          category = "Cardiac"
        } else if (["CRP", "ESR", "Procalcitonin"].includes(lab.name)) {
          category = "Inflammatory"
        }

        return {
          id: lab.id,
          name: lab.name,
          category,
          value: lab.value,
          unit: lab.unit,
          referenceRange: lab.referenceRange || "Not established",
          abnormal: lab.abnormal,
          critical: isCritical,
          date: lab.date,
          trend,
          previousResults: previousResults.length > 0 ? previousResults : undefined,
        }
      })

      // Add some additional test results for variety
      if (selectedPatientId === "p1") {
        formattedResults.push(
          {
            id: "tr1",
            name: "Troponin",
            category: "Cardiac",
            value: "0.8",
            unit: "ng/mL",
            referenceRange: "<0.04",
            abnormal: true,
            critical: true,
            date: new Date(new Date().setDate(new Date().getDate() - 1)),
            trend: "increasing",
            previousResults: [
              { value: "0.3", date: new Date(new Date().setDate(new Date().getDate() - 2)) },
              { value: "0.01", date: new Date(new Date().setDate(new Date().getDate() - 30)) },
            ],
          },
          {
            id: "tr2",
            name: "BNP",
            category: "Cardiac",
            value: "850",
            unit: "pg/mL",
            referenceRange: "<100",
            abnormal: true,
            critical: false,
            date: new Date(new Date().setDate(new Date().getDate() - 1)),
            trend: "increasing",
          },
        )
      } else if (selectedPatientId === "p2") {
        formattedResults.push(
          {
            id: "tr3",
            name: "TSH",
            category: "Thyroid",
            value: "0.1",
            unit: "mIU/L",
            referenceRange: "0.4-4.5",
            abnormal: true,
            critical: false,
            date: new Date(new Date().setDate(new Date().getDate() - 3)),
            trend: "decreasing",
            previousResults: [
              { value: "0.3", date: new Date(new Date().setDate(new Date().getDate() - 90)) },
              { value: "1.2", date: new Date(new Date().setDate(new Date().getDate() - 180)) },
            ],
          },
          {
            id: "tr4",
            name: "Free T4",
            category: "Thyroid",
            value: "2.8",
            unit: "ng/dL",
            referenceRange: "0.8-1.8",
            abnormal: true,
            critical: false,
            date: new Date(new Date().setDate(new Date().getDate() - 3)),
            trend: "increasing",
          },
        )
      } else if (selectedPatientId === "p3") {
        formattedResults.push(
          {
            id: "tr5",
            name: "CRP",
            category: "Inflammatory",
            value: "85",
            unit: "mg/L",
            referenceRange: "<10",
            abnormal: true,
            critical: false,
            date: new Date(new Date().setDate(new Date().getDate() - 2)),
            trend: "increasing",
            previousResults: [
              { value: "45", date: new Date(new Date().setDate(new Date().getDate() - 7)) },
              { value: "12", date: new Date(new Date().setDate(new Date().getDate() - 14)) },
            ],
          },
          {
            id: "tr6",
            name: "ESR",
            category: "Inflammatory",
            value: "65",
            unit: "mm/hr",
            referenceRange: "<20",
            abnormal: true,
            critical: false,
            date: new Date(new Date().setDate(new Date().getDate() - 2)),
            trend: "stable",
          },
        )
      }

      setTestResults(formattedResults)
      setClinicalNotes("")
      setIsLoading(false)
    }, 1000)
  }, [selectedPatientId])

  const handleAddToNotes = (interpretation: string) => {
    setClinicalNotes((prev) => prev + "\n\n" + interpretation)
  }

  const handleSaveNotes = () => {
    // In a real application, this would save the notes to the database
    console.log("Saving clinical notes:", clinicalNotes)
    setNotesSaved(true)

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setNotesSaved(false)
    }, 3000)
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Test Result Interpretation</h1>
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

        {notesSaved && (
          <Alert className="bg-green-50 border-green-200 text-green-800 mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Notes saved successfully</AlertTitle>
            <AlertDescription>The clinical notes have been saved to the patient's medical record.</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid gap-4 mt-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : (
          <Tabs defaultValue="interpretation" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="interpretation">Test Interpretation</TabsTrigger>
              <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="interpretation" className="space-y-4 pt-4">
              <TestResultInterpretation
                patientId={selectedPatientId}
                patientName={patientData.patientName}
                testResults={testResults}
                onAddToNotes={handleAddToNotes}
              />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Clinical Notes
                  </CardTitle>
                  <CardDescription>Document your interpretation and clinical assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your clinical notes and assessment here..."
                    className="min-h-[300px]"
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                  />
                  <Button onClick={handleSaveNotes} className="mt-4">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DashboardShell>
    </>
  )
}
