"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SymptomTrendChart } from "@/components/symptom-trend-chart"
import { SymptomHeatmap } from "@/components/symptom-heatmap"
import { SymptomCorrelationChart } from "@/components/symptom-correlation-chart"
import { SymptomDetailsTable } from "@/components/symptom-details-table"
import { type PatientSymptomData, type TimeRange, generateMockPatientData } from "@/utils/chart-data"
import { Download, FileText, BarChart2, Grid, TrendingUp } from "lucide-react"

export function SymptomVisualizationDashboard() {
  const [patients, setPatients] = useState<PatientSymptomData[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [selectedPatient, setSelectedPatient] = useState<PatientSymptomData | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("trends")

  // Load patient data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockPatients = generateMockPatientData()
    setPatients(mockPatients)

    // Select the first patient by default
    if (mockPatients.length > 0) {
      setSelectedPatientId(mockPatients[0].patientId)
      setSelectedPatient(mockPatients[0])
    }
  }, [])

  // Update selected patient when ID changes
  useEffect(() => {
    const patient = patients.find((p) => p.patientId === selectedPatientId)
    setSelectedPatient(patient || null)

    // Reset selected symptoms when patient changes
    setSelectedSymptoms([])
  }, [selectedPatientId, patients])

  // Handle patient selection
  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId)
  }

  // Handle symptom selection
  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  // Handle "Select All" for symptoms
  const handleSelectAllSymptoms = () => {
    if (!selectedPatient) return

    const allSymptoms = Object.keys(selectedPatient.symptoms)

    if (selectedSymptoms.length === allSymptoms.length) {
      // If all are selected, deselect all
      setSelectedSymptoms([])
    } else {
      // Otherwise, select all
      setSelectedSymptoms(allSymptoms)
    }
  }

  // Export data as CSV
  const exportData = () => {
    if (!selectedPatient) return

    // Prepare CSV content
    let csvContent = "Date,Symptom,Severity,Notes\n"

    // Get all entries
    const entries: any[] = []
    Object.keys(selectedPatient.symptoms).forEach((symptom) => {
      entries.push(...selectedPatient.symptoms[symptom])
    })

    // Sort by date
    entries.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Add each entry to CSV
    entries.forEach((entry) => {
      const date = entry.date.toLocaleDateString()
      const symptom = entry.symptom
      const severity = entry.severity
      const notes = entry.notes ? `"${entry.notes.replace(/"/g, '""')}"` : ""

      csvContent += `${date},${symptom},${severity},${notes}\n`
    })

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${selectedPatient.patientName.replace(/\s+/g, "_")}_symptoms.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading patient data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Symptom Visualization Dashboard</h1>
          <p className="text-muted-foreground">Analyze and visualize patient symptom trends over time</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPatientId} onValueChange={handlePatientChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.patientId} value={patient.patientId}>
                  {patient.patientName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportData} disabled={!selectedPatient}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {selectedPatient ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{selectedPatient.patientName}</CardTitle>
              <CardDescription>Select symptoms to visualize</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAllSymptoms} className="mb-1">
                  {selectedSymptoms.length === Object.keys(selectedPatient.symptoms).length
                    ? "Deselect All"
                    : "Select All"}
                </Button>

                {Object.keys(selectedPatient.symptoms).map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={`symptom-${symptom}`}
                      checked={selectedSymptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label htmlFor={`symptom-${symptom}`} className="rounded-md border px-2 py-1 text-sm">
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="trends">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="heatmap">
                <Grid className="mr-2 h-4 w-4" />
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="correlation">
                <BarChart2 className="mr-2 h-4 w-4" />
                Correlation
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <SymptomTrendChart
                patientData={selectedPatient}
                selectedSymptoms={selectedSymptoms}
                timeRange={timeRange}
                height={400}
              />
            </TabsContent>

            <TabsContent value="heatmap">
              <SymptomHeatmap patientData={selectedPatient} timeRange={timeRange} height={400} />
            </TabsContent>

            <TabsContent value="correlation">
              <SymptomCorrelationChart patientData={selectedPatient} height={400} />
            </TabsContent>

            <TabsContent value="details">
              <SymptomDetailsTable
                patientData={selectedPatient}
                timeRange={timeRange}
                selectedSymptoms={selectedSymptoms}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Please select a patient to view symptom data</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
