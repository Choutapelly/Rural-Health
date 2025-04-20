"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowUpDown,
  Brain,
  Calendar,
  ClipboardList,
  Download,
  FileText,
  Filter,
  History,
  Info,
  Microscope,
  Search,
  Share2,
  User,
} from "lucide-react"
import { AIDiagnosticSuggestions } from "@/components/ai-diagnostic-suggestions"
import { sampleTestResults, samplePatientData } from "@/utils/sample-patient-data"

export default function TestInterpretationPage() {
  const [activeTab, setActiveTab] = useState("results")
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [clinicalNotes, setClinicalNotes] = useState("")

  // Handle adding AI suggestions to clinical notes
  const handleAddToNotes = (suggestion: string) => {
    setClinicalNotes((prev) => prev + "\n\n" + suggestion)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Test Result Interpretation</h1>
          <p className="text-muted-foreground">Analyze and interpret diagnostic test results with clinical context</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">Demographics</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="text-muted-foreground">Age</div>
                    <div>{samplePatientData.demographics?.age} years</div>
                    <div className="text-muted-foreground">Sex</div>
                    <div className="capitalize">{samplePatientData.demographics?.sex}</div>
                    <div className="text-muted-foreground">BMI</div>
                    <div>{samplePatientData.demographics?.bmi} kg/m²</div>
                    <div className="text-muted-foreground">Smoking</div>
                    <div className="capitalize">{samplePatientData.demographics?.smokingStatus}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-sm flex items-center justify-between">
                    <span>Active Conditions</span>
                    <Badge variant="outline" className="font-normal">
                      {
                        samplePatientData.history.filter(
                          (item) => item.category === "condition" && item.status === "active",
                        ).length
                      }
                    </Badge>
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {samplePatientData.history
                      .filter((item) => item.category === "condition" && item.status === "active")
                      .map((condition) => (
                        <li key={condition.id} className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {condition.name}
                        </li>
                      ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-sm flex items-center justify-between">
                    <span>Current Medications</span>
                    <Badge variant="outline" className="font-normal">
                      {
                        samplePatientData.history.filter(
                          (item) => item.category === "medication" && item.status === "active",
                        ).length
                      }
                    </Badge>
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {samplePatientData.history
                      .filter((item) => item.category === "medication" && item.status === "active")
                      .map((medication) => (
                        <li key={medication.id} className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {medication.name}
                        </li>
                      ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-sm">Recent Procedures</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {samplePatientData.history
                      .filter((item) => item.category === "procedure")
                      .slice(0, 3)
                      .map((procedure) => (
                        <li key={procedure.id} className="flex items-start gap-1">
                          <Calendar className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                          <div>
                            <div>{procedure.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(procedure.dateRecorded!).toLocaleDateString()}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Test Panel
              </CardTitle>
              <CardDescription>Comprehensive Metabolic Panel + Cardiac Markers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">
                  Collected: {new Date(sampleTestResults[0].date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-1">
                  {sampleTestResults.map((test) => (
                    <div
                      key={test.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        selectedTest?.id === test.id
                          ? "bg-primary/10"
                          : test.abnormal
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{test.name}</div>
                        <div className="flex items-center gap-1">
                          {test.abnormal && (
                            <AlertCircle
                              className={`h-3.5 w-3.5 ${test.critical ? "text-red-600" : "text-amber-600"}`}
                            />
                          )}
                          <span
                            className={`text-sm ${
                              test.abnormal ? (test.critical ? "text-red-600 font-medium" : "text-amber-600") : ""
                            }`}
                          >
                            {test.value} {test.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Reference: {test.referenceRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="results" className="flex items-center gap-1">
                <Microscope className="h-4 w-4" />
                <span>Test Results</span>
              </TabsTrigger>
              <TabsTrigger value="ai-suggestions" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                <span>AI Suggestions</span>
              </TabsTrigger>
              <TabsTrigger value="clinical-notes" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Clinical Notes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="mt-6">
              {selectedTest ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedTest.name}</span>
                      {selectedTest.abnormal && (
                        <Badge
                          variant="outline"
                          className={`${
                            selectedTest.critical
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {selectedTest.critical ? "Critical" : "Abnormal"}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Collected on {new Date(selectedTest.date).toLocaleDateString()} at{" "}
                      {new Date(selectedTest.date).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Result</div>
                          <div className="text-2xl font-bold">
                            {selectedTest.value} <span className="text-base font-normal">{selectedTest.unit}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Reference Range</div>
                          <div>{selectedTest.referenceRange}</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Clinical Interpretation</h3>
                        <div className="p-3 bg-muted rounded-md">
                          {selectedTest.name === "Troponin" && (
                            <div className="space-y-2">
                              <p>
                                Troponin is elevated above the reference range, indicating myocardial injury. This may
                                be seen in:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Acute coronary syndrome</li>
                                <li>Myocarditis</li>
                                <li>Cardiac contusion</li>
                                <li>Severe heart failure</li>
                                <li>Pulmonary embolism</li>
                              </ul>
                              <p className="text-sm text-muted-foreground mt-2">
                                Correlation with clinical presentation, ECG findings, and serial measurements is
                                recommended.
                              </p>
                            </div>
                          )}

                          {selectedTest.name === "BNP" && (
                            <div className="space-y-2">
                              <p>
                                BNP is elevated above the reference range, suggesting cardiac stress. This may be seen
                                in:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Heart failure</li>
                                <li>Acute coronary syndrome</li>
                                <li>Pulmonary hypertension</li>
                                <li>Renal dysfunction</li>
                              </ul>
                              <p className="text-sm text-muted-foreground mt-2">
                                BNP levels correlate with heart failure severity and can be used for monitoring therapy.
                              </p>
                            </div>
                          )}

                          {selectedTest.name === "Glucose" && (
                            <div className="space-y-2">
                              <p>
                                Fasting glucose is elevated above the reference range, indicating hyperglycemia. This
                                may be seen in:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Diabetes mellitus</li>
                                <li>Prediabetes</li>
                                <li>Stress hyperglycemia</li>
                                <li>Medication effect (steroids, thiazides)</li>
                              </ul>
                              <p className="text-sm text-muted-foreground mt-2">
                                Values ≥126 mg/dL are consistent with diabetes if confirmed on repeat testing.
                              </p>
                            </div>
                          )}

                          {selectedTest.name === "HbA1c" && (
                            <div className="space-y-2">
                              <p>
                                HbA1c is elevated above the reference range, indicating chronic hyperglycemia. This
                                reflects average blood glucose over the past 2-3 months.
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>5.7-6.4%: Prediabetes</li>
                                <li>≥6.5%: Diabetes mellitus</li>
                              </ul>
                              <p className="text-sm text-muted-foreground mt-2">
                                Current value of 7.2% suggests suboptimal glycemic control in a patient with diabetes.
                                Target is typically &lt;7.0% for most adults with diabetes.
                              </p>
                            </div>
                          )}

                          {selectedTest.name === "Creatinine" && (
                            <div className="space-y-2">
                              <p>
                                Creatinine is elevated above the reference range, indicating reduced renal function.
                                This may be seen in:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Chronic kidney disease</li>
                                <li>Acute kidney injury</li>
                                <li>Dehydration</li>
                                <li>Medication effect (NSAIDs, ACE inhibitors)</li>
                              </ul>
                              <p className="text-sm text-muted-foreground mt-2">
                                Consider calculating eGFR for better assessment of renal function.
                              </p>
                            </div>
                          )}

                          {selectedTest.name === "eGFR" && (
                            <div className="space-y-2">
                              <p>
                                eGFR is reduced below the reference range, indicating impaired renal function. eGFR
                                staging:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>≥90 mL/min/1.73m²: Normal or high</li>
                                <li>60-89 mL/min/1.73m²: Mildly decreased</li>
                                <li>45-59 mL/min/1.73m²: Mildly to moderately decreased</li>
                                <li>30-44 mL/min/1.73m²: Moderately to severely decreased</li>
                                <li>15-29 mL/min/1.73m²: Severely decreased</li>
                                <li>&lt;15 mL/min/1.73m²: Kidney failure</li>
                              </ul>
                              <p className="text-sm text-muted-foreground mt-2">
                                Current value of 58 mL/min/1.73m² indicates mildly to moderately decreased renal
                                function (Stage 3a CKD if persistent for &gt;3 months).
                              </p>
                            </div>
                          )}

                          {!["Troponin", "BNP", "Glucose", "HbA1c", "Creatinine", "eGFR"].includes(
                            selectedTest.name,
                          ) && (
                            <div className="text-muted-foreground italic">
                              Detailed interpretation not available for this test.
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Historical Trend</h3>
                        <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                          <div className="text-muted-foreground">Historical data visualization would appear here</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" className="gap-1">
                          <History className="h-4 w-4" />
                          View History
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <Info className="h-4 w-4" />
                          Test Information
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Microscope className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Test Result</h3>
                    <p className="text-muted-foreground max-w-md">
                      Select a test result from the panel on the left to view detailed interpretation and clinical
                      context.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ai-suggestions" className="mt-6">
              <AIDiagnosticSuggestions
                testResults={sampleTestResults}
                patientData={samplePatientData}
                onAddToNotes={handleAddToNotes}
              />
            </TabsContent>

            <TabsContent value="clinical-notes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Clinical Notes
                  </CardTitle>
                  <CardDescription>Document your interpretation and clinical assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <textarea
                      className="w-full min-h-[400px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your clinical notes and assessment here..."
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
                      <Button className="gap-1">
                        <FileText className="h-4 w-4" />
                        Save Notes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
