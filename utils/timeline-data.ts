import type { PatientSymptomData } from "@/utils/chart-data"
import type { PatientMedicalRecord } from "@/utils/medical-records"

// Define the types of events that can appear on the timeline
export type TimelineEventType =
  | "symptom_report"
  | "condition_diagnosis"
  | "medication_started"
  | "medication_changed"
  | "medication_stopped"
  | "lab_result"
  | "vital_sign"
  | "appointment"
  | "note"

// Define the timeline event interface
export interface TimelineEvent {
  id: string
  type: TimelineEventType
  date: Date
  title: string
  description: string
  severity?: number
  status?: string
  category?: string
  relatedTo?: string[]
  metadata?: Record<string, any>
}

// Function to generate a timeline from symptom data and medical records
export function generatePatientTimeline(
  patientData: PatientSymptomData,
  medicalRecord?: PatientMedicalRecord,
): TimelineEvent[] {
  const timeline: TimelineEvent[] = []

  // Process symptom data
  if (patientData) {
    Object.entries(patientData.symptoms).forEach(([symptomName, entries]) => {
      entries.forEach((entry) => {
        timeline.push({
          id: `symptom-${symptomName}-${entry.date.getTime()}`,
          type: "symptom_report",
          date: entry.date,
          title: `Reported ${symptomName}`,
          description: entry.notes || `Severity: ${entry.severity}/10`,
          severity: entry.severity,
          category: "symptom",
          metadata: {
            symptomName,
            severity: entry.severity,
            notes: entry.notes,
          },
        })
      })
    })
  }

  // Process medical record data if available
  if (medicalRecord) {
    // Add conditions
    medicalRecord.conditions.forEach((condition) => {
      timeline.push({
        id: `condition-${condition.id}`,
        type: "condition_diagnosis",
        date: condition.diagnosisDate,
        title: `Diagnosed: ${condition.name}`,
        description: condition.notes || `Status: ${condition.status}`,
        status: condition.status,
        category: "condition",
        metadata: {
          conditionId: condition.id,
          conditionName: condition.name,
          status: condition.status,
          notes: condition.notes,
        },
      })
    })

    // Add medications
    medicalRecord.medications.forEach((medication) => {
      // Add medication start
      timeline.push({
        id: `medication-start-${medication.id}`,
        type: "medication_started",
        date: medication.startDate,
        title: `Started: ${medication.name}`,
        description: `${medication.dosage}, ${medication.frequency}${
          medication.forCondition ? ` for ${medication.forCondition}` : ""
        }`,
        status: medication.status,
        category: "medication",
        relatedTo: medication.forCondition
          ? medicalRecord.conditions.filter((c) => c.name === medication.forCondition).map((c) => `condition-${c.id}`)
          : undefined,
        metadata: {
          medicationId: medication.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          status: medication.status,
          notes: medication.notes,
        },
      })

      // Add medication end if applicable
      if (medication.endDate) {
        timeline.push({
          id: `medication-end-${medication.id}`,
          type: "medication_stopped",
          date: medication.endDate,
          title: `Stopped: ${medication.name}`,
          description: medication.notes || "Medication discontinued",
          status: "discontinued",
          category: "medication",
          relatedTo: [`medication-start-${medication.id}`],
          metadata: {
            medicationId: medication.id,
            medicationName: medication.name,
          },
        })
      }
    })

    // Add lab results
    medicalRecord.labResults.forEach((labResult) => {
      timeline.push({
        id: `lab-${labResult.id}`,
        type: "lab_result",
        date: labResult.date,
        title: `Lab Result: ${labResult.name}`,
        description: `${labResult.value} ${labResult.unit}${
          labResult.referenceRange ? ` (Reference: ${labResult.referenceRange})` : ""
        }`,
        status: labResult.abnormal ? "abnormal" : "normal",
        category: "lab",
        metadata: {
          labId: labResult.id,
          labName: labResult.name,
          value: labResult.value,
          unit: labResult.unit,
          referenceRange: labResult.referenceRange,
          abnormal: labResult.abnormal,
          notes: labResult.notes,
        },
      })
    })

    // Add vital signs
    medicalRecord.vitalSigns.forEach((vitalSign) => {
      timeline.push({
        id: `vital-${vitalSign.id}`,
        type: "vital_sign",
        date: vitalSign.date,
        title: `Vital Sign: ${vitalSign.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
        description: `${vitalSign.value} ${vitalSign.unit}`,
        category: "vital",
        metadata: {
          vitalId: vitalSign.id,
          vitalType: vitalSign.type,
          value: vitalSign.value,
          unit: vitalSign.unit,
          notes: vitalSign.notes,
        },
      })
    })

    // Add clinical notes
    medicalRecord.notes.forEach((note) => {
      timeline.push({
        id: `note-${note.id}`,
        type: "note",
        date: note.date,
        title: `Clinical Note: ${note.provider}`,
        description: note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content,
        category: "note",
        metadata: {
          noteId: note.id,
          provider: note.provider,
          content: note.content,
          tags: note.tags,
        },
      })
    })
  }

  // Sort the timeline by date
  timeline.sort((a, b) => a.date.getTime() - b.date.getTime())

  return timeline
}

// Function to filter timeline events
export function filterTimelineEvents(
  events: TimelineEvent[],
  filters: {
    categories?: string[]
    startDate?: Date
    endDate?: Date
    searchTerm?: string
  },
): TimelineEvent[] {
  return events.filter((event) => {
    // Filter by category
    if (filters.categories && filters.categories.length > 0) {
      if (!event.category || !filters.categories.includes(event.category)) {
        return false
      }
    }

    // Filter by date range
    if (filters.startDate && event.date < filters.startDate) {
      return false
    }
    if (filters.endDate) {
      const endDateWithTime = new Date(filters.endDate)
      endDateWithTime.setHours(23, 59, 59, 999)
      if (event.date > endDateWithTime) {
        return false
      }
    }

    // Filter by search term
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      const searchTerm = filters.searchTerm.toLowerCase()
      return (
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        (event.metadata &&
          Object.values(event.metadata).some(
            (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm),
          ))
      )
    }

    return true
  })
}

// Function to group timeline events by date
export function groupTimelineEventsByDate(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  const grouped: Record<string, TimelineEvent[]> = {}

  events.forEach((event) => {
    const dateKey = event.date.toISOString().split("T")[0]
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(event)
  })

  return grouped
}

// Function to group timeline events by month
export function groupTimelineEventsByMonth(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  const grouped: Record<string, TimelineEvent[]> = {}

  events.forEach((event) => {
    const dateKey = `${event.date.getFullYear()}-${(event.date.getMonth() + 1).toString().padStart(2, "0")}`
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(event)
  })

  return grouped
}

// Function to find related events
export function findRelatedEvents(event: TimelineEvent, allEvents: TimelineEvent[]): TimelineEvent[] {
  if (!event.relatedTo || event.relatedTo.length === 0) {
    return []
  }

  return allEvents.filter((e) => event.relatedTo?.includes(e.id))
}

// Function to analyze symptom changes after medication changes
export function analyzeMedicationEffectOnSymptoms(
  medicationEvent: TimelineEvent,
  allEvents: TimelineEvent[],
  symptomName: string,
  timeWindowDays = 30,
): { before: number; after: number; change: number; effect: "improved" | "worsened" | "unchanged" } {
  if (medicationEvent.type !== "medication_started" && medicationEvent.type !== "medication_stopped") {
    throw new Error("Event must be a medication event")
  }

  const medicationDate = medicationEvent.date.getTime()
  const timeWindowMs = timeWindowDays * 24 * 60 * 60 * 1000

  // Find symptom events before and after medication change
  const symptomEventsBefore = allEvents.filter(
    (e) =>
      e.type === "symptom_report" &&
      e.metadata?.symptomName === symptomName &&
      e.date.getTime() < medicationDate &&
      e.date.getTime() >= medicationDate - timeWindowMs,
  )

  const symptomEventsAfter = allEvents.filter(
    (e) =>
      e.type === "symptom_report" &&
      e.metadata?.symptomName === symptomName &&
      e.date.getTime() > medicationDate &&
      e.date.getTime() <= medicationDate + timeWindowMs,
  )

  // Calculate average severity before and after
  const avgBefore =
    symptomEventsBefore.length > 0
      ? symptomEventsBefore.reduce((sum, e) => sum + (e.severity || 0), 0) / symptomEventsBefore.length
      : 0

  const avgAfter =
    symptomEventsAfter.length > 0
      ? symptomEventsAfter.reduce((sum, e) => sum + (e.severity || 0), 0) / symptomEventsAfter.length
      : 0

  const change = avgAfter - avgBefore
  let effect: "improved" | "worsened" | "unchanged" = "unchanged"

  if (change <= -1) {
    effect = "improved"
  } else if (change >= 1) {
    effect = "worsened"
  }

  return {
    before: avgBefore,
    after: avgAfter,
    change,
    effect,
  }
}
