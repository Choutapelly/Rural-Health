"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Calendar } from "lucide-react"

type SymptomEntry = {
  id: string
  symptom: string
  severity: number
  date: Date
  notes?: string
}

type SymptomHistory = {
  [symptom: string]: SymptomEntry[]
}

export function SymptomTracker() {
  const [activeTab, setActiveTab] = useState("track")
  const [newSymptom, setNewSymptom] = useState("")
  const [newSeverity, setNewSeverity] = useState<number>(5)
  const [newNotes, setNewNotes] = useState("")
  const [symptomHistory, setSymptomHistory] = useState<SymptomHistory>({
    Headache: [
      {
        id: "1",
        symptom: "Headache",
        severity: 7,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes: "Throbbing pain on right side",
      },
      {
        id: "2",
        symptom: "Headache",
        severity: 5,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes: "Mild pain, responded to medication",
      },
      {
        id: "3",
        symptom: "Headache",
        severity: 3,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: "Much better today",
      },
    ],
    Cough: [
      {
        id: "4",
        symptom: "Cough",
        severity: 6,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        notes: "Dry cough, worse at night",
      },
      {
        id: "5",
        symptom: "Cough",
        severity: 4,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: "Less frequent",
      },
    ],
  })

  const handleAddSymptomEntry = () => {
    if (!newSymptom.trim()) return

    const entry: SymptomEntry = {
      id: Date.now().toString(),
      symptom: newSymptom,
      severity: newSeverity,
      date: new Date(),
      notes: newNotes.trim() || undefined,
    }

    setSymptomHistory((prev) => {
      const updatedHistory = { ...prev }
      if (!updatedHistory[newSymptom]) {
        updatedHistory[newSymptom] = []
      }
      updatedHistory[newSymptom] = [...updatedHistory[newSymptom], entry].sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      )
      return updatedHistory
    })

    // Reset form
    setNewSymptom("")
    setNewSeverity(5)
    setNewNotes("")
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-100 text-green-800"
    if (severity <= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-rose-100 text-rose-800"
  }

  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return "Mild"
    if (severity <= 6) return "Moderate"
    return "Severe"
  }

  const getSymptomTrend = (entries: SymptomEntry[]) => {
    if (entries.length < 2) return "stable"

    const latest = entries[0].severity
    const previous = entries[1].severity

    if (latest < previous) return "improving"
    if (latest > previous) return "worsening"
    return "stable"
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "improving":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Improving
          </Badge>
        )
      case "worsening":
        return (
          <Badge variant="outline" className="bg-rose-100 text-rose-800">
            Worsening
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Stable
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Tracker</CardTitle>
        <CardDescription>Track your symptoms over time to help your doctor understand your condition</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="track">Track Symptoms</TabsTrigger>
            <TabsTrigger value="history">Symptom History</TabsTrigger>
          </TabsList>

          <TabsContent value="track" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="symptom">Symptom</Label>
                <Input
                  id="symptom"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Enter symptom name"
                  list="common-symptoms"
                />
                <datalist id="common-symptoms">
                  <option value="Headache" />
                  <option value="Fever" />
                  <option value="Cough" />
                  <option value="Fatigue" />
                  <option value="Nausea" />
                  <option value="Dizziness" />
                  <option value="Chest Pain" />
                  <option value="Shortness of Breath" />
                  <option value="Joint Pain" />
                  <option value="Rash" />
                </datalist>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="severity">Severity (1-10)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="severity"
                    type="range"
                    min="1"
                    max="10"
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(Number.parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Badge variant="outline" className={getSeverityColor(newSeverity)}>
                    {newSeverity} - {getSeverityLabel(newSeverity)}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any additional details about this symptom"
                />
              </div>

              <Button onClick={handleAddSymptomEntry} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Symptom Entry
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            {Object.keys(symptomHistory).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No symptom history recorded yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("track")}>
                  Start Tracking Symptoms
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(symptomHistory).map(([symptom, entries]) => (
                  <div key={symptom} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{symptom}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(entries[0].severity)}>
                          Current: {entries[0].severity}/10
                        </Badge>
                        {entries.length > 1 && getTrendBadge(getSymptomTrend(entries))}
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-3 font-medium border-b">
                        <div>Date</div>
                        <div>Severity</div>
                        <div className="col-span-2">Notes</div>
                      </div>
                      {entries.map((entry) => (
                        <div key={entry.id} className="grid grid-cols-4 p-3 border-b last:border-0">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {entry.date.toLocaleDateString()}
                          </div>
                          <div>
                            <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                              {entry.severity}/10
                            </Badge>
                          </div>
                          <div className="col-span-2 text-sm text-muted-foreground">{entry.notes || "No notes"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
