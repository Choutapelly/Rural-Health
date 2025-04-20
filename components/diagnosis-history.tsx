"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, CheckCircle, Clock, FileText, AlertTriangle, XCircle } from "lucide-react"

interface DiagnosisEvent {
  id: string
  diagnosisId: string
  diagnosisName: string
  date: Date
  type: "initial" | "confirmed" | "changed" | "ruled_out" | "recurrence"
  provider: string
  notes?: string
  evidence?: {
    type: "symptom" | "lab_result" | "imaging" | "physical_exam"
    description: string
  }[]
}

interface DiagnosisHistoryProps {
  diagnosisEvents: DiagnosisEvent[]
  patientName: string
}

export function DiagnosisHistory({ diagnosisEvents, patientName }: DiagnosisHistoryProps) {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<DiagnosisEvent | null>(null)

  // Get unique diagnoses from events
  const uniqueDiagnoses = Array.from(new Set(diagnosisEvents.map((event) => event.diagnosisId))).map((diagnosisId) => {
    const events = diagnosisEvents.filter((event) => event.diagnosisId === diagnosisId)
    return {
      id: diagnosisId,
      name: events[0].diagnosisName,
      status: getLatestStatus(events),
      eventCount: events.length,
    }
  })

  // Get the latest status of a diagnosis based on its events
  function getLatestStatus(events: DiagnosisEvent[]): "active" | "ruled_out" | "resolved" {
    // Sort events by date (newest first)
    const sortedEvents = [...events].sort((a, b) => b.date.getTime() - a.date.getTime())

    // Get the most recent event
    const latestEvent = sortedEvents[0]

    if (latestEvent.type === "ruled_out") {
      return "ruled_out"
    } else if (latestEvent.type === "confirmed" || latestEvent.type === "recurrence") {
      return "active"
    } else {
      return "active" // Default to active for other event types
    }
  }

  // Filter events for the selected diagnosis
  const filteredEvents = selectedDiagnosis
    ? diagnosisEvents.filter((event) => event.diagnosisId === selectedDiagnosis)
    : diagnosisEvents

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Get status badge color
  const getStatusColor = (status: "active" | "ruled_out" | "resolved") => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ruled_out":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return ""
    }
  }

  // Get event type badge color
  const getEventTypeColor = (type: DiagnosisEvent["type"]) => {
    switch (type) {
      case "initial":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "changed":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "ruled_out":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "recurrence":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return ""
    }
  }

  // Get event type icon
  const getEventTypeIcon = (type: DiagnosisEvent["type"]) => {
    switch (type) {
      case "initial":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "changed":
        return <AlertTriangle className="h-4 w-4" />
      case "ruled_out":
        return <XCircle className="h-4 w-4" />
      case "recurrence":
        return <Calendar className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const returnrn = (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnosis History</CardTitle>
        <CardDescription>Chronological record of {patientName}'s diagnoses and changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Diagnosis Events</h3>
              {selectedDiagnosis && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDiagnosis(null)}>
                  Clear Filter
                </Button>
              )}
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="relative pl-6 border-l-2 border-muted space-y-4">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[22px] top-0 w-10 h-10 flex items-center justify-center rounded-full bg-background border-2 border-muted">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div
                            className={`ml-4 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${getEventTypeColor(event.type)}`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-medium">{event.diagnosisName}</div>
                              <div className="text-xs">{format(event.date, "MMM d, yyyy")}</div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {event.type === "initial"
                                  ? "Initial Diagnosis"
                                  : event.type === "confirmed"
                                    ? "Diagnosis Confirmed"
                                    : event.type === "changed"
                                      ? "Diagnosis Changed"
                                      : event.type === "ruled_out"
                                        ? "Diagnosis Ruled Out"
                                        : "Diagnosis Recurrence"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">by {event.provider}</span>
                            </div>
                            {event.notes && <p className="text-sm mt-2 line-clamp-2">{event.notes}</p>}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{event.diagnosisName}</DialogTitle>
                            <DialogDescription>
                              {format(event.date, "MMMM d, yyyy")} by {event.provider}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium">Event Type</h4>
                              <Badge variant="outline" className={`mt-1 ${getEventTypeColor(event.type)}`}>
                                {event.type === "initial"
                                  ? "Initial Diagnosis"
                                  : event.type === "confirmed"
                                    ? "Diagnosis Confirmed"
                                    : event.type === "changed"
                                      ? "Diagnosis Changed"
                                      : event.type === "ruled_out"
                                        ? "Diagnosis Ruled Out"
                                        : "Diagnosis Recurrence"}
                              </Badge>
                            </div>

                            {event.notes && (
                              <div>
                                <h4 className="text-sm font-medium">Notes</h4>
                                <p className="mt-1">{event.notes}</p>
                              </div>
                            )}

                            {event.evidence && event.evidence.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium">Supporting Evidence</h4>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  {event.evidence.map((item, index) => (
                                    <li key={index}>
                                      <span className="font-medium">{item.type.replace("_", " ")}: </span>
                                      {item.description}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No diagnosis events found.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="diagnoses" className="space-y-4">
            <h3 className="text-sm font-medium">All Diagnoses</h3>

            <div className="grid gap-3">
              {uniqueDiagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-muted/50 ${getStatusColor(diagnosis.status)}`}
                  onClick={() => setSelectedDiagnosis(diagnosis.id)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{diagnosis.name}</h4>
                    <Badge variant="outline">
                      {diagnosis.status === "active"
                        ? "Active"
                        : diagnosis.status === "ruled_out"
                          ? "Ruled Out"
                          : "Resolved"}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">
                    {diagnosis.eventCount} {diagnosis.eventCount === 1 ? "event" : "events"} in history
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return returnrn
}
