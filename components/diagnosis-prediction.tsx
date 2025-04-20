"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface Symptom {
  id: string
  name: string
  present: boolean
  severity?: number
  startDate?: Date
  endDate?: Date
}

interface SymptomPattern {
  id: string
  symptoms: string[]
  frequency: "daily" | "weekly" | "monthly" | "sporadic"
  duration: string
  triggers?: string[]
}

interface PredictionResult {
  diagnosisName: string
  probability: number
  matchedPatterns: {
    patternDescription: string
    confidence: number
  }[]
  suggestedTests: string[]
  suggestedSpecialties: string[]
}

interface DiagnosisPredictionProps {
  patientSymptoms: Symptom[]
  symptomPatterns: SymptomPattern[]
}

export function DiagnosisPrediction({ patientSymptoms, symptomPatterns }: DiagnosisPredictionProps) {
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionResults, setPredictionResults] = useState<PredictionResult[]>([])
  const [activeTab, setActiveTab] = useState<string>("predictions")

  // Mock function to predict diagnoses based on symptom patterns
  // In a real application, this would call an API with AI capabilities
  const predictDiagnoses = async () => {
    setIsPredicting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock prediction results
    const presentSymptoms = patientSymptoms.filter((s) => s.present).map((s) => s.name)

    const mockResults: PredictionResult[] = []

    // Check for migraine pattern
    if (
      presentSymptoms.includes("Headache") &&
      (presentSymptoms.includes("Nausea") || presentSymptoms.includes("Light sensitivity"))
    ) {
      mockResults.push({
        diagnosisName: "Migraine",
        probability: 0.85,
        matchedPatterns: [
          {
            patternDescription: "Recurring headaches with nausea or light sensitivity",
            confidence: 0.9,
          },
          {
            patternDescription: "Symptoms worsen with physical activity",
            confidence: 0.7,
          },
        ],
        suggestedTests: ["Neurological examination", "MRI (to rule out other causes)"],
        suggestedSpecialties: ["Neurology"],
      })
    }

    // Check for GERD pattern
    if (
      presentSymptoms.includes("Heartburn") ||
      (presentSymptoms.includes("Chest pain") && presentSymptoms.includes("Regurgitation"))
    ) {
      mockResults.push({
        diagnosisName: "Gastroesophageal Reflux Disease (GERD)",
        probability: 0.78,
        matchedPatterns: [
          {
            patternDescription: "Heartburn and regurgitation after meals",
            confidence: 0.85,
          },
          {
            patternDescription: "Symptoms worsen when lying down",
            confidence: 0.75,
          },
        ],
        suggestedTests: ["Upper endoscopy", "Esophageal pH monitoring"],
        suggestedSpecialties: ["Gastroenterology"],
      })
    }

    // Check for rheumatoid arthritis pattern
    if (
      presentSymptoms.includes("Joint pain") &&
      (presentSymptoms.includes("Joint swelling") || presentSymptoms.includes("Morning stiffness"))
    ) {
      mockResults.push({
        diagnosisName: "Rheumatoid Arthritis",
        probability: 0.72,
        matchedPatterns: [
          {
            patternDescription: "Symmetric joint pain and swelling",
            confidence: 0.8,
          },
          {
            patternDescription: "Morning stiffness lasting >30 minutes",
            confidence: 0.75,
          },
        ],
        suggestedTests: ["Rheumatoid factor", "Anti-CCP antibodies", "ESR/CRP", "Joint X-rays"],
        suggestedSpecialties: ["Rheumatology"],
      })
    }

    // Check for asthma pattern
    if (
      presentSymptoms.includes("Shortness of breath") &&
      (presentSymptoms.includes("Wheezing") || presentSymptoms.includes("Cough"))
    ) {
      mockResults.push({
        diagnosisName: "Asthma",
        probability: 0.68,
        matchedPatterns: [
          {
            patternDescription: "Episodic shortness of breath and wheezing",
            confidence: 0.75,
          },
          {
            patternDescription: "Symptoms triggered by exercise or allergens",
            confidence: 0.65,
          },
        ],
        suggestedTests: ["Pulmonary function tests", "Bronchoprovocation test", "FeNO test"],
        suggestedSpecialties: ["Pulmonology", "Allergy and Immunology"],
      })
    }

    // Sort by probability
    mockResults.sort((a, b) => b.probability - a.probability)

    setPredictionResults(mockResults)
    setIsPredicting(false)
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return "bg-green-500"
    if (probability >= 0.6) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnosis Prediction</CardTitle>
        <CardDescription>Predict potential diagnoses based on symptom patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

          {predictionResults.length === 0 ? (
            <Button
              onClick={predictDiagnoses}
              disabled={isPredicting || patientSymptoms.filter((s) => s.present).length === 0}
              className="w-full"
            >
              {isPredicting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Symptom Patterns...
                </>
              ) : (
                "Predict Potential Diagnoses"
              )}
            </Button>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="predictions" className="space-y-4 pt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {predictionResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{result.diagnosisName}</h4>
                          <Badge variant="outline">{Math.round(result.probability * 100)}% probability</Badge>
                        </div>

                        <Progress
                          value={result.probability * 100}
                          className={`h-2 ${getProbabilityColor(result.probability)}`}
                        />

                        <div className="mt-3">
                          <h5 className="text-sm font-medium">Matched Patterns</h5>
                          <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                            {result.matchedPatterns.map((pattern, idx) => (
                              <li key={idx} className="flex items-baseline gap-2">
                                <span>{pattern.patternDescription}</span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(pattern.confidence * 100)}%
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button onClick={() => setPredictionResults([])} variant="outline">
                  Reset Predictions
                </Button>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {predictionResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium mb-2">For {result.diagnosisName}</h4>

                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Suggested Tests
                            </h5>
                            <ul className="list-disc pl-5 text-sm mt-1">
                              {result.suggestedTests.map((test, idx) => (
                                <li key={idx}>{test}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              Recommended Specialists
                            </h5>
                            <ul className="list-disc pl-5 text-sm mt-1">
                              {result.suggestedSpecialties.map((specialty, idx) => (
                                <li key={idx}>{specialty}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
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
