"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, HelpCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Symptom {
  id: string
  name: string
  present: boolean
  severity?: number
}

interface DiagnosisCandidate {
  id: string
  name: string
  probability: number
  matchedSymptoms: string[]
  missingSymptoms: string[]
  description: string
  commonTreatments?: string[]
}

interface DifferentialDiagnosisProps {
  patientSymptoms: Symptom[]
  onDiagnosisSelect?: (diagnosis: DiagnosisCandidate) => void
}

export function DifferentialDiagnosis({ patientSymptoms, onDiagnosisSelect }: DifferentialDiagnosisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosisCandidates, setDiagnosisCandidates] = useState<DiagnosisCandidate[]>([])
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisCandidate | null>(null)
  const [activeTab, setActiveTab] = useState<string>("candidates")

  // Mock function to generate differential diagnosis
  // In a real application, this would call an API with AI capabilities
  const generateDifferentialDiagnosis = async () => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock diagnosis candidates based on symptoms
    const presentSymptoms = patientSymptoms.filter((s) => s.present).map((s) => s.name)

    const mockCandidates: DiagnosisCandidate[] = []

    if (presentSymptoms.includes("Chest pain") && presentSymptoms.includes("Shortness of breath")) {
      mockCandidates.push({
        id: "d1",
        name: "Coronary Artery Disease",
        probability: 0.85,
        matchedSymptoms: ["Chest pain", "Shortness of breath", "Fatigue"],
        missingSymptoms: ["Nausea", "Sweating"],
        description:
          "Coronary artery disease is the narrowing or blockage of the coronary arteries, usually caused by atherosclerosis.",
        commonTreatments: ["Aspirin", "Statins", "Beta blockers", "Lifestyle modifications"],
      })
    }

    if (presentSymptoms.includes("Headache") && presentSymptoms.includes("Nausea")) {
      mockCandidates.push({
        id: "d2",
        name: "Migraine",
        probability: 0.78,
        matchedSymptoms: ["Headache", "Nausea", "Light sensitivity"],
        missingSymptoms: ["Visual aura", "Dizziness"],
        description:
          "Migraine is a neurological condition that can cause multiple symptoms including recurring intense headaches.",
        commonTreatments: ["Triptans", "NSAIDs", "Anti-nausea medications", "Preventive medications"],
      })
    }

    if (presentSymptoms.includes("Cough") && presentSymptoms.includes("Fever")) {
      mockCandidates.push({
        id: "d3",
        name: "Pneumonia",
        probability: 0.72,
        matchedSymptoms: ["Cough", "Fever", "Shortness of breath"],
        missingSymptoms: ["Chest pain", "Fatigue"],
        description:
          "Pneumonia is an infection that inflames the air sacs in one or both lungs, which may fill with fluid.",
        commonTreatments: ["Antibiotics", "Rest", "Fluids", "Fever reducers"],
      })
    }

    if (presentSymptoms.includes("Joint pain") && presentSymptoms.includes("Stiffness")) {
      mockCandidates.push({
        id: "d4",
        name: "Rheumatoid Arthritis",
        probability: 0.68,
        matchedSymptoms: ["Joint pain", "Stiffness", "Swelling"],
        missingSymptoms: ["Fatigue", "Fever"],
        description:
          "Rheumatoid arthritis is an autoimmune and inflammatory disease that causes painful swelling in affected joints.",
        commonTreatments: ["NSAIDs", "Corticosteroids", "DMARDs", "Physical therapy"],
      })
    }

    // Sort by probability
    mockCandidates.sort((a, b) => b.probability - a.probability)

    setDiagnosisCandidates(mockCandidates)
    setIsAnalyzing(false)
  }

  const handleDiagnosisSelect = (diagnosis: DiagnosisCandidate) => {
    setSelectedDiagnosis(diagnosis)
    setActiveTab("details")
    if (onDiagnosisSelect) {
      onDiagnosisSelect(diagnosis)
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return "bg-green-500"
    if (probability >= 0.6) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Differential Diagnosis</CardTitle>
        <CardDescription>AI-assisted analysis of possible diagnoses based on patient symptoms</CardDescription>
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

          {diagnosisCandidates.length === 0 ? (
            <Button
              onClick={generateDifferentialDiagnosis}
              disabled={isAnalyzing || patientSymptoms.filter((s) => s.present).length === 0}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                "Generate Differential Diagnosis"
              )}
            </Button>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="candidates">Diagnosis Candidates</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedDiagnosis}>
                  Diagnosis Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="candidates" className="space-y-4 pt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {diagnosisCandidates.map((diagnosis) => (
                      <div
                        key={diagnosis.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleDiagnosisSelect(diagnosis)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{diagnosis.name}</h4>
                          <Badge variant="outline">{Math.round(diagnosis.probability * 100)}% match</Badge>
                        </div>
                        <Progress
                          value={diagnosis.probability * 100}
                          className={`h-2 ${getProbabilityColor(diagnosis.probability)}`}
                        />
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Matches {diagnosis.matchedSymptoms.length} symptoms</span>
                          </div>
                          {diagnosis.missingSymptoms.length > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <HelpCircle className="h-4 w-4" />
                              <span>Missing {diagnosis.missingSymptoms.length} typical symptoms</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button onClick={() => setDiagnosisCandidates([])} variant="outline">
                  Reset Analysis
                </Button>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                {selectedDiagnosis && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium">{selectedDiagnosis.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {Math.round(selectedDiagnosis.probability * 100)}% probability
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm">{selectedDiagnosis.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Matched Symptoms</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {selectedDiagnosis.matchedSymptoms.map((symptom) => (
                            <li key={symptom} className="text-green-600">
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Typically Present Symptoms</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {selectedDiagnosis.missingSymptoms.map((symptom) => (
                            <li key={symptom} className="text-amber-600">
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {selectedDiagnosis.commonTreatments && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Common Treatments</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {selectedDiagnosis.commonTreatments.map((treatment) => (
                            <li key={treatment}>{treatment}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => setActiveTab("candidates")}>
                        Back to Candidates
                      </Button>
                      <Button>Confirm Diagnosis</Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
