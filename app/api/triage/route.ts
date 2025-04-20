import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const {
      symptoms,
      duration,
      severity,
      medicalHistory,
      age,
      gender,
      vitalSigns,
      locationOnBody,
      previousConditions,
      medications,
      allergies,
      riskFactors,
      followUpResponses,
    } = await req.json()

    // Combine the patient information for the AI to analyze
    const patientInfo = `
      Symptoms: ${symptoms}
      Duration: ${duration}
      Severity: ${severity}
      Age: ${age || "Not provided"}
      Gender: ${gender || "Not provided"}
      Location on Body: ${locationOnBody || "Not specified"}
      Vital Signs: ${vitalSigns ? JSON.stringify(vitalSigns) : "Not provided"}
      Medical History: ${medicalHistory || "None provided"}
      Previous Conditions: ${previousConditions || "None provided"}
      Current Medications: ${medications || "None provided"}
      Allergies: ${allergies || "None provided"}
      Risk Factors: ${riskFactors || "None provided"}
      Follow-up Responses: ${followUpResponses ? JSON.stringify(followUpResponses) : "None provided"}
    `

    // Use AI to determine urgency and recommended specialty with more advanced analysis
    const { text: aiResponse } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI medical triage assistant with expertise in symptom analysis and medical diagnostics. 
        Based on the following patient information, perform a comprehensive analysis and provide:
        
        1. Urgency assessment (high, medium, or low)
        2. Recommended medical specialty for consultation
        3. Potential medical conditions that match the symptoms (list up to 3)
        4. Key risk factors identified
        5. Follow-up questions to improve diagnosis (list 3-5 specific questions)
        6. Recommended immediate actions for the patient
        7. Detailed reasoning for your assessment
        
        Patient information:
        ${patientInfo}
        
        Return your analysis in JSON format with the following structure:
        {
          "urgency": "high|medium|low",
          "specialty": "string",
          "potentialConditions": ["condition1", "condition2", "condition3"],
          "riskFactors": ["factor1", "factor2"],
          "followUpQuestions": ["question1", "question2", "question3"],
          "immediateActions": ["action1", "action2"],
          "reasoning": "string"
        }
        
        Ensure your assessment is medically sound and errs on the side of caution when uncertain.
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
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process triage request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
