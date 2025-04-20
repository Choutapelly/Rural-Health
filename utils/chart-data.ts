// Utility functions for processing symptom data for charts

export type SymptomEntry = {
  id: string
  symptom: string
  severity: number
  date: Date
  notes?: string
}

export type PatientSymptomData = {
  patientId: string
  patientName: string
  symptoms: {
    [symptomName: string]: SymptomEntry[]
  }
}

export type TimeRange = "7days" | "30days" | "90days" | "6months" | "1year" | "all"

// Process symptom data for line charts
export function processSymptomTrendData(
  data: PatientSymptomData,
  selectedSymptoms: string[],
  timeRange: TimeRange,
): {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
  }[]
} {
  // Get the date range
  const endDate = new Date()
  const startDate = getStartDateFromRange(endDate, timeRange)

  // Get all dates in the range for x-axis
  const dateLabels = generateDateLabels(startDate, endDate)

  // Create datasets for each selected symptom
  const datasets = selectedSymptoms.map((symptomName, index) => {
    const symptomEntries = data.symptoms[symptomName] || []

    // Filter entries by date range
    const filteredEntries = symptomEntries.filter((entry) => entry.date >= startDate && entry.date <= endDate)

    // Sort by date
    const sortedEntries = filteredEntries.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Create data points for each date
    const dataPoints = dateLabels.map((dateLabel) => {
      const date = new Date(dateLabel)
      const matchingEntry = sortedEntries.find((entry) => entry.date.toDateString() === date.toDateString())
      return matchingEntry ? matchingEntry.severity : null
    })

    // Interpolate missing values (null) with the last known value
    let lastValue = null
    const interpolatedData = dataPoints.map((value) => {
      if (value !== null) {
        lastValue = value
        return value
      }
      return lastValue
    })

    // Get color for this dataset
    const color = getChartColor(index)

    return {
      label: symptomName,
      data: interpolatedData,
      borderColor: color,
      backgroundColor: `${color}33`, // Add transparency
      tension: 0.3, // Smooth the line
    }
  })

  return {
    labels: dateLabels.map((d) => new Date(d).toLocaleDateString()),
    datasets,
  }
}

// Process symptom data for heatmap
export function processSymptomHeatmapData(
  data: PatientSymptomData,
  timeRange: TimeRange,
): {
  symptoms: string[]
  dates: string[]
  values: { symptom: string; date: string; severity: number }[]
} {
  const endDate = new Date()
  const startDate = getStartDateFromRange(endDate, timeRange)

  // Get all dates in the range
  const dateLabels = generateDateLabels(startDate, endDate)

  // Get all symptoms
  const symptoms = Object.keys(data.symptoms)

  // Create heatmap data
  const values: { symptom: string; date: string; severity: number }[] = []

  symptoms.forEach((symptom) => {
    const symptomEntries = data.symptoms[symptom] || []

    dateLabels.forEach((dateLabel) => {
      const date = new Date(dateLabel)
      const matchingEntry = symptomEntries.find((entry) => entry.date.toDateString() === date.toDateString())

      if (matchingEntry) {
        values.push({
          symptom,
          date: date.toLocaleDateString(),
          severity: matchingEntry.severity,
        })
      }
    })
  })

  return {
    symptoms,
    dates: dateLabels.map((d) => new Date(d).toLocaleDateString()),
    values,
  }
}

// Process symptom correlation data
export function processSymptomCorrelationData(data: PatientSymptomData): {
  symptoms: string[]
  correlationMatrix: number[][]
} {
  const symptoms = Object.keys(data.symptoms)
  const correlationMatrix: number[][] = []

  // For each pair of symptoms, calculate correlation
  symptoms.forEach((symptomA, i) => {
    correlationMatrix[i] = []

    symptoms.forEach((symptomB, j) => {
      // If same symptom, correlation is 1
      if (i === j) {
        correlationMatrix[i][j] = 1
        return
      }

      const entriesA = data.symptoms[symptomA] || []
      const entriesB = data.symptoms[symptomB] || []

      // If either symptom has no entries, correlation is 0
      if (entriesA.length === 0 || entriesB.length === 0) {
        correlationMatrix[i][j] = 0
        return
      }

      // Calculate correlation based on dates where both symptoms were recorded
      const correlation = calculateCorrelation(entriesA, entriesB)
      correlationMatrix[i][j] = correlation
    })
  })

  return {
    symptoms,
    correlationMatrix,
  }
}

