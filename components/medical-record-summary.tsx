"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Pill, AlertTriangle, FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { type PatientMedicalRecord, calculateAge } from "@/utils/medical-records"

type MedicalRecordSummaryProps = {
  medicalRecord: PatientMedicalRecord
}

export function MedicalRecordSummary({ medicalRecord }: MedicalRecordSummaryProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    conditions: true,
    medications: true,
    allergies: true,
    vitals: false,
    labs: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        )
      case "managed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Managed
          </Badge>
        )
      case "discontinued":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Discontinued
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "mild":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Mild
          </Badge>
        )
      case "moderate":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Moderate
          </Badge>
        )
      case "severe":
        return (
          <Badge variant="outline" className="bg-rose-100 text-rose-800">
            Severe
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{medicalRecord.patientName}</CardTitle>
            <CardDescription>
              {calculateAge(medicalRecord.dateOfBirth)} years old • {medicalRecord.gender} •
              {medicalRecord.bloodType ? ` Blood Type: ${medicalRecord.bloodType}` : ""}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            Medical Record
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="labs">
              <Activity className="mr-2 h-4 w-4" />
              Lab Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              {/* Medical Conditions */}
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection("conditions")}
                >
                  <h3 className="text-lg font-medium flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-rose-500" />
                    Medical Conditions
                  </h3>
                  {expandedSections.conditions ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>

                {expandedSections.conditions && (
                  <div className="mt-2">
                    {medicalRecord.conditions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No medical conditions recorded</p>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Condition</TableHead>
                              <TableHead>Diagnosed</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medicalRecord.conditions.map((condition) => (
                              <TableRow key={condition.id}>
                                <TableCell className="font-medium">{condition.name}</TableCell>
                                <TableCell>{condition.diagnosisDate.toLocaleDateString()}</TableCell>
                                <TableCell>{getStatusBadge(condition.status)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {condition.notes || "—"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Medications */}
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection("medications")}
                >
                  <h3 className="text-lg font-medium flex items-center">
                    <Pill className="mr-2 h-5 w-5 text-blue-500" />
                    Medications
                  </h3>
                  {expandedSections.medications ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>

                {expandedSections.medications && (
                  <div className="mt-2">
                    {medicalRecord.medications.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No medications recorded</p>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medicalRecord.medications.map((medication) => (
                              <TableRow key={medication.id}>
                                <TableCell className="font-medium">{medication.name}</TableCell>
                                <TableCell>{medication.dosage}</TableCell>
                                <TableCell>{medication.frequency}</TableCell>
                                <TableCell>{getStatusBadge(medication.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection("allergies")}
                >
                  <h3 className="text-lg font-medium flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                    Allergies
                  </h3>
                  {expandedSections.allergies ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>

                {expandedSections.allergies && (
                  <div className="mt-2">
                    {medicalRecord.allergies.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No allergies recorded</p>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Allergen</TableHead>
                              <TableHead>Reaction</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Diagnosed</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medicalRecord.allergies.map((allergy) => (
                              <TableRow key={allergy.id}>
                                <TableCell className="font-medium">{allergy.allergen}</TableCell>
                                <TableCell className="font-medium">{allergy.allergen}</TableCell>
                                <TableCell>{allergy.reaction}</TableCell>
                                <TableCell>{getSeverityBadge(allergy.severity)}</TableCell>
                                <TableCell>
                                  {allergy.diagnosedDate ? allergy.diagnosedDate.toLocaleDateString() : "—"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vital Signs */}
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection("vitals")}
                >
                  <h3 className="text-lg font-medium flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-green-500" />
                    Vital Signs
                  </h3>
                  {expandedSections.vitals ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>

                {expandedSections.vitals && (
                  <div className="mt-2">
                    {medicalRecord.vitalSigns.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No vital signs recorded</p>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medicalRecord.vitalSigns
                              .sort((a, b) => b.date.getTime() - a.date.getTime())
                              .slice(0, 5)
                              .map((vital) => (
                                <TableRow key={vital.id}>
                                  <TableCell className="font-medium">
                                    {vital.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </TableCell>
                                  <TableCell>
                                    {vital.value} {vital.unit}
                                  </TableCell>
                                  <TableCell>{vital.date.toLocaleDateString()}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{vital.notes || "—"}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {medicalRecord.notes.length === 0 ? (
                <p className="text-muted-foreground">No clinical notes available</p>
              ) : (
                medicalRecord.notes
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((note) => (
                    <Card key={note.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{note.date.toLocaleDateString()}</span>
                          </div>
                          <span className="text-sm font-medium">{note.provider}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{note.content}</p>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="labs">
            <div className="space-y-4">
              {medicalRecord.labResults.length === 0 ? (
                <p className="text-muted-foreground">No lab results available</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicalRecord.labResults
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((lab) => (
                          <TableRow key={lab.id}>
                            <TableCell className="font-medium">{lab.name}</TableCell>
                            <TableCell>
                              {lab.value} {lab.unit}
                            </TableCell>
                            <TableCell>{lab.referenceRange || "—"}</TableCell>
                            <TableCell>{lab.date.toLocaleDateString()}</TableCell>
                            <TableCell>
                              {lab.abnormal ? (
                                <Badge variant="outline" className="bg-rose-100 text-rose-800">
                                  Abnormal
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  Normal
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
