"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PrescriptionForm } from "@/components/prescription-form"
import { SymptomDetailsTable } from "@/components/symptom-details-table"
import { MedicalRecordSummary } from "@/components/medical-record-summary"
import type { PatientSymptomData } from "@/utils/chart-data"
import type { PatientMedicalRecord } from "@/utils/medical-records"
import { User, Calendar, Phone, MapPin, Heart, AlertCircle, FileText, Pill } from "lucide-react"

interface PatientDetailViewProps {
  patient: PatientSymptomData
  medicalRecords?: PatientMedicalRecord | null
}

export function PatientDetailView({ patient, medicalRecords }: PatientDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate age from DOB if available
  const getAge = () => {
    // Mock age for now
    const birthDate = new Date(1990, 5, 15)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {patient.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <CardTitle className="text-2xl">{patient.patientName}</CardTitle>
                <CardDescription className="text-base">Patient ID: {patient.patientId}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{getAge()} years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">Male</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1-234-567-8900</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">Rural Area</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Symptoms</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Records</span>
          </TabsTrigger>
          <TabsTrigger value="prescription" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Rx</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Summary</CardTitle>
              <CardDescription>Current health overview and recent vitals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicalRecords ? (
                <MedicalRecordSummary records={medicalRecords} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No medical records available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Medications</CardTitle>
              <CardDescription>Active medications prescribed to this patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Aspirin</p>
                    <p className="text-sm text-muted-foreground">100mg daily</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Metformin</p>
                    <p className="text-sm text-muted-foreground">500mg twice daily</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Symptoms Tab */}
        <TabsContent value="symptoms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Symptoms</CardTitle>
              <CardDescription>Patient&apos;s reported symptoms and severity levels</CardDescription>
            </CardHeader>
            <CardContent>
              {patient.symptoms && patient.symptoms.length > 0 ? (
                <SymptomDetailsTable symptoms={patient.symptoms} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No symptoms recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical History</CardTitle>
              <CardDescription>Complete medical records and test results</CardDescription>
            </CardHeader>
            <CardContent>
              {medicalRecords ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Blood Pressure History</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {medicalRecords.bloodPressureReadings?.slice(-3).map((bp, idx) => (
                        <div key={idx} className="p-2 border rounded">
                          <p className="text-sm">{bp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Chronic Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {medicalRecords.chronicConditions?.map((condition, idx) => (
                        <Badge key={idx} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {medicalRecords.allergies?.length ? (
                        medicalRecords.allergies.map((allergy, idx) => (
                          <Badge key={idx} variant="destructive">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No known allergies</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No medical records available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescription Tab */}
        <TabsContent value="prescription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Prescription</CardTitle>
              <CardDescription>Create a new prescription for {patient.patientName}</CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionForm patientId={patient.patientId} patientName={patient.patientName} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
