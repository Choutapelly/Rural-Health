// Types and utilities for timeline data

export interface TimelineEvent {
  id: string
  type:
    | "symptom_report"
    | "condition_diagnosis"
    | "medication_started"
    | "medication_stopped"
    | "medication_changed"
    | "lab_result"
    | "vital_sign"
    | "appointment"
    | "note"
  category: "symptom" | "condition" | "medication" | "lab" | "vital" | "note"
  title: string
  description: string
  date: Date
  severity?: number
  status?: string
  metadata?: Record<string, any>
}

interface TimelineFilter {
  categories?: string[]
  startDate?: Date
  endDate?: Date
  searchTerm?: string
}

// Filter timeline events based on criteria
export function filterTimelineEvents(events: TimelineEvent[], filter: TimelineFilter): TimelineEvent[] {
  return events.filter((event) => {
    // Filter by category
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(event.category)) {
        return false
      }
    }

    // Filter by date range
    if (filter.startDate && event.date < filter.startDate) {
      return false
    }

    if (filter.endDate) {
      const endDateWithTime = new Date(filter.endDate)
      endDateWithTime.setHours(23, 59, 59, 999)
      if (event.date > endDateWithTime) {
        return false
      }
    }

    // Filter by search term
    if (filter.searchTerm && filter.searchTerm.trim() !== "") {
      const searchLower = filter.searchTerm.toLowerCase()
      const titleMatch = event.title.toLowerCase().includes(searchLower)
      const descMatch = event.description.toLowerCase().includes(searchLower)
      const metadataMatch = event.metadata
        ? Object.values(event.metadata).some(
            (value) => typeof value === "string" && value.toLowerCase().includes(searchLower),
          )
        : false

      if (!titleMatch && !descMatch && !metadataMatch) {
        return false
      }
    }

    return true
  })
}

// Group timeline events by date (YYYY-MM-DD)
export function groupTimelineEventsByDate(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  const grouped: Record<string, TimelineEvent[]> = {}

  events.forEach((event) => {
    const dateKey = event.date.toISOString().split("T")[0]

    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }

    grouped[dateKey].push(event)
  })

  // Sort events within each day by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  return grouped
}

