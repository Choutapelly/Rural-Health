"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BodyMapSelector } from "@/components/body-map-selector"
import { SymptomSeverityTracker } from "@/components/symptom-severity-tracker"
import { FollowUpQuestions } from "@/components/follow-up-questions"
import { PlusCircle, AlertTriangle, Loader2, ArrowRight } from "lucide-react"

type Symptom = {
  id: string
  name: string
  severity: number
  startDate?: Date
}

type TriageResult = {
  urgency: "high" | "medium" | "low"
  specialty: string
  potentialConditions: string[]
  riskFactors: string[]
  followUpQuestions: string[]
  immediateActions: string[]
  reasoning: string
}

export function EnhancedSymptomAnalyzer() {
  const [activeTab, setActiveTab] = useState("symptoms")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)

  // Patient information
  const [patientInfo, setPatientInfo] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
  })

  // Symptoms
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [symptomDuration, setSymptomDuration] = useState("")
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([])

  // Follow-up questions
  const [followUpQuestions, setFollowUpQuestions] = useState<any[]>([])
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, any>>({})

  // Risk factors
  const [riskFactors, setRiskFactors] = useState<string[]>([])
  const commonRiskFactors = [
    "Smoking",
    "Alcohol consumption",
    "Hypertension",
    "Diabetes",
    "Heart disease",
    "Obesity",
    "Family history of cancer",
    "Previous stroke",
    "Respiratory conditions",
    "Immunocompromised",
  ]

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      const symptomId = `symptom-${Date.now()}`
      setSymptoms([
        ...symptoms,
        {
          id: symptomId,
          name: newSymptom.trim(),
          severity: 5,
          startDate: new Date(),
        },
      ])
      setNewSymptom("")
    }
  }

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id))
  }

  const handleSeverityChange = (id: string, severity: number) => {
    setSymptoms(symptoms.map((s) => (s.id === id ? { ...s, severity } : s)))
  }

  const handleBodyPartSelect = (partId: string) => {
    setSelectedBodyParts((prev) => (prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]))
  }

  const handleRiskFactorToggle = (factor: string) => {
    setRiskFactors((prev) => (prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]))
  }

  const handleFollowUpAnswer = (questionId: string, answer: any) => {
    setFollowUpAnswers({
      ...followUpAnswers,
      [questionId]: answer,
    })
  }

  const handleAnalyzeSymptoms = async () => {
    if (symptoms.length === 0) return

    setIsAnalyzing(true)

    try {
      // Prepare the data for the API
      const requestData = {
        symptoms: symptoms.map((s) => `${s.name} (Severity: ${s.severity}/10)`).join(", "),
        duration: symptomDuration,
        severity: Math.max(...symptoms.map((s) => s.severity)),
        age: patientInfo.age,
        gender: patientInfo.gender,
        locationOnBody: selectedBodyParts.length > 0 ? selectedBodyParts.join(", ") : undefined,
        medicalHistory: patientInfo.medicalHistory,
        medications: patientInfo.medications,
        allergies: patientInfo.allergies,
        riskFactors: riskFactors.length > 0 ? riskFactors.join(", ") : undefined,
        followUpResponses: Object.keys(followUpAnswers).length > 0 ? followUpAnswers : undefined,
      }

      // Call the triage API
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (data.success) {
        setTriageResult(data.triage)

        // Generate follow-up questions if we don't have any yet
        if (followUpQuestions.length === 0) {
          const generatedQuestions = data.triage.followUpQuestions.map((q: string, index: number) => ({
            id: `question-${index}`,
            text: q,
            type:
              q.toLowerCase().includes("scale") || q.toLowerCase().includes("rate")
                ? "scale"
                : q.toLowerCase().includes("yes") || q.toLowerCase().includes("no")
                  ? "boolean"
                  : "text",
          }))

          setFollowUpQuestions(generatedQuestions)
        }

        setAnalysisComplete(true)
        setActiveTab("results")
      } else {
        console.error("Error analyzing symptoms:", data.error)
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call for consultation request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    // In a real app, we would redirect to a confirmation page or show a success message
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-rose-100 text-rose-800 hover:bg-rose-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Symptom Analyzer</CardTitle>
        <CardDescription>Describe your symptoms in detail for a more accurate assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisComplete}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="symptom">Add Symptom</Label>
                  <Input
                    id="symptom"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    placeholder="e.g., Headache, Cough, Fever"
                  />
                </div>
                <Button onClick={handleAddSymptom} type="button">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div>
                <Label htmlFor="duration">How long have you been experiencing these symptoms?</Label>
                <Input
                  id="duration"
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  placeholder="e.g., 3 days, 2 weeks"
                />
              </div>

              {symptoms.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <Badge key={symptom.id} variant="outline" className="py-2 px-3">
                        {symptom.name}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveSymptom(symptom.id)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {symptoms.length > 0 && (
                <SymptomSeverityTracker symptoms={symptoms} onSeverityChange={handleSeverityChange} />
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Where are your symptoms located?</Label>
                  <BodyMapSelector onSelect={handleBodyPartSelect} selectedParts={selectedBodyParts} />
                </div>

                <div>
                  <Label className="mb-2 block">Do you have any of these risk factors?</Label>
                  <div className="space-y-2 border rounded-md p-3 h-[300px] overflow-y-auto">
                    {commonRiskFactors.map((factor) => (
                      <div key={factor} className="flex items-center space-x-2">
                        <Checkbox
                          id={`risk-${factor}`}
                          checked={riskFactors.includes(factor)}
                          onCheckedChange={() => handleRiskFactorToggle(factor)}
                        />
                        <Label htmlFor={`risk-${factor}`} className="text-sm">
                          {factor}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setActiveTab("medical")} disabled={symptoms.length === 0}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    placeholder="Your age"
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={patientInfo.gender}
                    onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="medical-history">Relevant Medical History</Label>
                <Textarea
                  id="medical-history"
                  value={patientInfo.medicalHistory}
                  onChange={(e) => setPatientInfo({ ...patientInfo, medicalHistory: e.target.value })}
                  placeholder="Please share any relevant medical history, conditions, or previous diagnoses"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={patientInfo.medications}
                  onChange={(e) => setPatientInfo({ ...patientInfo, medications: e.target.value })}
                  placeholder="List any medications you are currently taking"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={patientInfo.allergies}
                  onChange={(e) => setPatientInfo({ ...patientInfo, allergies: e.target.value })}
                  placeholder="List any allergies you have (medications, food, etc.)"
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("symptoms")}>
                  Back
                </Button>
                <Button onClick={handleAnalyzeSymptoms} disabled={isAnalyzing || symptoms.length === 0}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>Analyze Symptoms</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="followup" className="space-y-6">
            {followUpQuestions.length > 0 ? (
              <FollowUpQuestions
                questions={followUpQuestions}
                onAnswerChange={handleFollowUpAnswer}
                onComplete={() => setActiveTab("results")}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Please complete the symptom analysis first to generate follow-up questions.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("symptoms")}>
                  Go to Symptoms
                </Button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("medical")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("results")} disabled={!analysisComplete}>
                View Results
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {triageResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Assessment Results</h3>
                  <Badge variant="outline" className={getUrgencyColor(triageResult.urgency)}>
                    {triageResult.urgency === "high"
                      ? "Urgent"
                      : triageResult.urgency === "medium"
                        ? "Medium Priority"
                        : "Low Priority"}
                  </Badge>
                </div>

                {triageResult.urgency === "high" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Urgent Medical Attention Recommended</AlertTitle>
                    <AlertDescription>
                      Based on your symptoms, you should seek medical attention promptly.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Recommended Specialty</h4>
                    <p>{triageResult.specialty}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Potential Conditions</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      These are possible conditions based on your symptoms, not a diagnosis:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {triageResult.potentialConditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>

                  {triageResult.riskFactors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-1">Risk Factors Identified</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {triageResult.riskFactors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-1">Recommended Actions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {triageResult.immediateActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Assessment Reasoning</h4>
                    <p className="text-sm">{triageResult.reasoning}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      "Request Consultation with Doctor"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please complete the symptom analysis first to view results.</p>
                <Button className="mt-4" onClick={() => setActiveTab("symptoms")}>
                  Go to Symptoms
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
