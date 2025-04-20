// Types and utilities for medical records

export type MedicalCondition = {
  id: string
  name: string
  diagnosisDate: Date
  status: "active" | "resolved" | "managed"
  notes?: string
}

export type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: Date
  endDate?: Date
  forCondition?: string
  status: "active" | "discontinued" | "completed"
  notes?: string
}

export type Allergy = {
  id: string
  allergen: string
  reaction: string
  severity: "mild" | "moderate" | "severe"
  diagnosedDate?: Date
}

export type VitalSign = {
  id: string
  type: "blood_pressure" | "heart_rate" | "temperature" | "respiratory_rate" | "oxygen_saturation" | "weight" | "height"
  value: string
  unit: string
  date: Date
  notes?: string
}

export type LabResult = {
  id: string
  name: string
  value: string
  unit: string
  referenceRange?: string
  date: Date
  abnormal: boolean
  notes?: string
}

export type PatientMedicalRecord = {
  patientId: string
  patientName: string
  dateOfBirth: Date
  gender: string
  bloodType?: string
  conditions: MedicalCondition[]
  medications: Medication[]
  allergies: Allergy[]
  vitalSigns: VitalSign[]
  labResults: LabResult[]
  notes: {
    id: string
    date: Date
    provider: string
    content: string
    tags?: string[]
  }[]
}

