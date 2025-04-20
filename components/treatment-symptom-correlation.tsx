"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { type TimelineEvent, analyzeMedicationEffectOnSymptoms } from "@/utils/timeline-data"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

interface TreatmentSymptomCorrelationProps {
  events: TimelineEvent[]
}

export function TreatmentSymptomCorrelation({ events }: TreatmentSymptomCorrelationProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<string>("")
  const [timeWindow, setTimeWindow] = useState<number>(30)

  // Extract unique symptoms from events
  const symptoms = useMemo(() => {
    const symptomSet = new Set<string>()
    events.forEach((event) => {
      if (event.type === "symptom_report" && event.metadata?.symptomName) {
        symptomSet.add(event.metadata.symptomName as string)
      }
    })
    return Array.from(symptomSet)
  }, [events])

  // Extract medication events
  const medicationEvents = useMemo(() => {
    return events.filter((event) => event.type === "medication_started" || event.type === "medication_stopped")
  }, [events])

  // Analyze correlation between medications and selected symptom
  const correlations = useMemo(() => {
    if (!selectedSymptom || medicationEvents.length === 0) return []

    return medicationEvents
      .map((medicationEvent) => {
        try {
          const analysis = analyzeMedicationEffectOnSymptoms(medicationEvent, events, selectedSymptom, timeWindow)
          return {
            medicationEvent,
            analysis,
          }
        } catch (error) {
          console.error("Error analyzing medication effect:", error)
          return null
        }
      })
      .filter(Boolean)
  }, [selectedSymptom, medicationEvents, events, timeWindow])

  // Get effect icon
  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case "improved":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "worsened":
        return <TrendingUp className="h-4 w-4 text-rose-500" />
      default:
        return <Minus className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment-Symptom Correlation</CardTitle>
        <CardDescription>Analyze how treatments affect symptom severity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Symptom</label>
              <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a symptom" />
                </SelectTrigger>
                <SelectContent>
                  {symptoms.map((symptom) => (
                    <SelectItem key={symptom} value={symptom}>
                      {symptom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Window</label>
              <Select value={timeWindow.toString()} onValueChange={(value) => setTimeWindow(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time window" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSymptom ? (
            correlations.length > 0 ? (
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium">
                  Analyzing effects on {selectedSymptom} within {timeWindow} days of medication changes
                </h3>
                <div className="space-y-3">
                  {correlations.map(({ medicationEvent, analysis }, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{medicationEvent.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(medicationEvent.date, "MMMM d, yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getEffectIcon(analysis.effect)}
                          <Badge
                            variant="outline"
                            className={
                              analysis.effect === "improved"
                                ? "bg-green-100 text-green-800"
                                : analysis.effect === "worsened"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {analysis.effect.charAt(0).toUpperCase() + analysis.effect.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Before</p>
                          <p className="font-medium">{analysis.before.toFixed(1)}/10</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">After</p>
                          <p className="font-medium">{analysis.after.toFixed(1)}/10</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Change</p>
                          <p
                            className={
                              analysis.change < 0
                                ? "text-green-600 font-medium"
                                : analysis.change > 0
                                  ? "text-rose-600 font-medium"
                                  : "font-medium"
                            }
                          >
                            {analysis.change > 0 ? "+" : ""}
                            {analysis.change.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No medication changes found or not enough symptom data to analyze correlation.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Select a symptom to analyze treatment correlations.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
