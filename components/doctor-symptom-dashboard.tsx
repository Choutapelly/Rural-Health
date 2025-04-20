"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SymptomTrendChart } from "@/components/symptom-trend-chart"
import { SymptomHeatmap } from "@/components/symptom-heatmap"
import { SymptomCorrelationChart } from "@/components/symptom-correlation-chart"
import { SymptomDetailsTable } from "@/components/symptom-details-table"
import { type PatientSymptomData, type TimeRange, generateMockPatientData } from "@/utils/chart-data"
import {
  Download,
  FileText,
  BarChart2,
  Grid,
  TrendingUp,
  Users,
  ArrowUpDown,
  Calendar,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Printer,
  FileDown,
  Share2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DoctorSymptomDashboard() {
  const [patients, setPatients] = useState<PatientSymptomData[]>([])
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([])
  const [selectedPatients, setSelectedPatients] = useState<PatientSymptomData[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [dateRangeFilter, setDateRangeFilter] = useState<[Date | null, Date | null]>([null, null])

  // Load patient data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockPatients = generateMockPatientData()
    setPatients(mockPatients)

    // Select the first patient by default
    if (mockPatients.length > 0) {
      setSelectedPatientIds([mockPatients[0].patientId])
      setSelectedPatients([mockPatients[0]])
    }
  }, [])

  // Update selected patients when IDs change
  useEffect(() => {
    const selected = patients.filter((p) => selectedPatientIds.includes(p.patientId))
    setSelectedPatients(selected)

    // Reset selected symptoms when patients change
    setSelectedSymptoms([])
  }, [selectedPatientIds, patients])

  // Handle patient selection
  const handlePatientChange = (patientId: string) => {
    if (isComparisonMode) {
      // In comparison mode, toggle selection
      setSelectedPatientIds((prev) =>
        prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId],
      )
    } else {
      // In single mode, just select one
      setSelectedPatientIds([patientId])
    }
  }

  // Handle symptom selection
  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  // Get all available symptoms from selected patients
  const getAllSymptoms = () => {
    const allSymptoms = new Set<string>()
    selectedPatients.forEach((patient) => {
      Object.keys(patient.symptoms).forEach((symptom) => {
        allSymptoms.add(symptom)
      })
    })
    return Array.from(allSymptoms)
  }

  // Handle "Select All" for symptoms
  const handleSelectAllSymptoms = () => {
    const allSymptoms = getAllSymptoms()

    if (selectedSymptoms.length === allSymptoms.length) {
      // If all are selected, deselect all
      setSelectedSymptoms([])
    } else {
      // Otherwise, select all
      setSelectedSymptoms(allSymptoms)
    }
  }

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode)
    if (!isComparisonMode && selectedPatientIds.length === 1) {
      // If entering comparison mode with only one patient selected,
      // keep that selection (don't reset)
    } else if (isComparisonMode) {
      // If exiting comparison mode, only keep the first selected patient
      setSelectedPatientIds((prev) => (prev.length > 0 ? [prev[0]] : []))
    }
  }

  // Filter patients by search query
  const filteredPatients = patients.filter((patient) =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Export data as CSV
  const exportData = () => {
    if (selectedPatients.length === 0) return

    // Prepare CSV content
    let csvContent = "Patient,Date,Symptom,Severity,Notes\n"

    // Get all entries from selected patients
    selectedPatients.forEach((patient) => {
      Object.keys(patient.symptoms).forEach((symptom) => {
        if (selectedSymptoms.length === 0 || selectedSymptoms.includes(symptom)) {
          patient.symptoms[symptom].forEach((entry) => {
            const date = entry.date.toLocaleDateString()
            const notes = entry.notes ? `"${entry.notes.replace(/"/g, '""')}"` : ""

            csvContent += `"${patient.patientName}",${date},${symptom},${entry.severity},${notes}\n`
          })
        }
      })
    })

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `symptom_data_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate summary metrics
  const calculateMetrics = () => {
    if (selectedPatients.length === 0) return { totalSymptoms: 0, avgSeverity: 0, trendingSymptoms: [] }

    let totalEntries = 0
    let totalSeverity = 0
    const symptomCounts: Record<string, number> = {}
    const recentSeverities: Record<string, number[]> = {}

    selectedPatients.forEach((patient) => {
      Object.keys(patient.symptoms).forEach((symptom) => {
        const entries = patient.symptoms[symptom]

        // Count total entries
        totalEntries += entries.length

        // Sum severities
        entries.forEach((entry) => {
          totalSeverity += entry.severity
        })

        // Count symptoms
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + entries.length

        // Get recent severities (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentEntries = entries.filter((entry) => entry.date >= sevenDaysAgo)
        if (recentEntries.length > 0) {
          recentSeverities[symptom] = recentEntries.map((entry) => entry.severity)
        }
      })
    })

    // Calculate trending symptoms
    const trendingSymptoms = Object.keys(recentSeverities).map((symptom) => {
      const severities = recentSeverities[symptom]
      if (severities.length < 2) return { name: symptom, trend: "stable" }

      const firstHalf = severities.slice(0, Math.floor(severities.length / 2))
      const secondHalf = severities.slice(Math.floor(severities.length / 2))

      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length

      let trend: "improving" | "worsening" | "stable" = "stable"
      if (secondAvg - firstAvg > 0.5) trend = "worsening"
      else if (firstAvg - secondAvg > 0.5) trend = "improving"

      return { name: symptom, trend, count: symptomCounts[symptom] }
    })

    // Sort by count
    trendingSymptoms.sort((a, b) => (b.count || 0) - (a.count || 0))

    return {
      totalSymptoms: totalEntries,
      avgSeverity: totalEntries > 0 ? totalSeverity / totalEntries : 0,
      trendingSymptoms: trendingSymptoms.slice(0, 5), // Top 5
    }
  }

  const metrics = calculateMetrics()

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      case "worsening":
        return <ArrowUp className="h-4 w-4 text-rose-500" />
      default:
        return <Minus className="h-4 w-4 text-blue-500" />
    }
  }

  // Print dashboard
  const printDashboard = () => {
    window.print()
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
          <h1 className="text-2xl font-bold tracking-tight">Symptom Trends Dashboard</h1>
          <p className="text-muted-foreground">Analyze and visualize patient symptom patterns over time</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter Options</h4>
                  <p className="text-sm text-muted-foreground">Refine the symptom data display</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="severity" className="text-right">
                      Severity
                    </Label>
                    <Select value={severityFilter} onValueChange={setSeverityFilter} className="col-span-3">
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="mild">Mild (1-3)</SelectItem>
                        <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                        <SelectItem value="severe">Severe (7-10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportData}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={printDashboard}>
                <Printer className="mr-2 h-4 w-4" />
                Print Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant={isComparisonMode ? "default" : "outline"} size="sm" onClick={toggleComparisonMode}>
            <Users className="mr-2 h-4 w-4" />
            {isComparisonMode ? "Comparing Patients" : "Compare Patients"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Symptom Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSymptoms}</div>
            <p className="text-xs text-muted-foreground">
              From {selectedPatients.length} {selectedPatients.length === 1 ? "patient" : "patients"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgSeverity.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">
              {metrics.avgSeverity <= 3 ? "Mild" : metrics.avgSeverity <= 6 ? "Moderate" : "Severe"} average intensity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Symptoms</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAllSymptoms().length}</div>
            <p className="text-xs text-muted-foreground">
              {selectedSymptoms.length > 0
                ? `${selectedSymptoms.length} currently selected`
                : "None currently selected"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {timeRange === "7days"
                ? "7 Days"
                : timeRange === "30days"
                  ? "30 Days"
                  : timeRange === "90days"
                    ? "90 Days"
                    : timeRange === "6months"
                      ? "6 Months"
                      : timeRange === "1year"
                        ? "1 Year"
                        : "All Time"}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === "all" ? "Complete patient history" : "Recent symptom data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Patient Selection</CardTitle>
            <CardDescription>
              {isComparisonMode
                ? "Select multiple patients to compare their symptom data"
                : "Select a patient to view their symptom data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.patientId}
                  className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedPatientIds.includes(patient.patientId) ? "border-primary bg-primary/5" : "hover:bg-muted"
                  }`}
                  onClick={() => handlePatientChange(patient.patientId)}
                >
                  <Checkbox
                    checked={selectedPatientIds.includes(patient.patientId)}
                    onCheckedChange={() => handlePatientChange(patient.patientId)}
                    className="pointer-events-none"
                  />
                  <div className="grid gap-0.5">
                    <Label className="cursor-pointer">{patient.patientName}</Label>
                    <span className="text-xs text-muted-foreground">
                      {Object.keys(patient.symptoms).length} symptoms tracked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Symptoms</CardTitle>
            <CardDescription>Recent symptom trends</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.trendingSymptoms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No symptom data available</p>
            ) : (
              <div className="space-y-4">
                {metrics.trendingSymptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(symptom.trend)}
                      <span className="font-medium">{symptom.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        symptom.trend === "improving"
                          ? "bg-green-100 text-green-800"
                          : symptom.trend === "worsening"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {symptom.trend === "improving"
                        ? "Improving"
                        : symptom.trend === "worsening"
                          ? "Worsening"
                          : "Stable"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedPatients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Selection</CardTitle>
            <CardDescription>Select symptoms to visualize</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAllSymptoms} className="mb-1">
                {selectedSymptoms.length === getAllSymptoms().length ? "Deselect All" : "Select All"}
              </Button>

              {getAllSymptoms().map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={`symptom-${symptom}`}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                  />
                  <Label
                    htmlFor={`symptom-${symptom}`}
                    className="rounded-md border px-2 py-1 text-sm cursor-pointer hover:bg-muted"
                  >
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPatients.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="overview">
              <BarChart2 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="heatmap">
              <Grid className="mr-2 h-4 w-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="correlation">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Correlation
            </TabsTrigger>
            <TabsTrigger value="details">
              <FileText className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Symptom Severity Overview</CardTitle>
                  <CardDescription>
                    {selectedPatients.length === 1
                      ? `Symptom severity trends for ${selectedPatients[0].patientName}`
                      : `Comparing symptom severity across ${selectedPatients.length} patients`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {selectedPatients.map((patient) => (
                      <SymptomTrendChart
                        key={patient.patientId}
                        patientData={patient}
                        selectedSymptoms={
                          selectedSymptoms.length > 0 ? selectedSymptoms : Object.keys(patient.symptoms).slice(0, 3)
                        }
                        timeRange={timeRange}
                        height={300}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Symptom Distribution</CardTitle>
                  <CardDescription>Frequency of recorded symptoms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getAllSymptoms().map((symptom) => {
                      // Count total entries for this symptom across all selected patients
                      let count = 0
                      selectedPatients.forEach((patient) => {
                        if (patient.symptoms[symptom]) {
                          count += patient.symptoms[symptom].length
                        }
                      })

                      // Calculate percentage
                      const percentage =
                        metrics.totalSymptoms > 0 ? Math.round((count / metrics.totalSymptoms) * 100) : 0

                      return (
                        <div key={symptom} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{symptom}</span>
                            <span className="text-muted-foreground">
                              {count} records ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest symptom records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPatients.map((patient) => {
                      // Get all entries and sort by date (most recent first)
                      const allEntries = []
                      Object.keys(patient.symptoms).forEach((symptom) => {
                        patient.symptoms[symptom].forEach((entry) => {
                          allEntries.push({ ...entry, symptomName: symptom })
                        })
                      })

                      allEntries.sort((a, b) => b.date.getTime() - a.date.getTime())

                      // Take only the 5 most recent
                      const recentEntries = allEntries.slice(0, 5)

                      return (
                        <div key={patient.patientId}>
                          {selectedPatients.length > 1 && <h4 className="font-medium mb-2">{patient.patientName}</h4>}

                          {recentEntries.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div>
                                <div className="font-medium">{entry.symptomName}</div>
                                <div className="text-sm text-muted-foreground">{entry.date.toLocaleDateString()}</div>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  entry.severity <= 3
                                    ? "bg-green-100 text-green-800"
                                    : entry.severity <= 6
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-rose-100 text-rose-800"
                                }
                              >
                                {entry.severity}/10
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="grid gap-4">
              {selectedPatients.map((patient) => (
                <SymptomTrendChart
                  key={patient.patientId}
                  patientData={patient}
                  selectedSymptoms={selectedSymptoms}
                  timeRange={timeRange}
                  height={400}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="heatmap">
            <div className="grid gap-4">
              {selectedPatients.map((patient) => (
                <SymptomHeatmap key={patient.patientId} patientData={patient} timeRange={timeRange} height={400} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="correlation">
            <div className="grid gap-4">
              {selectedPatients.map((patient) => (
                <SymptomCorrelationChart key={patient.patientId} patientData={patient} height={400} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid gap-4">
              {selectedPatients.map((patient) => (
                <SymptomDetailsTable
                  key={patient.patientId}
                  patientData={patient}
                  timeRange={timeRange}
                  selectedSymptoms={selectedSymptoms}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