// Generate mock medical records for testing
export function generateMockMedicalRecords(
  patientIds: string[],
  patientNames: string[],
): Record<string, PatientMedicalRecord> {
  const records: Record<string, PatientMedicalRecord> = {}

  patientIds.forEach((patientId, index) => {
    const patientName = patientNames[index]

    // Generate a random date of birth (25-75 years old)
    const now = new Date()
    const age = Math.floor(Math.random() * 50) + 25
    const dob = new Date(now.getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

    // Generate random conditions based on patient ID
    const conditions: MedicalCondition[] = []
    if (patientId === "p1") {
      conditions.push(
        {
          id: "c1",
          name: "Hypertension",
          diagnosisDate: new Date(now.getFullYear() - 3, 5, 12),
          status: "managed",
          notes: "Well controlled with medication",
        },
        {
          id: "c2",
          name: "Migraine",
          diagnosisDate: new Date(now.getFullYear() - 5, 2, 8),
          status: "active",
          notes: "Triggered by stress and certain foods",
        },
      )
    } else if (patientId === "p2") {
      conditions.push(
        {
          id: "c3",
          name: "Type 2 Diabetes",
          diagnosisDate: new Date(now.getFullYear() - 7, 8, 23),
          status: "active",
          notes: "Monitoring blood glucose levels",
        },
        {
          id: "c4",
          name: "Osteoarthritis",
          diagnosisDate: new Date(now.getFullYear() - 4, 11, 5),
          status: "active",
          notes: "Affecting knees and hips",
        },
      )
    } else if (patientId === "p3") {
      conditions.push(
        {
          id: "c5",
          name: "Asthma",
          diagnosisDate: new Date(now.getFullYear() - 15, 3, 17),
          status: "managed",
          notes: "Seasonal exacerbations",
        },
        {
          id: "c6",
          name: "Gastroesophageal Reflux Disease",
          diagnosisDate: new Date(now.getFullYear() - 2, 7, 9),
          status: "active",
          notes: "Dietary modifications recommended",
        },
      )
    }

    // Generate medications based on conditions
    const medications: Medication[] = []
    conditions.forEach((condition) => {
      if (condition.name === "Hypertension") {
        medications.push({
          id: `m${medications.length + 1}`,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          startDate: new Date(condition.diagnosisDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days after diagnosis
          forCondition: condition.name,
          status: "active",
          notes: "Take in the morning",
        })
      } else if (condition.name === "Migraine") {
        medications.push({
          id: `m${medications.length + 1}`,
          name: "Sumatriptan",
          dosage: "50mg",
          frequency: "As needed for migraine attacks",
          startDate: new Date(condition.diagnosisDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days after diagnosis
          forCondition: condition.name,
          status: "active",
          notes: "Maximum 2 tablets in 24 hours",
        })
      } else if (condition.name === "Type 2 Diabetes") {
        medications.push({
          id: `m${medications.length + 1}`,
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily with meals",
          startDate: new Date(condition.diagnosisDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days after diagnosis
          forCondition: condition.name,
          status: "active",
          notes: "Take with food to minimize GI side effects",
        })
      } else if (condition.name === "Asthma") {
        medications.push({
          id: `m${medications.length + 1}`,
          name: "Albuterol Inhaler",
          dosage: "2 puffs",
          frequency: "As needed for shortness of breath",
          startDate: new Date(condition.diagnosisDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day after diagnosis
          forCondition: condition.name,
          status: "active",
          notes: "Use spacer for better delivery",
        })
      }
    })

    // Generate allergies
    const allergies: Allergy[] = []
    if (patientId === "p1") {
      allergies.push({
        id: "a1",
        allergen: "Penicillin",
        reaction: "Rash",
        severity: "moderate",
        diagnosedDate: new Date(now.getFullYear() - 10, 4, 15),
      })
    } else if (patientId === "p2") {
      allergies.push({
        id: "a2",
        allergen: "Shellfish",
        reaction: "Anaphylaxis",
        severity: "severe",
        diagnosedDate: new Date(now.getFullYear() - 8, 7, 22),
      })
    }

    // Generate vital signs
    const vitalSigns: VitalSign[] = []
    // Add blood pressure readings
    for (let i = 0; i < 5; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i * 30) // One reading per month

      let systolic = 120
      let diastolic = 80

      // Adjust based on conditions
      if (conditions.some((c) => c.name === "Hypertension")) {
        systolic += Math.floor(Math.random() * 30)
        diastolic += Math.floor(Math.random() * 15)
      }

      vitalSigns.push({
        id: `v${vitalSigns.length + 1}`,
        type: "blood_pressure",
        value: `${systolic}/${diastolic}`,
        unit: "mmHg",
        date: date,
        notes: i === 0 ? "Most recent reading" : undefined,
      })
    }

    // Add heart rate readings
    for (let i = 0; i < 3; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i * 30) // One reading per month

      const heartRate = 70 + Math.floor(Math.random() * 20)

      vitalSigns.push({
        id: `v${vitalSigns.length + 1}`,
        type: "heart_rate",
        value: heartRate.toString(),
        unit: "bpm",
        date: date,
      })
    }

    // Generate lab results
    const labResults: LabResult[] = []
    if (conditions.some((c) => c.name === "Type 2 Diabetes")) {
      // Add HbA1c results
      for (let i = 0; i < 3; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i * 90) // One reading every 3 months

        const value = (6.5 + Math.random()).toFixed(1)
        const abnormal = Number.parseFloat(value) > 6.5

        labResults.push({
          id: `l${labResults.length + 1}`,
          name: "HbA1c",
          value: value,
          unit: "%",
          referenceRange: "4.0-5.6",
          date: date,
          abnormal: abnormal,
          notes: abnormal ? "Above target range" : "Within target range",
        })
      }

      // Add fasting glucose results
      for (let i = 0; i < 4; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i * 30) // One reading per month

        const value = (110 + Math.random() * 40).toFixed(0)
        const abnormal = Number.parseInt(value) > 100

        labResults.push({
          id: `l${labResults.length + 1}`,
          name: "Fasting Glucose",
          value: value,
          unit: "mg/dL",
          referenceRange: "70-100",
          date: date,
          abnormal: abnormal,
        })
      }
    }

    if (conditions.some((c) => c.name === "Hypertension")) {
      // Add lipid panel
      const date = new Date()
      date.setDate(date.getDate() - 60) // 2 months ago

      labResults.push({
        id: `l${labResults.length + 1}`,
        name: "Total Cholesterol",
        value: "210",
        unit: "mg/dL",
        referenceRange: "<200",
        date: date,
        abnormal: true,
      })

      labResults.push({
        id: `l${labResults.length + 1}`,
        name: "LDL Cholesterol",
        value: "130",
        unit: "mg/dL",
        referenceRange: "<100",
        date: date,
        abnormal: true,
      })

      labResults.push({
        id: `l${labResults.length + 1}`,
        name: "HDL Cholesterol",
        value: "45",
        unit: "mg/dL",
        referenceRange: ">40",
        date: date,
        abnormal: false,
      })
    }

    // Generate clinical notes
    const notes = []
    const noteCount = Math.floor(Math.random() * 3) + 2 // 2-4 notes

    for (let i = 0; i < noteCount; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i * 45) // One note every 45 days

      let content = ""
      let tags: string[] = []

      if (i === 0) {
        content = `Patient ${patientName} presents for follow-up of ${conditions.map((c) => c.name).join(", ")}. `
        content += `Current medications include ${medications.map((m) => m.name).join(", ")}. `
        content += "Patient reports overall stable condition with occasional symptom flares. "
        content += "Will continue current treatment plan and follow up in 3 months."

        tags = ["follow-up", ...conditions.map((c) => c.name.toLowerCase().replace(/\s+/g, "-"))]
      } else {
        content = `Routine check-up for ${patientName}. Vital signs stable. `
        content += "Patient reports compliance with medication regimen. "
        content += "No new complaints or concerns at this time. "
        content += "Continue current management and return for follow-up as scheduled."

        tags = ["check-up", "routine"]
      }

      notes.push({
        id: `n${i + 1}`,
        date: date,
        provider: "Dr. Sarah Johnson",
        content: content,
        tags: tags,
      })
    }

    // Create the complete medical record
    records[patientId] = {
      patientId,
      patientName,
      dateOfBirth: dob,
      gender: Math.random() > 0.5 ? "Female" : "Male",
      bloodType: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][Math.floor(Math.random() * 8)],
      conditions,
      medications,
      allergies,
      vitalSigns,
      labResults,
      notes,
    }
  })

  return records
}