// Helper function to calculate correlation between two symptom sets
function calculateCorrelation(entriesA: SymptomEntry[], entriesB: SymptomEntry[]): number {
  // Create a map of dates to severity for each symptom
  const mapA = new Map<string, number>()
  const mapB = new Map<string, number>()

  entriesA.forEach((entry) => {
    mapA.set(entry.date.toDateString(), entry.severity)
  })

  entriesB.forEach((entry) => {
    mapB.set(entry.date.toDateString(), entry.severity)
  })

  // Find common dates
  const commonDates = [...mapA.keys()].filter((date) => mapB.has(date))

  // If no common dates, return 0
  if (commonDates.length < 3) {
    return 0
  }

  // Extract severity values for common dates
  const valuesA = commonDates.map((date) => mapA.get(date)!)
  const valuesB = commonDates.map((date) => mapB.get(date)!)

  // Calculate Pearson correlation coefficient
  const meanA = valuesA.reduce((sum, val) => sum + val, 0) / valuesA.length
  const meanB = valuesB.reduce((sum, val) => sum + val, 0) / valuesB.length

  let numerator = 0
  let denominatorA = 0
  let denominatorB = 0

  for (let i = 0; i < valuesA.length; i++) {
    const diffA = valuesA[i] - meanA
    const diffB = valuesB[i] - meanB

    numerator += diffA * diffB
    denominatorA += diffA * diffA
    denominatorB += diffB * diffB
  }

  const denominator = Math.sqrt(denominatorA * denominatorB)

  return denominator === 0 ? 0 : numerator / denominator
}

// Helper function to get start date based on time range
function getStartDateFromRange(endDate: Date, timeRange: TimeRange): Date {
  const startDate = new Date(endDate)

  switch (timeRange) {
    case "7days":
      startDate.setDate(startDate.getDate() - 7)
      break
    case "30days":
      startDate.setDate(startDate.getDate() - 30)
      break
    case "90days":
      startDate.setDate(startDate.getDate() - 90)
      break
    case "6months":
      startDate.setMonth(startDate.getMonth() - 6)
      break
    case "1year":
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    case "all":
      // Set to a very old date to include all data
      startDate.setFullYear(startDate.getFullYear() - 10)
      break
  }

  return startDate
}

// Helper function to generate array of date strings between start and end dates
function generateDateLabels(startDate: Date, endDate: Date): string[] {
  const dates: string[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString())
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

// Helper function to get chart colors
function getChartColor(index: number): string {
  const colors = [
    "#f43f5e", // rose-500
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
    "#6366f1", // indigo-500
    "#14b8a6", // teal-500
  ]

  return colors[index % colors.length]
}

// Generate mock patient symptom data for testing
export function generateMockPatientData(): PatientSymptomData[] {
  const patients = [
    {
      patientId: "p1",
      patientName: "Maria Gonzalez",
      symptoms: {
        Headache: generateSymptomEntries("Headache", 90, [3, 7], 0.7),
        Fatigue: generateSymptomEntries("Fatigue", 90, [2, 6], 0.5),
        "Chest Pain": generateSymptomEntries("Chest Pain", 90, [1, 5], 0.3),
      },
    },
    {
      patientId: "p2",
      patientName: "John Smith",
      symptoms: {
        "Joint Pain": generateSymptomEntries("Joint Pain", 90, [4, 8], 0.6),
        "Shortness of Breath": generateSymptomEntries("Shortness of Breath", 90, [2, 7], 0.4),
        Cough: generateSymptomEntries("Cough", 90, [3, 6], 0.8),
      },
    },
    {
      patientId: "p3",
      patientName: "Raj Patel",
      symptoms: {
        Fever: generateSymptomEntries("Fever", 90, [2, 9], 0.5),
        Cough: generateSymptomEntries("Cough", 90, [3, 7], 0.7),
        Fatigue: generateSymptomEntries("Fatigue", 90, [4, 8], 0.6),
      },
    },
  ]

  return patients
}

// Helper function to generate random symptom entries
function generateSymptomEntries(
  symptom: string,
  days: number,
  severityRange: [number, number],
  frequency: number,
): SymptomEntry[] {
  const entries: SymptomEntry[] = []
  const endDate = new Date()

  for (let i = 0; i < days; i++) {
    // Only create entry based on frequency (0-1)
    if (Math.random() > frequency) continue

    const date = new Date()
    date.setDate(date.getDate() - i)

    const min = severityRange[0]
    const max = severityRange[1]
    const severity = Math.floor(Math.random() * (max - min + 1)) + min

    entries.push({
      id: `${symptom}-${i}`,
      symptom,
      severity,
      date,
      notes: `${symptom} with severity ${severity}`,
    })
  }

  return entries
}
