"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Symptom {
  id: string
  name: string
  present: boolean
  severity?: number
}

interface Diagnosis {
  id: string
  name: string
  diagnosisDate: Date
  status: "confirmed" | "provisional" | "ruled_out"
  notes?: string
}

interface VerificationResult {
  diagnosis: Diagnosis
  confidenceScore: number
  matchedSymptoms: string[]
  missingSymptoms: string[]
  unexplainedSymptoms: string[]
  alternativeDiagnoses?: {
    name: string
    confidenceScore: number
  }[]
  recommendations?: string[]
}

interface DiagnosisVerificationProps {
  patientSymptoms: Symptom[]
  diagnoses: Diagnosis[]
}

export function DiagnosisVerification({ patientSymptoms, diagnoses }: DiagnosisVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([])
  const [activeTab, setActiveTab] = useState<string>("verification")

  // Mock function to verify diagnoses against symptoms
  // In a real application, this would call an API with AI capabilities
  const verifyDiagnoses = async () => {
    setIsVerifying(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock verification results
    const presentSymptoms = patientSymptoms.filter((s) => s.present).map((s) => s.name)

    const mockResults: VerificationResult[] = diagnoses.map((diagnosis) => {
      let confidenceScore = 0
      let matchedSymptoms: string[] = []
      let missingSymptoms: string[] = []
      let unexplainedSymptoms: string[] = []
      const alternativeDiagnoses: { name: string; confidenceScore: number }[] = []
      const recommendations: string[] = []

      // Mock logic for different diagnoses
      if (diagnosis.name === "Hypertension") {
        if (presentSymptoms.includes("Headache") || presentSymptoms.includes("Dizziness")) {
          matchedSymptoms = presentSymptoms.filter((s) => ["Headache", "Dizziness"].includes(s))
          confidenceScore = 0.85
        } else {
          missingSymptoms = ["Headache", "Dizziness"]
          confidenceScore = 0.6
          recommendations.push("Consider blood pressure monitoring")
        }

        unexplainedSymptoms = presentSymptoms.filter((s) => !["Headache", "Dizziness"].includes(s))
      } else if (diagnosis.name === "Type 2 Diabetes") {
        if (presentSymptoms.some((s) => ["Increased thirst", "Frequent urination", "Fatigue"].includes(s))) {
          matchedSymptoms = presentSymptoms.filter((s) =>
            ["Increased thirst", "Frequent urination", "Fatigue"].includes(s),
          )
          confidenceScore = 0.9
        } else {
          missingSymptoms = ["Increased thirst", "Frequent urination", "Fatigue"]
          confidenceScore = 0.5
          recommendations.push("Check blood glucose levels")
        }

        unexplainedSymptoms = presentSymptoms.filter(
          (s) => !["Increased thirst", "Frequent urination", "Fatigue"].includes(s),
        )
      } else if (diagnosis.name === "Migraine") {
        if (presentSymptoms.includes("Headache")) {
          matchedSymptoms = presentSymptoms.filter((s) => ["Headache", "Nausea", "Light sensitivity"].includes(s))
          confidenceScore = 0.75

          if (!presentSymptoms.includes("Nausea") && !presentSymptoms.includes("Light sensitivity")) {
            missingSymptoms = ["Nausea", "Light sensitivity"]
            alternativeDiagnoses.push({ name: "Tension Headache", confidenceScore: 0.65 })
            recommendations.push("Consider headache diary to track triggers")
          }
        } else {
          confidenceScore = 0.2
          missingSymptoms = ["Headache", "Nausea", "Light sensitivity"]
          alternativeDiagnoses.push({ name: "Tension Headache", confidenceScore: 0.4 })
        }

        unexplainedSymptoms = presentSymptoms.filter((s) => !["Headache", "Nausea", "Light sensitivity"].includes(s))
      } else {
        // Generic logic for other diagnoses
        confidenceScore = 0.5
        matchedSymptoms = []
        missingSymptoms = ["Typical symptoms for this condition"]
        unexplainedSymptoms = presentSymptoms
      }

      return {
        diagnosis,
        confidenceScore,
        matchedSymptoms,
        missingSymptoms,
        unexplainedSymptoms,
        alternativeDiagnoses,
        recommendations,
      }
    })

    setVerificationResults(mockResults)
    setIsVerifying(false)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500"
    if (score >= 0.6) return "bg-yellow-500"
    if (score >= 0.4) return "bg-orange-500"
    return "bg-red-500"
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High"
    if (score >= 0.6) return "Moderate"
    if (score >= 0.4) return "Low"
    return "Very Low"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnosis Verification</CardTitle>
        <CardDescription>Verify existing diagnoses against current symptoms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Current Diagnoses</h3>
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((diagnosis) => (
                <Badge key={diagnosis.id} variant={diagnosis.status === "confirmed" ? "default" : "outline"}>
                  {diagnosis.name}
                  {diagnosis.status === "provisional" && " (Provisional)"}
                  {diagnosis.status === "ruled_out" && " (Ruled Out)"}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Current Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {patientSymptoms
                .filter((s) => s.present)
                .map((symptom) => (
                  <Badge key={symptom.id} variant="outline">
                    {symptom.name}
                    {symptom.severity && ` (${symptom.severity}/10)`}
                  </Badge>
                ))}
            </div>
          </div>

          {verificationResults.length === 0 ? (
            <Button
              onClick={verifyDiagnoses}
              disabled={isVerifying || diagnoses.length === 0 || patientSymptoms.filter((s) => s.present).length === 0}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Diagnoses...
                </>
              ) : (
                "Verify Diagnoses Against Symptoms"
              )}
            </Button>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verification">Verification Results</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="verification" className="space-y-4 pt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {verificationResults.map((result) => (
                      <div key={result.diagnosis.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{result.diagnosis.name}</h4>
                          <Badge variant="outline">{getConfidenceLabel(result.confidenceScore)} Confidence</Badge>
                        </div>

                        <Progress
                          value={result.confidenceScore * 100}
                          className={`h-2 ${getConfidenceColor(result.confidenceScore)}`}
                        />

                        <div className="mt-3 space-y-2 text-sm">
                          {result.matchedSymptoms.length > 0 && (
                            <div className="flex items-start gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              <div>
                                <span className="font-medium">Matched symptoms: </span>
                                {result.matchedSymptoms.join(", ")}
                              </div>
                            </div>
                          )}

                          {result.missingSymptoms.length > 0 && (
                            <div className="flex items-start gap-1">
                              <XCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                              <div>
                                <span className="font-medium">Missing typical symptoms: </span>
                                {result.missingSymptoms.join(", ")}
                              </div>
                            </div>
                          )}

                          {result.unexplainedSymptoms.length > 0 && (
                            <div className="flex items-start gap-1">
                              <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5" />
                              <div>
                                <span className="font-medium">Unexplained symptoms: </span>
                                {result.unexplainedSymptoms.join(", ")}
                              </div>
                            </div>
                          )}

                          {result.alternativeDiagnoses && result.alternativeDiagnoses.length > 0 && (
                            <div className="flex items-start gap-1">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                              <div>
                                <span className="font-medium">Alternative diagnoses to consider: </span>
                                {result.alternativeDiagnoses
                                  .map((alt) => `${alt.name} (${Math.round(alt.confidenceScore * 100)}%)`)
                                  .join(", ")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button onClick={() => setVerificationResults([])} variant="outline">
                  Reset Verification
                </Button>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {verificationResults.filter((r) => r.recommendations && r.recommendations.length > 0).length > 0 ? (
                      verificationResults
                        .filter((r) => r.recommendations && r.recommendations.length > 0)
                        .map((result) => (
                          <div key={result.diagnosis.id} className="border rounded-lg p-3">
                            <h4 className="font-medium mb-2">For {result.diagnosis.name}</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {result.recommendations?.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No specific recommendations available.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
