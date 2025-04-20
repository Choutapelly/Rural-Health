"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  HelpCircle,
  History,
  Info,
  Lightbulb,
  ListChecks,
  Microscope,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type DiagnosticSuggestion, type PatientData, generateDiagnosticSuggestions } from "@/utils/ai-diagnostics"

interface AIDiagnosticSuggestionsProps {
  testResults: any[]
  patientData?: PatientData
  onAddToNotes?: (suggestion: string) => void
}

export function AIDiagnosticSuggestions({ testResults, patientData, onAddToNotes }: AIDiagnosticSuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<DiagnosticSuggestion | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<DiagnosticSuggestion[]>([])

  // Generate diagnostic suggestions
  const handleGenerateSuggestions = () => {
    setIsGenerating(true)

    // Simulate AI processing time
    setTimeout(() => {
      const generatedSuggestions = generateDiagnosticSuggestions(testResults, patientData)
      setSuggestions(generatedSuggestions)
      setIsGenerating(false)
    }, 1500)
  }

  // Get confidence level color and label
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) {
      return { color: "bg-green-100 text-green-800 border-green-200", label: "High" }
    } else if (confidence >= 70) {
      return { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Moderate" }
    } else {
      return { color: "bg-amber-100 text-amber-800 border-amber-200", label: "Low" }
    }
  }

  // Get evidence strength color and icon
  const getEvidenceStrength = (strength: "strong" | "moderate" | "weak") => {
    if (strength === "strong") {
      return { color: "text-green-600", icon: <AlertCircle className="h-4 w-4" /> }
    } else if (strength === "moderate") {
      return { color: "text-blue-600", icon: <Info className="h-4 w-4" /> }
    } else {
      return { color: "text-amber-600", icon: <HelpCircle className="h-4 w-4" /> }
    }
  }

  // Get evidence source icon
  const getEvidenceSourceIcon = (source: "test" | "history" | "combination") => {
    if (source === "test") {
      return <Microscope className="h-4 w-4" />
    } else if (source === "history") {
      return <History className="h-4 w-4" />
    } else {
      return <ClipboardList className="h-4 w-4" />
    }
  }

  // Format diagnostic suggestion for clinical notes
  const formatSuggestionForNotes = (suggestion: DiagnosticSuggestion): string => {
    let formattedText = `AI Diagnostic Suggestion: ${suggestion.condition}\n`
    formattedText += `Confidence: ${suggestion.confidence}% (${getConfidenceLevel(suggestion.confidence).label})\n\n`
    formattedText += `${suggestion.description}\n\n`

    formattedText += "Supporting Evidence:\n"
    suggestion.evidencePoints.forEach((evidence, index) => {
      formattedText += `${index + 1}. ${evidence.testName}: ${evidence.value} - ${evidence.interpretation}\n`
    })

    if (suggestion.historyFactors) {
      if (suggestion.historyFactors.supporting.length > 0) {
        formattedText += "\nSupporting Patient History Factors:\n"
        suggestion.historyFactors.supporting.forEach((factor, index) => {
          formattedText += `${index + 1}. ${factor}\n`
        })
      }

      if (suggestion.historyFactors.contradicting.length > 0) {
        formattedText += "\nContradicting Patient History Factors:\n"
        suggestion.historyFactors.contradicting.forEach((factor, index) => {
          formattedText += `${index + 1}. ${factor}\n`
        })
      }
    }

    if (suggestion.riskFactors && suggestion.riskFactors.length > 0) {
      formattedText += "\nRisk Factors Present:\n"
      suggestion.riskFactors.forEach((factor, index) => {
        formattedText += `${index + 1}. ${factor}\n`
      })
    }

    formattedText += "\nDifferential Diagnoses to Consider:\n"
    suggestion.differentials.forEach((differential, index) => {
      formattedText += `${index + 1}. ${differential}\n`
    })

    formattedText += "\nRecommended Additional Tests:\n"
    suggestion.suggestedTests.forEach((test, index) => {
      formattedText += `${index + 1}. ${test}\n`
    })

    if (suggestion.references && suggestion.references.length > 0) {
      formattedText += "\nReferences:\n"
      suggestion.references.forEach((reference, index) => {
        formattedText += `${index + 1}. ${reference.title}\n`
      })
    }

    formattedText +=
      "\nNote: AI-generated suggestions are intended to support clinical decision-making and should be interpreted in the context of the patient's complete clinical picture."

    return formattedText
  }

  // Handle adding suggestion to clinical notes
  const handleAddToNotes = () => {
    if (!selectedSuggestion || !onAddToNotes) return

    const formattedSuggestion = formatSuggestionForNotes(selectedSuggestion)
    onAddToNotes(formattedSuggestion)
  }

  // Count evidence sources
  const countEvidenceSources = (suggestion: DiagnosticSuggestion) => {
    const sources = {
      test: 0,
      history: 0,
      combination: 0,
    }

    suggestion.evidencePoints.forEach((evidence) => {
      sources[evidence.source]++
    })

    return sources
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Diagnostic Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered analysis of test patterns and patient history to suggest possible diagnoses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Generate AI Diagnostic Suggestions</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              The AI will analyze test result patterns and patient history to suggest possible diagnoses and provide
              supporting evidence.
            </p>
            <Button onClick={handleGenerateSuggestions} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Analyzing Test Patterns & Patient History...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate Diagnostic Suggestions
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {suggestions.length} Potential {suggestions.length === 1 ? "Diagnosis" : "Diagnoses"} Identified
              </h3>
              <Button variant="outline" size="sm" onClick={() => setSuggestions([])} className="gap-1">
                <Microscope className="h-3.5 w-3.5" />
                New Analysis
              </Button>
            </div>

            <Tabs defaultValue="byConfidence">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="byConfidence">By Confidence</TabsTrigger>
                <TabsTrigger value="byCategory">By Category</TabsTrigger>
                <TabsTrigger value="byEvidence">By Evidence Source</TabsTrigger>
              </TabsList>

              <TabsContent value="byConfidence" className="pt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {suggestions
                      .sort((a, b) => b.confidence - a.confidence)
                      .map((suggestion, index) => {
                        const confidenceLevel = getConfidenceLevel(suggestion.confidence)
                        const evidenceSources = countEvidenceSources(suggestion)

                        return (
                          <div
                            key={index}
                            className="rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedSuggestion(suggestion)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{suggestion.condition}</h4>
                              <Badge variant="outline" className={`${confidenceLevel.color} flex items-center gap-1`}>
                                {confidenceLevel.label} Confidence ({suggestion.confidence}%)
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>

                            {/* Evidence source indicators */}
                            <div className="flex items-center gap-3 mb-3">
                              {evidenceSources.test > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Microscope className="h-3.5 w-3.5 text-blue-600" />
                                  <span>
                                    {evidenceSources.test} test {evidenceSources.test === 1 ? "finding" : "findings"}
                                  </span>
                                </div>
                              )}
                              {evidenceSources.history > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                  <History className="h-3.5 w-3.5 text-green-600" />
                                  <span>
                                    {evidenceSources.history} history{" "}
                                    {evidenceSources.history === 1 ? "factor" : "factors"}
                                  </span>
                                </div>
                              )}
                              {evidenceSources.combination > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                  <ClipboardList className="h-3.5 w-3.5 text-purple-600" />
                                  <span>
                                    {evidenceSources.combination} combined{" "}
                                    {evidenceSources.combination === 1 ? "finding" : "findings"}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {suggestion.evidencePoints.slice(0, 2).map((evidence, idx) => {
                                const strengthIndicator = getEvidenceStrength(evidence.strength)
                                const sourceIcon = getEvidenceSourceIcon(evidence.source)

                                return (
                                  <Badge key={idx} variant="outline" className="flex items-center gap-1 bg-background">
                                    <span className={strengthIndicator.color}>{strengthIndicator.icon}</span>
                                    {evidence.testName}
                                  </Badge>
                                )
                              })}
                              {suggestion.evidencePoints.length > 2 && (
                                <Badge variant="outline" className="bg-background">
                                  +{suggestion.evidencePoints.length - 2} more
                                </Badge>
                              )}
                            </div>

                            {/* History factors indicators */}
                            {suggestion.historyFactors && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {suggestion.historyFactors.supporting.length > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    {suggestion.historyFactors.supporting.length} supporting{" "}
                                    {suggestion.historyFactors.supporting.length === 1 ? "factor" : "factors"}
                                  </Badge>
                                )}
                                {suggestion.historyFactors.contradicting.length > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-800 border-red-200 flex items-center gap-1"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    {suggestion.historyFactors.contradicting.length} contradicting{" "}
                                    {suggestion.historyFactors.contradicting.length === 1 ? "factor" : "factors"}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="byCategory" className="pt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <Accordion type="multiple" className="space-y-2">
                    <AccordionItem value="cardiac" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>Cardiac Conditions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter((s) =>
                            ["Acute Coronary Syndrome", "Heart Failure", "Myocarditis"].some((term) =>
                              s.condition.includes(term),
                            ),
                          )
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>

                                {/* History factors indicators */}
                                {suggestion.historyFactors && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {suggestion.historyFactors.supporting.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-800 border-green-200 text-xs flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                        {suggestion.historyFactors.supporting.length} supporting
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        {!suggestions.some((s) =>
                          ["Acute Coronary Syndrome", "Heart Failure", "Myocarditis"].some((term) =>
                            s.condition.includes(term),
                          ),
                        ) && <p className="text-sm text-muted-foreground py-2">No cardiac conditions identified</p>}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="metabolic" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Microscope className="h-4 w-4" />
                          <span>Metabolic & Endocrine Conditions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter((s) =>
                            ["Diabetes", "Thyroid", "Metabolic", "Dyslipidemia"].some((term) =>
                              s.condition.includes(term),
                            ),
                          )
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>

                                {/* History factors indicators */}
                                {suggestion.historyFactors && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {suggestion.historyFactors.supporting.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-800 border-green-200 text-xs flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                        {suggestion.historyFactors.supporting.length} supporting
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        {!suggestions.some((s) =>
                          ["Diabetes", "Thyroid", "Metabolic", "Dyslipidemia"].some((term) =>
                            s.condition.includes(term),
                          ),
                        ) && (
                          <p className="text-sm text-muted-foreground py-2">
                            No metabolic or endocrine conditions identified
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="renal" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Microscope className="h-4 w-4" />
                          <span>Renal Conditions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter((s) => ["Kidney", "Renal", "Nephropathy"].some((term) => s.condition.includes(term)))
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>

                                {/* History factors indicators */}
                                {suggestion.historyFactors && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {suggestion.historyFactors.supporting.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-800 border-green-200 text-xs flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                        {suggestion.historyFactors.supporting.length} supporting
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        {!suggestions.some((s) =>
                          ["Kidney", "Renal", "Nephropathy"].some((term) => s.condition.includes(term)),
                        ) && <p className="text-sm text-muted-foreground py-2">No renal conditions identified</p>}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="other" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <ListChecks className="h-4 w-4" />
                          <span>Other Conditions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter(
                            (s) =>
                              ![
                                "Acute Coronary Syndrome",
                                "Heart Failure",
                                "Myocarditis",
                                "Diabetes",
                                "Thyroid",
                                "Metabolic",
                                "Dyslipidemia",
                                "Kidney",
                                "Renal",
                                "Nephropathy",
                              ].some((term) => s.condition.includes(term)),
                          )
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>

                                {/* History factors indicators */}
                                {suggestion.historyFactors && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {suggestion.historyFactors.supporting.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-800 border-green-200 text-xs flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                        {suggestion.historyFactors.supporting.length} supporting
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        {!suggestions.some(
                          (s) =>
                            ![
                              "Acute Coronary Syndrome",
                              "Heart Failure",
                              "Myocarditis",
                              "Diabetes",
                              "Thyroid",
                              "Metabolic",
                              "Dyslipidemia",
                              "Kidney",
                              "Renal",
                              "Nephropathy",
                            ].some((term) => s.condition.includes(term)),
                        ) && <p className="text-sm text-muted-foreground py-2">No other conditions identified</p>}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="byEvidence" className="pt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <Accordion type="multiple" className="space-y-2">
                    <AccordionItem value="testAndHistory" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" />
                          <span>Test Results + Patient History</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter(
                            (s) =>
                              s.evidencePoints.some((e) => e.source === "test") &&
                              s.evidencePoints.some((e) => e.source === "history"),
                          )
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>

                                <div className="mt-1 flex items-center gap-2">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs">
                                    <Microscope className="h-3 w-3 mr-1" />
                                    Test evidence
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-800 border-green-200 text-xs"
                                  >
                                    <History className="h-3 w-3 mr-1" />
                                    History evidence
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                        {!suggestions.some(
                          (s) =>
                            s.evidencePoints.some((e) => e.source === "test") &&
                            s.evidencePoints.some((e) => e.source === "history"),
                        ) && (
                          <p className="text-sm text-muted-foreground py-2">
                            No conditions with both test and history evidence
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="testOnly" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Microscope className="h-4 w-4" />
                          <span>Test Results Only</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter(
                            (s) =>
                              s.evidencePoints.some((e) => e.source === "test") &&
                              !s.evidencePoints.some((e) => e.source === "history"),
                          )
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>

                                <div className="mt-1">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs">
                                    <Microscope className="h-3 w-3 mr-1" />
                                    Test evidence only
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                        {!suggestions.some(
                          (s) =>
                            s.evidencePoints.some((e) => e.source === "test") &&
                            !s.evidencePoints.some((e) => e.source === "history"),
                        ) && (
                          <p className="text-sm text-muted-foreground py-2">No conditions with test evidence only</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="historyInfluenced" className="border rounded-lg px-4">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>History-Influenced Confidence</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-2">
                        {suggestions
                          .filter(
                            (s) =>
                              s.historyFactors &&
                              (s.historyFactors.supporting.length > 0 || s.historyFactors.contradicting.length > 0),
                          )
                          .map((suggestion, index) => {
                            const confidenceLevel = getConfidenceLevel(suggestion.confidence)

                            return (
                              <div
                                key={index}
                                className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedSuggestion(suggestion)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{suggestion.condition}</h4>
                                  <Badge variant="outline" className={`${confidenceLevel.color} text-xs`}>
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>

                                <div className="mt-1 flex flex-wrap gap-1">
                                  {suggestion.historyFactors?.supporting.length > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-800 border-green-200 text-xs flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="h-2.5 w-2.5" />
                                      {suggestion.historyFactors.supporting.length} supporting
                                    </Badge>
                                  )}
                                  {suggestion.historyFactors?.contradicting.length > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-red-50 text-red-800 border-red-200 text-xs flex items-center gap-1"
                                    >
                                      <XCircle className="h-2.5 w-2.5" />
                                      {suggestion.historyFactors.contradicting.length} contradicting
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        {!suggestions.some(
                          (s) =>
                            s.historyFactors &&
                            (s.historyFactors.supporting.length > 0 || s.historyFactors.contradicting.length > 0),
                        ) && (
                          <p className="text-sm text-muted-foreground py-2">
                            No conditions with history-influenced confidence
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {selectedSuggestion && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-2">
                    <Info className="mr-2 h-4 w-4" />
                    View Detailed Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        {selectedSuggestion.condition}
                      </span>
                      <Badge variant="outline" className={`${getConfidenceLevel(selectedSuggestion.confidence).color}`}>
                        {getConfidenceLevel(selectedSuggestion.confidence).label} Confidence (
                        {selectedSuggestion.confidence}%)
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>{selectedSuggestion.description}</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Microscope className="h-4 w-4 text-blue-600" />
                        Test Result Evidence
                      </h3>
                      <div className="space-y-2">
                        {selectedSuggestion.evidencePoints
                          .filter((evidence) => evidence.source === "test")
                          .map((evidence, index) => {
                            const strengthIndicator = getEvidenceStrength(evidence.strength)

                            return (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className={`mt-0.5 ${strengthIndicator.color}`}>{strengthIndicator.icon}</div>
                                <div>
                                  <div className="font-medium">
                                    {evidence.testName}: {evidence.value}
                                  </div>
                                  <div className="text-muted-foreground">{evidence.interpretation}</div>
                                </div>
                              </div>
                            )
                          })}
                        {selectedSuggestion.evidencePoints.filter((evidence) => evidence.source === "test").length ===
                          0 && <p className="text-sm text-muted-foreground">No test result evidence available</p>}
                      </div>

                      <h3 className="text-sm font-medium mt-4 mb-2 flex items-center gap-1">
                        <History className="h-4 w-4 text-green-600" />
                        Patient History Evidence
                      </h3>
                      <div className="space-y-2">
                        {selectedSuggestion.evidencePoints
                          .filter((evidence) => evidence.source === "history")
                          .map((evidence, index) => {
                            const strengthIndicator = getEvidenceStrength(evidence.strength)

                            return (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className={`mt-0.5 ${strengthIndicator.color}`}>{strengthIndicator.icon}</div>
                                <div>
                                  <div className="font-medium">
                                    {evidence.testName}: {evidence.value}
                                  </div>
                                  <div className="text-muted-foreground">{evidence.interpretation}</div>
                                </div>
                              </div>
                            )
                          })}
                        {selectedSuggestion.evidencePoints.filter((evidence) => evidence.source === "history")
                          .length === 0 && (
                          <p className="text-sm text-muted-foreground">No patient history evidence available</p>
                        )}
                      </div>

                      {selectedSuggestion.historyFactors && (
                        <>
                          {selectedSuggestion.historyFactors.supporting.length > 0 && (
                            <>
                              <h3 className="text-sm font-medium mt-4 mb-2 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                Supporting History Factors
                              </h3>
                              <ul className="text-sm list-disc pl-5 space-y-1">
                                {selectedSuggestion.historyFactors.supporting.map((factor, index) => (
                                  <li key={index}>{factor}</li>
                                ))}
                              </ul>
                            </>
                          )}

                          {selectedSuggestion.historyFactors.contradicting.length > 0 && (
                            <>
                              <h3 className="text-sm font-medium mt-4 mb-2 flex items-center gap-1">
                                <XCircle className="h-4 w-4 text-red-600" />
                                Contradicting History Factors
                              </h3>
                              <ul className="text-sm list-disc pl-5 space-y-1">
                                {selectedSuggestion.historyFactors.contradicting.map((factor, index) => (
                                  <li key={index}>{factor}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      {selectedSuggestion.riskFactors && selectedSuggestion.riskFactors.length > 0 && (
                        <>
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            Risk Factors Present
                          </h3>
                          <ul className="text-sm list-disc pl-5 space-y-1 mb-4">
                            {selectedSuggestion.riskFactors.map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      <h3 className="text-sm font-medium mb-2">Differential Diagnoses</h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {selectedSuggestion.differentials.map((differential, index) => (
                          <li key={index}>{differential}</li>
                        ))}
                      </ul>

                      <h3 className="text-sm font-medium mt-4 mb-2">Recommended Additional Tests</h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {selectedSuggestion.suggestedTests.map((test, index) => (
                          <li key={index}>{test}</li>
                        ))}
                      </ul>

                      {selectedSuggestion.references && selectedSuggestion.references.length > 0 && (
                        <>
                          <h3 className="text-sm font-medium mt-4 mb-2">References</h3>
                          <ul className="text-sm space-y-1">
                            {selectedSuggestion.references.map((reference, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                <a
                                  href={reference.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {reference.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium">AI-Generated Suggestion</p>
                                <p>
                                  This analysis is generated by AI to support clinical decision-making. Always interpret
                                  in the context of the patient's complete clinical picture and use professional
                                  judgment.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            AI suggestions are based on pattern recognition in test results and patient history data and
                            should be considered as decision support, not definitive diagnoses.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {onAddToNotes && (
                    <Button onClick={handleAddToNotes} className="mt-4 w-full flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Add to Clinical Notes
                    </Button>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Brain className="h-3.5 w-3.5" />
            <span>AI-powered analysis</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>High confidence</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Moderate confidence</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Low confidence</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
