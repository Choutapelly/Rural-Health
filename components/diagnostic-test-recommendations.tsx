"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, AlertCircle, Clock, FileCheck, FileX, Beaker, CalendarClock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface Diagnosis {
  id: string
  name: string
  status: "confirmed" | "provisional" | "ruled_out" | "suspected"
  diagnosisDate?: Date
}

interface LabTest {
  id: string
  name: string
  lastPerformed?: Date
  result?: string
  normalRange?: string
  abnormal?: boolean
}

interface DiagnosticTest {
  id: string
  name: string
  type: "lab" | "imaging" | "procedure" | "assessment"
  description: string
  purpose: string
  priority: "urgent" | "high" | "medium" | "low"
  timeframe: string
  cost: "low" | "medium" | "high" | "very_high"
  invasiveness: "non-invasive" | "minimally-invasive" | "invasive"
  preparation?: string
  contraindications?: string[]
  alternatives?: string[]
  lastPerformed?: Date
  status?: "ordered" | "scheduled" | "completed" | "cancelled"
  result?: string
}

interface TestRecommendation {
  testId: string
  diagnosisId: string
  recommendationStrength: "strong" | "moderate" | "conditional"
  rationale: string
  clinicalGuideline?: string
}

interface DiagnosticTestRecommendationsProps {
  diagnoses: Diagnosis[]
  previousTests?: LabTest[]
  onOrderTests?: (tests: string[], diagnosisId: string, notes: string, priority: string) => void
}

