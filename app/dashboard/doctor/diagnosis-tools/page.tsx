"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { DifferentialDiagnosis } from "@/components/differential-diagnosis"
import { DiagnosisVerification } from "@/components/diagnosis-verification"
import { DiagnosisHistory } from "@/components/diagnosis-history"
import { DiagnosisPrediction } from "@/components/diagnosis-prediction"
import { PatientTimeline } from "@/components/patient-timeline"
import { generateMockMedicalRecords } from "@/utils/medical-records"

// Mock data
const mockPatients = [
  { id: "p1", name: "John Smith" },
  { id: "p2", name: "Maria Gonzalez" },
  { id: "p3", name: "Raj Patel" },
]

export default function DiagnosisToolsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatientId, setSelectedPatientId] = useState("p1")
  const [patientData, setPatientData] = useState<any>(null)
  const [timelineEvents, setTimelineEvents] = useState<any[]>([])
  const [diagnosisEvents, setDiagnosisEvents] = useState<any[]>([])
  const [symptoms, setSymptoms] = useState<any[]>([])
  const [symptomPatterns, setSymptomPatterns] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    setTimeout(() => {
      // Generate mock medical records
      const records = generateMockMedicalRecords(
        mockPatients.map((p) => p.id),
        mockPatients.map((p) => p.name),
      )

      const patientRecord = records[selectedPatientId]
      setPatientData(patientRecord)

      // Generate mock timeline events
      const mockTimelineEvents = []

      // Add condition events
      patientRecord.conditions.forEach((condition) => {
        mockTimelineEvents.push({
          id: `event-condition-${condition.id}`,
          type: "condition_diagnosis",
          category: "condition",
          title: `Diagnosed with ${condition.name}`,
          description: condition.notes || `${condition.name} was diagnosed`,
          date: condition.diagnosisDate,
          status: condition.status,
          metadata: {
            conditionId: condition.id,
            conditionName: condition.name,
          },
        })
      })

      // Add medication events
      patientRecord.medications.forEach((medication) => {
        mockTimelineEvents.push({
          id: `event-med-start-${medication.id}`,
          type: "medication_started",
          category: "medication",
          title: `Started ${medication.name}`,
          description: `${medication.dosage} ${medication.frequency}`,
          date: medication.startDate,
          status: medication.status,
          metadata: {
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            forCondition: medication.forCondition,
          },
        })

        if (medication.endDate) {
          mockTimelineEvents.push({
            id: `event-med-end-${medication.id}`,
            type: "medication_stopped",
            category: "medication",
            title: `Stopped ${medication.name}`,
            description: medication.notes || `Completed course of ${medication.name}`,
            date: medication.endDate,
            status: "discontinued",
            metadata: {
              medicationId: medication.id,
              medicationName: medication.name,
              reason: "Course completed",
            },
          })
        }
      })

      // Add lab result events
      patientRecord.labResults.forEach((lab) => {
        mockTimelineEvents.push({
          id: `event-lab-${lab.id}`,
          type: "lab_result",
          category: "lab",
          title: `${lab.name} Test`,
          description: `Result: ${lab.value} ${lab.unit} ${lab.abnormal ? "(Abnormal)" : "(Normal)"}`,
          date: lab.date,
          status: lab.abnormal ? "abnormal" : "normal",
          metadata: {
            labId: lab.id,
            labName: lab.name,
            value: lab.value,
            unit: lab.unit,
            referenceRange: lab.referenceRange,
          },
        })
      })

      // Add vital sign events
      patientRecord.vitalSigns.forEach((vital) => {
        mockTimelineEvents.push({
          id: `event-vital-${vital.id}`,
          type: "vital_sign",
          category: "vital",
          title: `${vital.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
          description: `Recorded: ${vital.value} ${vital.unit}`,
          date: vital.date,
          status: "recorded",
          metadata: {
            vitalId: vital.id,
            vitalType: vital.type,
            value: vital.value,
            unit: vital.unit,
          },
        })
      })

      // Add note events
      patientRecord.notes.forEach((note) => {
        mockTimelineEvents.push({
          id: `event-note-${note.id}`,
          type: "note",
          category: "note",
          title: `Clinical Note`,
          description: note.content.substring(0, 100) + (note.content.length > 100 ? "..." : ""),
          date: note.date,
          status: "documented",
          metadata: {
            noteId: note.id,
            provider: note.provider,
            content: note.content,
            tags: note.tags,
          },
        })
      })

      // Add mock symptom events
      const mockSymptoms = [
        {
          id: "s1",
          name: "Headache",
          present: true,
          severity: 7,
          startDate: new Date(2023, 4, 15),
        },
        {
          id: "s2",
          name: "Nausea",
          present: true,
          severity: 4,
          startDate: new Date(2023, 4, 15),
        },
        {
          id: "s3",
          name: "Fatigue",
          present: true,
          severity: 6,
          startDate: new Date(2023, 3, 10),
        },
        {
          id: "s4",
          name: "Joint pain",
          present: selectedPatientId === "p2",
          severity: 8,
          startDate: new Date(2023, 2, 5),
        },
        {
          id: "s5",
          name: "Shortness of breath",
          present: selectedPatientId === "p1",
          severity: 5,
          startDate: new Date(2023, 5, 20),
        },
      ]

      // Add symptom events to timeline
      mockSymptoms
        .filter((s) => s.present)
        .forEach((symptom) => {
          mockTimelineEvents.push({
            id: `event-symptom-${symptom.id}`,
            type: "symptom_report",
            category: "symptom",
            title: `Reported ${symptom.name}`,
            description: `Severity: ${symptom.severity}/10`,
            date: symptom.startDate,
            severity: symptom.severity,
            status: "active",
            metadata: {
              symptomId: symptom.id,
              symptomName: symptom.name,
              severity: symptom.severity,
            },
          })
        })

      // Generate mock diagnosis events
      const mockDiagnosisEvents = []

      patientRecord.conditions.forEach((condition) => {
        // Initial diagnosis
        mockDiagnosisEvents.push({
          id: `diag-event-initial-${condition.id}`,
          diagnosisId: condition.id,
          diagnosisName: condition.name,
          date: condition.diagnosisDate,
          type: "initial",
          provider: "Dr. Sarah Johnson",
          notes: `Initial diagnosis of ${condition.name} based on presenting symptoms and examination.`,
          evidence: [
            {
              type: "symptom",
              description:
                condition.name === "Hypertension"
                  ? "Elevated blood pressure readings"
                  : condition.name === "Migraine"
                    ? "Recurring headaches with nausea"
                    : condition.name === "Type 2 Diabetes"
                      ? "Elevated blood glucose levels"
                      : "Presenting symptoms",
            },
            {
              type: "physical_exam",
              description: "Clinical examination findings",
            },
          ],
        })

        // Add a confirmation event 2 weeks later
        const confirmDate = new Date(condition.diagnosisDate)
        confirmDate.setDate(confirmDate.getDate() + 14)

        mockDiagnosisEvents.push({
          id: `diag-event-confirm-${condition.id}`,
          diagnosisId: condition.id,
          diagnosisName: condition.name,
          date: confirmDate,
          type: "confirmed",
          provider: "Dr. Sarah Johnson",
          notes: `Diagnosis of ${condition.name} confirmed after follow-up and additional testing.`,
          evidence: [
            {
              type: "lab_result",
              description:
                condition.name === "Hypertension"
                  ? "Multiple elevated BP readings"
                  : condition.name === "Type 2 Diabetes"
                    ? "HbA1c of 7.2%"
                    : "Confirmatory test results",
            },
          ],
        })

        // For some conditions, add a change or ruled out event
        if (condition.name === "Migraine" && selectedPatientId === "p3") {
          const changeDate = new Date(condition.diagnosisDate)
          changeDate.setMonth(changeDate.getMonth() + 2)

          mockDiagnosisEvents.push({
            id: `diag-event-change-${condition.id}`,
            diagnosisId: condition.id,
            diagnosisName: "Tension Headache",
            date: changeDate,
            type: "changed",
            provider: "Dr. Michael Chen",
            notes:
              "Diagnosis revised from Migraine to Tension Headache based on symptom pattern and response to treatment.",
            evidence: [
              {
                type: "symptom",
                description: "Lack of typical migraine features",
              },
              {
                type: "physical_exam",
                description: "Muscle tension in neck and shoulders",
              },
            ],
          })
        }

        if (condition.name === "Gastroesophageal Reflux Disease" && selectedPatientId === "p2") {
          const ruleOutDate = new Date(condition.diagnosisDate)
          ruleOutDate.setMonth(ruleOutDate.getMonth() + 3)

          mockDiagnosisEvents.push({
            id: `diag-event-ruleout-${condition.id}`,
            diagnosisId: condition.id,
            diagnosisName: condition.name,
            date: ruleOutDate,
            type: "ruled_out",
            provider: "Dr. James Wilson",
            notes: "GERD diagnosis ruled out after endoscopy showed normal findings.",
            evidence: [
              {
                type: "imaging",
                description: "Normal endoscopy findings",
              },
              {
                type: "lab_result",
                description: "Normal pH monitoring",
              },
            ],
          })
        }
      })

      // Generate mock symptom patterns
      const mockSymptomPatterns = [
        {
          id: "pattern1",
          symptoms: ["Headache", "Nausea", "Light sensitivity"],
          frequency: "weekly",
          duration: "4-6 hours",
          triggers: ["Stress", "Lack of sleep"],
        },
        {
          id: "pattern2",
          symptoms: ["Joint pain", "Morning stiffness"],
          frequency: "daily",
          duration: "Several hours",
          triggers: ["Cold weather", "Physical activity"],
        },
        {
          id: "pattern3",
          symptoms: ["Shortness of breath", "Wheezing"],
          frequency: "sporadic",
          duration: "15-30 minutes",
          triggers: ["Exercise"],
        },
      ]

      setTimelineEvents(mockTimelineEvents)
      setDiagnosisEvents(mockDiagnosisEvents)
      setSymptoms(mockSymptoms)
      setSymptomPatterns(mockSymptomPatterns)

      setIsLoading(false)
    }, 1000)
  }, [selectedPatientId])

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Diagnosis Tools</h1>
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

        {isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="differential">Differential Diagnosis</TabsTrigger>
              <TabsTrigger value="verification">Diagnosis Verification</TabsTrigger>
              <TabsTrigger value="history">Diagnosis History</TabsTrigger>
              <TabsTrigger value="prediction">Diagnosis Prediction</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <PatientTimeline events={timelineEvents} patientName={patientData.patientName} />
            </TabsContent>

            <TabsContent value="differential" className="space-y-4">
              <DifferentialDiagnosis patientSymptoms={symptoms} />
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <DiagnosisVerification patientSymptoms={symptoms} diagnoses={patientData.conditions} />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <DiagnosisHistory diagnosisEvents={diagnosisEvents} patientName={patientData.patientName} />
            </TabsContent>

            <TabsContent value="prediction" className="space-y-4">
              <DiagnosisPrediction patientSymptoms={symptoms} symptomPatterns={symptomPatterns} />
            </TabsContent>
          </Tabs>
        )}
      </DashboardShell>
    </>
  )
}