// Function to calculate age from date of birth
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDifference = today.getMonth() - dateOfBirth.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--
  }

  return age
}

// Function to find correlations between medical conditions and symptoms
export function findConditionSymptomCorrelations(
  medicalRecord: PatientMedicalRecord,
  symptomData: Record<string, any[]>,
): { condition: string; relatedSymptoms: string[]; confidence: number }[] {
  const correlations: { condition: string; relatedSymptoms: string[]; confidence: number }[] = []

  // For each medical condition
  medicalRecord.conditions.forEach((condition) => {
    const relatedSymptoms: string[] = []
    let confidence = 0

    // Check each symptom for potential correlation
    Object.keys(symptomData).forEach((symptom) => {
      // Simple correlation logic - can be enhanced with more sophisticated algorithms
      // For now, we'll use some common associations

      if (
        (condition.name === "Hypertension" && ["Headache", "Dizziness", "Chest Pain"].includes(symptom)) ||
        (condition.name === "Type 2 Diabetes" &&
          ["Fatigue", "Increased Thirst", "Frequent Urination"].includes(symptom)) ||
        (condition.name === "Asthma" && ["Shortness of Breath", "Cough", "Wheezing"].includes(symptom)) ||
        (condition.name === "Migraine" && ["Headache", "Nausea", "Light Sensitivity"].includes(symptom)) ||
        (condition.name === "Osteoarthritis" && ["Joint Pain", "Stiffness", "Swelling"].includes(symptom)) ||
        (condition.name === "Gastroesophageal Reflux Disease" &&
          ["Heartburn", "Chest Pain", "Regurgitation"].includes(symptom))
      ) {
        relatedSymptoms.push(symptom)
        confidence = 0.8 // High confidence for known associations
      } else {
        // Check temporal correlation - symptoms that appear after diagnosis
        const diagnosisTime = condition.diagnosisDate.getTime()
        const symptomEntries = symptomData[symptom]

        if (symptomEntries && symptomEntries.length > 0) {
          // Check if majority of symptom entries are after diagnosis
          const entriesAfterDiagnosis = symptomEntries.filter((entry) => new Date(entry.date).getTime() > diagnosisTime)

          if (entriesAfterDiagnosis.length > symptomEntries.length * 0.7) {
            relatedSymptoms.push(symptom)
            confidence = 0.6 // Medium confidence for temporal correlation
          }
        }
      }
    })

    if (relatedSymptoms.length > 0) {
      correlations.push({
        condition: condition.name,
        relatedSymptoms,
        confidence,
      })
    }
  })

  return correlations
}

// Function to analyze medication effects on symptoms
export function analyzeMedicationEffects(
  medications: Medication[],
  symptomData: Record<string, any[]>,
): { medication: string; affectedSymptoms: { symptom: string; effect: "improved" | "worsened" | "no change" }[] }[] {
  const effects: {
    medication: string
    affectedSymptoms: { symptom: string; effect: "improved" | "worsened" | "no change" }[]
  }[] = []

  medications.forEach((medication) => {
    const affectedSymptoms: { symptom: string; effect: "improved" | "worsened" | "no change" }[] = []
    const medicationStartTime = medication.startDate.getTime()

    // For each symptom, check if there's a change after medication started
    Object.entries(symptomData).forEach(([symptom, entries]) => {
      if (entries.length < 2) return // Need at least 2 entries to detect a change

      // Split entries into before and after medication
      const entriesBefore = entries.filter((entry) => new Date(entry.date).getTime() < medicationStartTime)

      const entriesAfter = entries.filter((entry) => new Date(entry.date).getTime() >= medicationStartTime)

      if (entriesBefore.length > 0 && entriesAfter.length > 0) {
        // Calculate average severity before and after
        const avgBefore = entriesBefore.reduce((sum, entry) => sum + entry.severity, 0) / entriesBefore.length
        const avgAfter = entriesAfter.reduce((sum, entry) => sum + entry.severity, 0) / entriesAfter.length

        // Determine effect
        let effect: "improved" | "worsened" | "no change" = "no change"

        if (avgAfter < avgBefore - 1) {
          effect = "improved" // Severity decreased by more than 1 point
        } else if (avgAfter > avgBefore + 1) {
          effect = "worsened" // Severity increased by more than 1 point
        }

        affectedSymptoms.push({ symptom, effect })
      }
    })

    if (affectedSymptoms.length > 0) {
      effects.push({
        medication: medication.name,
        affectedSymptoms,
      })
    }
  })

  return effects
}