export function DiagnosticTestRecommendations({
  diagnoses,
  previousTests = [],
  onOrderTests,
}: DiagnosticTestRecommendationsProps) {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(
    diagnoses.length > 0 ? diagnoses[0].id : null,
  )
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")
  const [orderPriority, setOrderPriority] = useState("routine")

  // Mock database of diagnostic tests
  const diagnosticTests: DiagnosticTest[] = [
    {
      id: "test1",
      name: "Complete Blood Count (CBC)",
      type: "lab",
      description: "Measures different components and features of blood",
      purpose: "Evaluates overall health and detects a wide range of disorders",
      priority: "high",
      timeframe: "Results typically available within 24 hours",
      cost: "low",
      invasiveness: "minimally-invasive",
      preparation: "No special preparation required",
    },
    {
      id: "test2",
      name: "Comprehensive Metabolic Panel (CMP)",
      type: "lab",
      description: "Group of 14 tests that measure different chemicals in the blood",
      purpose: "Evaluates organ function and checks for conditions like diabetes and liver disease",
      priority: "high",
      timeframe: "Results typically available within 24 hours",
      cost: "low",
      invasiveness: "minimally-invasive",
      preparation: "Fasting for 8-12 hours may be required",
    },
    {
      id: "test3",
      name: "Hemoglobin A1C",
      type: "lab",
      description: "Measures average blood glucose levels over the past 2-3 months",
      purpose: "Diagnoses and monitors diabetes",
      priority: "high",
      timeframe: "Results typically available within 24-48 hours",
      cost: "low",
      invasiveness: "minimally-invasive",
      preparation: "No special preparation required",
    },
    {
      id: "test4",
      name: "Lipid Panel",
      type: "lab",
      description: "Measures cholesterol and triglycerides in the blood",
      purpose: "Assesses risk of cardiovascular disease",
      priority: "medium",
      timeframe: "Results typically available within 24 hours",
      cost: "low",
      invasiveness: "minimally-invasive",
      preparation: "Fasting for 9-12 hours may be required",
    },
    {
      id: "test5",
      name: "Thyroid Function Tests",
      type: "lab",
      description: "Measures thyroid hormones and thyroid-stimulating hormone (TSH)",
      purpose: "Evaluates thyroid function and diagnoses thyroid disorders",
      priority: "medium",
      timeframe: "Results typically available within 24-48 hours",
      cost: "medium",
      invasiveness: "minimally-invasive",
      preparation: "No special preparation required",
    },
    {
      id: "test6",
      name: "Chest X-ray",
      type: "imaging",
      description: "Produces images of the chest, including heart, lungs, and bones",
      purpose: "Detects conditions like pneumonia, lung cancer, and heart failure",
      priority: "high",
      timeframe: "Results typically available within 24 hours",
      cost: "medium",
      invasiveness: "non-invasive",
      preparation: "Remove jewelry and wear a gown",
    },
    {
      id: "test7",
      name: "Electrocardiogram (ECG/EKG)",
      type: "procedure",
      description: "Records electrical activity of the heart",
      purpose: "Detects heart rhythm abnormalities and heart attacks",
      priority: "high",
      timeframe: "Results available immediately",
      cost: "medium",
      invasiveness: "non-invasive",
      preparation: "No special preparation required",
    },
    {
      id: "test8",
      name: "Echocardiogram",
      type: "imaging",
      description: "Uses ultrasound to create images of the heart",
      purpose: "Evaluates heart structure and function",
      priority: "medium",
      timeframe: "Results typically available within 1-2 days",
      cost: "high",
      invasiveness: "non-invasive",
      preparation: "No special preparation required",
    },
    {
      id: "test9",
      name: "Pulmonary Function Tests",
      type: "procedure",
      description: "Series of tests that measure lung function",
      purpose: "Diagnoses and monitors respiratory conditions like asthma and COPD",
      priority: "medium",
      timeframe: "Results available immediately",
      cost: "medium",
      invasiveness: "non-invasive",
      preparation: "Avoid smoking and heavy meals before the test",
    },
    {
      id: "test10",
      name: "CT Scan of Chest",
      type: "imaging",
      description: "Creates detailed images of the chest using X-rays",
      purpose: "Detects abnormalities in the lungs, heart, and chest cavity",
      priority: "high",
      timeframe: "Results typically available within 1-2 days",
      cost: "high",
      invasiveness: "non-invasive",
      preparation: "May require contrast dye; avoid eating before the test",
    },
    {
      id: "test11",
      name: "MRI of Brain",
      type: "imaging",
      description: "Creates detailed images of the brain using magnetic fields",
      purpose: "Detects brain abnormalities, tumors, and strokes",
      priority: "high",
      timeframe: "Results typically available within 1-3 days",
      cost: "very_high",
      invasiveness: "non-invasive",
      preparation: "Remove metal objects; inform about implants",
      contraindications: ["Pacemakers", "Certain metal implants", "Claustrophobia"],
    },
    {
      id: "test12",
      name: "Lumbar Puncture (Spinal Tap)",
      type: "procedure",
      description: "Collects cerebrospinal fluid from the spinal canal",
      purpose: "Diagnoses meningitis, encephalitis, and other neurological conditions",
      priority: "urgent",
      timeframe: "Some results available within hours; others may take days",
      cost: "high",
      invasiveness: "invasive",
      preparation: "Inform about medications, especially blood thinners",
      contraindications: ["Increased intracranial pressure", "Infection at puncture site"],
      alternatives: ["Blood tests", "MRI"],
    },
    {
      id: "test13",
      name: "Colonoscopy",
      type: "procedure",
      description: "Examines the large intestine using a flexible tube with a camera",
      purpose: "Detects colon cancer, polyps, and inflammatory bowel disease",
      priority: "medium",
      timeframe: "Results typically available immediately; biopsy results within days",
      cost: "high",
      invasiveness: "invasive",
      preparation: "Bowel preparation required; clear liquid diet and laxatives",
      contraindications: ["Severe colon inflammation", "Recent colon surgery"],
      alternatives: ["Fecal occult blood test", "CT colonography"],
    },
    {
      id: "test14",
      name: "Cardiac Stress Test",
      type: "procedure",
      description: "Measures heart function during physical activity",
      purpose: "Detects coronary artery disease and evaluates heart function",
      priority: "medium",
      timeframe: "Results typically available within 1-2 days",
      cost: "high",
      invasiveness: "non-invasive",
      preparation: "Avoid caffeine and tobacco; wear comfortable clothes",
      contraindications: ["Recent heart attack", "Unstable angina", "Severe heart failure"],
      alternatives: ["Pharmacological stress test", "Coronary CT angiography"],
    },
    {
      id: "test15",
      name: "Ultrasound of Abdomen",
      type: "imaging",
      description: "Creates images of abdominal organs using sound waves",
      purpose: "Evaluates liver, gallbladder, pancreas, kidneys, and other abdominal organs",
      priority: "medium",
      timeframe: "Results typically available within 1-2 days",
      cost: "medium",
      invasiveness: "non-invasive",
      preparation: "Fasting may be required; full bladder for pelvic ultrasound",
    },
  ]

  // Mock database of test recommendations for different diagnoses
  const testRecommendations: Record<string, TestRecommendation[]> = {
    // Hypertension
    d1: [
      {
        testId: "test1", // CBC
        diagnosisId: "d1",
        recommendationStrength: "moderate",
        rationale: "Evaluates for secondary causes and end-organ damage",
        clinicalGuideline: "AHA/ACC Hypertension Guidelines",
      },
      {
        testId: "test2", // CMP
        diagnosisId: "d1",
        recommendationStrength: "strong",
        rationale: "Assesses kidney function and electrolyte balance",
        clinicalGuideline: "AHA/ACC Hypertension Guidelines",
      },
      {
        testId: "test4", // Lipid Panel
        diagnosisId: "d1",
        recommendationStrength: "strong",
        rationale: "Evaluates cardiovascular risk factors",
        clinicalGuideline: "AHA/ACC Hypertension Guidelines",
      },
      {
        testId: "test7", // ECG
        diagnosisId: "d1",
        recommendationStrength: "strong",
        rationale: "Detects left ventricular hypertrophy and other cardiac abnormalities",
        clinicalGuideline: "AHA/ACC Hypertension Guidelines",
      },
      {
        testId: "test8", // Echocardiogram
        diagnosisId: "d1",
        recommendationStrength: "conditional",
        rationale: "Evaluates cardiac structure and function in patients with suspected heart disease",
        clinicalGuideline: "AHA/ACC Hypertension Guidelines",
      },
    ],
    // Diabetes
    d2: [
      {
        testId: "test3", // Hemoglobin A1C
        diagnosisId: "d2",
        recommendationStrength: "strong",
        rationale: "Confirms diagnosis and establishes baseline for monitoring",
        clinicalGuideline: "ADA Standards of Medical Care in Diabetes",
      },
      {
        testId: "test2", // CMP
        diagnosisId: "d2",
        recommendationStrength: "strong",
        rationale: "Assesses kidney function and liver function",
        clinicalGuideline: "ADA Standards of Medical Care in Diabetes",
      },
      {
        testId: "test4", // Lipid Panel
        diagnosisId: "d2",
        recommendationStrength: "strong",
        rationale: "Evaluates cardiovascular risk factors",
        clinicalGuideline: "ADA Standards of Medical Care in Diabetes",
      },
      {
        testId: "test5", // Thyroid Function Tests
        diagnosisId: "d2",
        recommendationStrength: "moderate",
        rationale: "Screens for thyroid disorders which are more common in diabetes",
        clinicalGuideline: "ADA Standards of Medical Care in Diabetes",
      },
    ],
    // Asthma
    d3: [
      {
        testId: "test9", // Pulmonary Function Tests
        diagnosisId: "d3",
        recommendationStrength: "strong",
        rationale: "Confirms diagnosis and assesses severity",
        clinicalGuideline: "GINA Guidelines for Asthma Management",
      },
      {
        testId: "test6", // Chest X-ray
        diagnosisId: "d3",
        recommendationStrength: "moderate",
        rationale: "Rules out other conditions that may mimic asthma",
        clinicalGuideline: "GINA Guidelines for Asthma Management",
      },
      {
        testId: "test1", // CBC
        diagnosisId: "d3",
        recommendationStrength: "conditional",
        rationale: "Evaluates for eosinophilia which may indicate allergic asthma",
        clinicalGuideline: "GINA Guidelines for Asthma Management",
      },
    ],
    // Coronary Artery Disease
    d4: [
      {
        testId: "test7", // ECG
        diagnosisId: "d4",
        recommendationStrength: "strong",
        rationale: "Detects ischemic changes and previous myocardial infarction",
        clinicalGuideline: "AHA/ACC Guidelines for Stable Ischemic Heart Disease",
      },
      {
        testId: "test14", // Cardiac Stress Test
        diagnosisId: "d4",
        recommendationStrength: "strong",
        rationale: "Evaluates for inducible ischemia and functional capacity",
        clinicalGuideline: "AHA/ACC Guidelines for Stable Ischemic Heart Disease",
      },
      {
        testId: "test4", // Lipid Panel
        diagnosisId: "d4",
        recommendationStrength: "strong",
        rationale: "Evaluates cardiovascular risk factors and guides therapy",
        clinicalGuideline: "AHA/ACC Guidelines for Stable Ischemic Heart Disease",
      },
      {
        testId: "test8", // Echocardiogram
        diagnosisId: "d4",
        recommendationStrength: "moderate",
        rationale: "Evaluates cardiac structure and function",
        clinicalGuideline: "AHA/ACC Guidelines for Stable Ischemic Heart Disease",
      },
    ],
    // Migraine
    d5: [
      {
        testId: "test11", // MRI of Brain
        diagnosisId: "d5",
        recommendationStrength: "conditional",
        rationale: "Rules out secondary causes in patients with atypical features or red flags",
        clinicalGuideline: "American Headache Society Guidelines",
      },
      {
        testId: "test5", // Thyroid Function Tests
        diagnosisId: "d5",
        recommendationStrength: "conditional",
        rationale: "Thyroid disorders can trigger or worsen headaches",
        clinicalGuideline: "American Headache Society Guidelines",
      },
    ],
    // GERD
    d6: [
      {
        testId: "test13", // Colonoscopy
        diagnosisId: "d6",
        recommendationStrength: "conditional",
        rationale: "Evaluates for complications and rules out other conditions in patients with alarm symptoms",
        clinicalGuideline: "ACG Guidelines for GERD",
      },
    ],
  }

  // Get recommendations for the selected diagnosis
  const getRecommendationsForDiagnosis = (diagnosisId: string): TestRecommendation[] => {
    return testRecommendations[diagnosisId] || []
  }

  // Check if a test has been performed previously
  const hasBeenPerformed = (testId: string): boolean => {
    return previousTests.some((test) => test.name === diagnosticTests.find((t) => t.id === testId)?.name)
  }

  // Get the last performed date for a test
  const getLastPerformedDate = (testId: string): Date | undefined => {
    const test = previousTests.find((test) => test.name === diagnosticTests.find((t) => t.id === testId)?.name)
    return test?.lastPerformed
  }

  // Get the result for a previously performed test
  const getTestResult = (testId: string): string | undefined => {
    const test = previousTests.find((test) => test.name === diagnosticTests.find((t) => t.id === testId)?.name)
    return test?.result
  }

  // Handle test selection
  const handleTestSelection = (testId: string) => {
    setSelectedTests((prev) => {
      if (prev.includes(testId)) {
        return prev.filter((id) => id !== testId)
      } else {
        return [...prev, testId]
      }
    })
  }

  // Handle test ordering
  const handleOrderTests = () => {
    if (onOrderTests && selectedDiagnosis) {
      onOrderTests(selectedTests, selectedDiagnosis, orderNotes, orderPriority)
      setSelectedTests([])
      setOrderNotes("")
      setOrderPriority("routine")
      setIsOrderDialogOpen(false)
    }
  }

  // Get the color for recommendation strength
  const getRecommendationColor = (strength: string): string => {
    switch (strength) {
      case "strong":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "conditional":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get the label for recommendation strength
  const getRecommendationLabel = (strength: string): string => {
    switch (strength) {
      case "strong":
        return "Strong"
      case "moderate":
        return "Moderate"
      case "conditional":
        return "Conditional"
      default:
        return "Unknown"
    }
  }

  // Get the icon for test type
  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return <Beaker className="h-4 w-4" />
      case "imaging":
        return <FileCheck className="h-4 w-4" />
      case "procedure":
        return <FileX className="h-4 w-4" />
      case "assessment":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Get the color for test priority
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "urgent":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  // Get the color for test cost
  const getCostLabel = (cost: string): string => {
    switch (cost) {
      case "low":
        return "$"
      case "medium":
        return "$$"
      case "high":
        return "$$$"
      case "very_high":
        return "$$$$"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnostic Test Recommendations</CardTitle>
        <CardDescription>Evidence-based test recommendations for suspected diagnoses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="diagnosis-select">Select Diagnosis</Label>
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((diagnosis) => (
                <Badge
                  key={diagnosis.id}
                  variant={selectedDiagnosis === diagnosis.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedDiagnosis(diagnosis.id)}
                >
                  {diagnosis.name}
                  {diagnosis.status !== "confirmed" && ` (${diagnosis.status})`}
                </Badge>
              ))}
            </div>
          </div>

          {selectedDiagnosis && (
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recommended">Recommended Tests</TabsTrigger>
                <TabsTrigger value="previous">Previous Results</TabsTrigger>
              </TabsList>

              <TabsContent value="recommended" className="space-y-4 pt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {getRecommendationsForDiagnosis(selectedDiagnosis).length > 0 ? (
                      getRecommendationsForDiagnosis(selectedDiagnosis).map((recommendation) => {
                        const test = diagnosticTests.find((t) => t.id === recommendation.testId)
                        if (!test) return null

                        const performed = hasBeenPerformed(test.id)
                        const lastPerformed = getLastPerformedDate(test.id)
                        const result = getTestResult(test.id)

                        return (
                          <div key={test.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`test-${test.id}`}
                                  checked={selectedTests.includes(test.id)}
                                  onCheckedChange={() => handleTestSelection(test.id)}
                                  disabled={
                                    performed &&
                                    lastPerformed &&
                                    new Date().getTime() - lastPerformed.getTime() < 30 * 24 * 60 * 60 * 1000
                                  }
                                />
                                <div>
                                  <Label
                                    htmlFor={`test-${test.id}`}
                                    className="text-base font-medium flex items-center gap-2"
                                  >
                                    {getTestTypeIcon(test.type)}
                                    {test.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">{test.description}</p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${getRecommendationColor(recommendation.recommendationStrength)} text-white`}
                              >
                                {getRecommendationLabel(recommendation.recommendationStrength)} Recommendation
                              </Badge>
                            </div>

                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <h4 className="text-sm font-medium">Clinical Rationale</h4>
                                <p className="text-sm">{recommendation.rationale}</p>
                                {recommendation.clinicalGuideline && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Based on {recommendation.clinicalGuideline}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Priority:</span>
                                  <span className={`text-sm ${getPriorityColor(test.priority)}`}>
                                    {test.priority.charAt(0).toUpperCase() + test.priority.slice(1)}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Timeframe:</span>
                                  <span className="text-sm">{test.timeframe}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Cost:</span>
                                  <span className="text-sm">{getCostLabel(test.cost)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Invasiveness:</span>
                                  <span className="text-sm">
                                    {test.invasiveness.charAt(0).toUpperCase() +
                                      test.invasiveness.slice(1).replace("-", " ")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {performed && lastPerformed && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Last performed on {lastPerformed.toLocaleDateString()}
                                  {result && ` - Result: ${result}`}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No specific test recommendations available for this diagnosis.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {selectedTests.length > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <span className="text-sm font-medium">
                        {selectedTests.length} test{selectedTests.length !== 1 ? "s" : ""} selected
                      </span>
                    </div>
                    <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Order Selected Tests</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order Diagnostic Tests</DialogTitle>
                          <DialogDescription>
                            You are about to order {selectedTests.length} diagnostic test
                            {selectedTests.length !== 1 ? "s" : ""}.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Selected Tests:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedTests.map((testId) => {
                                const test = diagnosticTests.find((t) => t.id === testId)
                                return (
                                  <li key={testId} className="text-sm">
                                    {test?.name}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="order-priority">Priority</Label>
                            <RadioGroup
                              id="order-priority"
                              value={orderPriority}
                              onValueChange={setOrderPriority}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="stat" id="priority-stat" />
                                <Label htmlFor="priority-stat" className="text-red-500 font-medium">
                                  STAT (Immediate)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="urgent" id="priority-urgent" />
                                <Label htmlFor="priority-urgent" className="text-orange-500">
                                  Urgent (Within 24 hours)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="routine" id="priority-routine" />
                                <Label htmlFor="priority-routine">Routine</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="order-notes">Clinical Notes</Label>
                            <Textarea
                              id="order-notes"
                              placeholder="Add any relevant clinical information or special instructions..."
                              value={orderNotes}
                              onChange={(e) => setOrderNotes(e.target.value)}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleOrderTests}>Confirm Order</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="previous" className="space-y-4 pt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {previousTests.length > 0 ? (
                      previousTests.map((test) => (
                        <div key={test.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{test.name}</h3>
                            <Badge variant={test.abnormal ? "destructive" : "outline"}>
                              {test.abnormal ? "Abnormal" : "Normal"}
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-muted-foreground" />
                              <span>Performed on {test.lastPerformed?.toLocaleDateString() || "Unknown date"}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <span className="text-sm font-medium">Result:</span>
                                <span className="text-sm ml-2">{test.result}</span>
                              </div>
                              {test.normalRange && (
                                <div>
                                  <span className="text-sm font-medium">Normal Range:</span>
                                  <span className="text-sm ml-2">{test.normalRange}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No previous test results available.</p>
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
