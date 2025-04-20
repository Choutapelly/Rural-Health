import { NextResponse } from "next/server"
import { generateMockMedicalRecords } from "@/utils/medical-records"
import { generateMockPatientData } from "@/utils/chart-data"

export async function GET(request: Request) {
  try {
    // Get patient ID from query params
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    // Generate mock data
    const mockPatients = generateMockPatientData()
    const patientIds = mockPatients.map((p) => p.patientId)
    const patientNames = mockPatients.map((p) => p.patientName)

    const mockMedicalRecords = generateMockMedicalRecords(patientIds, patientNames)

    // Return specific patient record or all records
    if (patientId) {
      const record = mockMedicalRecords[patientId]
      if (!record) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 })
      }
      return NextResponse.json(record)
    }

    return NextResponse.json(mockMedicalRecords)
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
}