// Group timeline events by month (YYYY-MM)
export function groupTimelineEventsByMonth(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  const grouped: Record<string, TimelineEvent[]> = {}

  events.forEach((event) => {
    const date = event.date
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!grouped[monthKey]) {
      grouped[monthKey] = []
    }

    grouped[monthKey].push(event)
  })

  // Sort events within each month by date
  Object.keys(grouped).forEach((month) => {
    grouped[month].sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  return grouped
}

// Find related events for a given event
export function findRelatedEvents(event: TimelineEvent, allEvents: TimelineEvent[]): TimelineEvent[] {
  const relatedEvents: TimelineEvent[] = []

  // Different logic based on event type
  switch (event.type) {
    case "symptom_report":
      // Find condition diagnoses that might be related to this symptom
      if (event.metadata?.symptomName) {
        const symptomName = event.metadata.symptomName as string

        // Find conditions that might be related to this symptom
        allEvents
          .filter((e) => e.type === "condition_diagnosis")
          .forEach((conditionEvent) => {
            // Simple logic: if the condition description mentions the symptom, consider it related
            if (
              conditionEvent.description.toLowerCase().includes(symptomName.toLowerCase()) ||
              (conditionEvent.metadata?.conditionName as string)?.toLowerCase().includes(symptomName.toLowerCase())
            ) {
              relatedEvents.push(conditionEvent)
            }
          })

        // Find medications that might be treating this symptom
        allEvents
          .filter((e) => e.type === "medication_started" || e.type === "medication_changed")
          .forEach((medEvent) => {
            // If the medication is for a condition that's related to this symptom
            const forCondition = medEvent.metadata?.forCondition as string
            if (
              forCondition &&
              relatedEvents.some(
                (re) => re.type === "condition_diagnosis" && (re.metadata?.conditionName as string) === forCondition,
              )
            ) {
              relatedEvents.push(medEvent)
            }
          })
      }
      break

    case "condition_diagnosis":
      // Find symptoms that might be related to this condition
      if (event.metadata?.conditionName) {
        const conditionName = event.metadata.conditionName as string

        // Find symptoms that might be related to this condition
        allEvents
          .filter((e) => e.type === "symptom_report")
          .forEach((symptomEvent) => {
            // Simple logic: if the symptom is commonly associated with the condition
            const symptomName = symptomEvent.metadata?.symptomName as string

            // Very basic associations (in a real app, this would use a medical knowledge base)
            const commonAssociations: Record<string, string[]> = {
              Hypertension: ["Headache", "Dizziness", "Chest Pain"],
              "Type 2 Diabetes": ["Fatigue", "Increased Thirst", "Frequent Urination"],
              Asthma: ["Shortness of Breath", "Cough", "Wheezing"],
              Migraine: ["Headache", "Nausea", "Light Sensitivity"],
              Osteoarthritis: ["Joint Pain", "Stiffness", "Swelling"],
              "Gastroesophageal Reflux Disease": ["Heartburn", "Chest Pain", "Regurgitation"],
            }

            if (
              commonAssociations[conditionName]?.includes(symptomName) ||
              symptomEvent.date >= event.date // Symptoms after diagnosis might be related
            ) {
              relatedEvents.push(symptomEvent)
            }
          })

        // Find medications prescribed for this condition
        allEvents
          .filter((e) => e.type === "medication_started" || e.type === "medication_changed")
          .forEach((medEvent) => {
            if (medEvent.metadata?.forCondition === conditionName) {
              relatedEvents.push(medEvent)
            }
          })

        // Find lab results that might be related to this condition
        allEvents
          .filter((e) => e.type === "lab_result")
          .forEach((labEvent) => {
            // Simple logic: if the lab result is after the diagnosis, it might be related
            if (labEvent.date >= event.date) {
              // Additional condition-specific logic
              if (
                (conditionName === "Type 2 Diabetes" &&
                  (labEvent.title.includes("Glucose") || labEvent.title.includes("HbA1c"))) ||
                (conditionName === "Hypertension" && labEvent.metadata?.labName === "Lipid Panel")
              ) {
                relatedEvents.push(labEvent)
              }
            }
          })
      }
      break

    case "medication_started":
    case "medication_stopped":
    case "medication_changed":
      // Find the condition this medication is for
      if (event.metadata?.forCondition) {
        const forCondition = event.metadata.forCondition as string

        // Find the condition diagnosis
        allEvents
          .filter((e) => e.type === "condition_diagnosis" && (e.metadata?.conditionName as string) === forCondition)
          .forEach((conditionEvent) => {
            relatedEvents.push(conditionEvent)
          })

        // Find symptoms that improved or worsened after medication change
        if (event.type === "medication_started" || event.type === "medication_changed") {
          const medicationDate = event.date

          // Find symptoms reported after starting the medication
          allEvents
            .filter((e) => e.type === "symptom_report" && e.date > medicationDate)
            .forEach((symptomEvent) => {
              // Find the same symptom before medication to compare
              const symptomName = symptomEvent.metadata?.symptomName as string
              const previousSymptomEvents = allEvents.filter(
                (e) =>
                  e.type === "symptom_report" && e.metadata?.symptomName === symptomName && e.date < medicationDate,
              )

              if (previousSymptomEvents.length > 0) {
                // Sort by date (newest first)
                previousSymptomEvents.sort((a, b) => b.date.getTime() - a.date.getTime())
                const previousSymptom = previousSymptomEvents[0]

                // Compare severity
                const previousSeverity = previousSymptom.severity || 0
                const currentSeverity = symptomEvent.severity || 0

                // If there's a significant change, consider it related
                if (Math.abs(currentSeverity - previousSeverity) >= 2) {
                  relatedEvents.push(symptomEvent)
                }
              }
            })
        }
      }
      break

    case "lab_result":
      // Find conditions that might be related to this lab result
      const labName = event.metadata?.labName as string

      if (labName) {
        // Find conditions that might be monitored by this lab test
        allEvents
          .filter((e) => e.type === "condition_diagnosis")
          .forEach((conditionEvent) => {
            const conditionName = conditionEvent.metadata?.conditionName as string

            // Simple associations
            if ((labName.includes("Glucose") || labName.includes("HbA1c")) && conditionName === "Type 2 Diabetes") {
              relatedEvents.push(conditionEvent)
            } else if (labName === "Lipid Panel" && conditionName === "Hypertension") {
              relatedEvents.push(conditionEvent)
            }
          })
      }
      break

    default:
      // For other event types, find events of the same category within a time window
      const eventDate = event.date
      const timeWindow = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

      allEvents
        .filter(
          (e) =>
            e.category === event.category &&
            e.id !== event.id &&
            Math.abs(e.date.getTime() - eventDate.getTime()) <= timeWindow,
        )
        .forEach((relatedEvent) => {
          relatedEvents.push(relatedEvent)
        })
      break
  }

  // Sort related events by date (newest first)
  relatedEvents.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Limit to 10 most relevant events
  return relatedEvents.slice(0, 10)
}

export function generatePatientTimeline(patientData: any, medicalRecord: any): TimelineEvent[] {
  const timelineEvents: TimelineEvent[] = []

  // Add symptom events
  Object.keys(patientData.symptoms).forEach((symptomName) => {
    patientData.symptoms[symptomName].forEach((symptom) => {
      timelineEvents.push({
        id: `symptom-${symptom.id}`,
        type: "symptom_report",
        category: "symptom",
        title: `Reported ${symptomName}`,
        description: `Severity: ${symptom.severity}/10`,
        date: symptom.date,
        severity: symptom.severity,
        metadata: {
          symptomName: symptomName,
          severity: symptom.severity,
          notes: symptom.notes,
        },
      })
    })
  })

  if (medicalRecord) {
    // Add condition events
    medicalRecord.conditions.forEach((condition) => {
      timelineEvents.push({
        id: `condition-${condition.id}`,
        type: "condition_diagnosis",
        category: "condition",
        title: `Diagnosed with ${condition.name}`,
        description: condition.notes || `Diagnosed with ${condition.name}`,
        date: condition.diagnosisDate,
        status: condition.status,
        metadata: {
          conditionName: condition.name,
          notes: condition.notes,
        },
      })
    })

    // Add medication events
    medicalRecord.medications.forEach((medication) => {
      timelineEvents.push({
        id: `medication-start-${medication.id}`,
        type: "medication_started",
        category: "medication",
        title: `Started ${medication.name}`,
        description: `${medication.dosage}, ${medication.frequency}`,
        date: medication.startDate,
        status: medication.status,
        metadata: {
          medicationName: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          forCondition: medication.forCondition,
          notes: medication.notes,
        },
      })

      if (medication.endDate) {
        timelineEvents.push({
          id: `medication-end-${medication.id}`,
          type: "medication_stopped",
          category: "medication",
          title: `Stopped ${medication.name}`,
          description: `Stopped ${medication.name} on ${medication.endDate.toLocaleDateString()}`,
          date: medication.endDate,
          status: "discontinued",
          metadata: {
            medicationName: medication.name,
            reason: "Course completed",
            notes: medication.notes,
          },
        })
      }
    })

    // Add lab result events
    medicalRecord.labResults.forEach((lab) => {
      timelineEvents.push({
        id: `lab-${lab.id}`,
        type: "lab_result",
        category: "lab",
        title: `${lab.name} Result`,
        description: `${lab.value} ${lab.unit} (Reference: ${lab.referenceRange})`,
        date: lab.date,
        status: lab.abnormal ? "abnormal" : "normal",
        metadata: {
          labName: lab.name,
          value: lab.value,
          unit: lab.unit,
          referenceRange: lab.referenceRange,
          notes: lab.notes,
        },
      })
    })

    // Add vital sign events
    medicalRecord.vitalSigns.forEach((vital) => {
      timelineEvents.push({
        id: `vital-${vital.id}`,
        type: "vital_sign",
        category: "vital",
        title: `${vital.type.replace("_", " ")}`,
        description: `${vital.value} ${vital.unit}`,
        date: vital.date,
        status: "recorded",
        metadata: {
          vitalType: vital.type,
          value: vital.value,
          unit: vital.unit,
          notes: vital.notes,
        },
      })
    })

    // Add note events
    medicalRecord.notes.forEach((note) => {
      timelineEvents.push({
        id: `note-${note.id}`,
        type: "note",
        category: "note",
        title: "Clinical Note",
        description: note.content,
        date: note.date,
        status: "documented",
        metadata: {
          provider: note.provider,
          tags: note.tags,
        },
      })
    })
  }

  return timelineEvents
}

export function analyzeMedicationEffectOnSymptoms(
  medicationEvent: TimelineEvent,
  allEvents: TimelineEvent[],
  selectedSymptom: string,
  timeWindow: number,
): {
  effect: "improved" | "worsened" | "no_change"
  before: number
  after: number
  change: number
} {
  if (medicationEvent.type !== "medication_started" && medicationEvent.type !== "medication_stopped") {
    throw new Error("Invalid event type. Expected medication_started or medication_stopped.")
  }

  const medicationDate = medicationEvent.date.getTime()
  const symptomEventsBefore = allEvents.filter(
    (e) =>
      e.type === "symptom_report" &&
      e.metadata?.symptomName === selectedSymptom &&
      e.date.getTime() < medicationDate &&
      medicationDate - e.date.getTime() <= timeWindow * 24 * 60 * 60 * 1000,
  )

  const symptomEventsAfter = allEvents.filter(
    (e) =>
      e.type === "symptom_report" &&
      e.metadata?.symptomName === selectedSymptom &&
      e.date.getTime() > medicationDate &&
      e.date.getTime() - medicationDate <= timeWindow * 24 * 60 * 60 * 1000,
  )

  if (symptomEventsBefore.length === 0 || symptomEventsAfter.length === 0) {
    return {
      effect: "no_change",
      before: 0,
      after: 0,
      change: 0,
    }
  }

  const avgSeverityBefore =
    symptomEventsBefore.reduce((sum, event) => sum + (event.severity || 0), 0) / symptomEventsBefore.length
  const avgSeverityAfter =
    symptomEventsAfter.reduce((sum, event) => sum + (event.severity || 0), 0) / symptomEventsAfter.length

  const change = avgSeverityAfter - avgSeverityBefore

  let effect: "improved" | "worsened" | "no_change" = "no_change"
  if (change < -1) {
    effect = "improved"
  } else if (change > 1) {
    effect = "worsened"
  }

  return {
    effect,
    before: avgSeverityBefore,
    after: avgSeverityAfter,
    change,
  }
}
