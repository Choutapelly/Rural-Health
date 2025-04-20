import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { symptoms, duration, severity, medicalHistory } = await req.json()

    // Combine the patient information for the AI to analyze
    const patientInfo = `
      Symptoms: ${symptoms}
      Duration: ${duration}
      Severity: ${severity}
      Medical History: ${medicalHistory || "None provided"}
    `

    // Use AI to determine urgency and recommended specialty
    const { text: aiResponse } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI medical triage assistant. Based on the following patient information, 
        please assess the urgency level (high, medium, or low) and recommend an appropriate 
        medical specialty for consultation. Provide your assessment in JSON format with the 
        following fields: urgency, specialty, reasoning.
        
        Patient information:
        ${patientInfo}
        
        Return only valid JSON without any additional text.
      `,
    })

    // Parse the AI response
    const triageResult = JSON.parse(aiResponse)

    return NextResponse.json({
      success: true,
      triage: triageResult,
    })
  } catch (error) {
    console.error("Triage API error:", error)
    return NextResponse.json({ success: false, error: "Failed to process triage request" }, { status: 500 })
  }
}
