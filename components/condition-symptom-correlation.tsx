"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  type PatientMedicalRecord,
  findConditionSymptomCorrelations,
  analyzeMedicationEffects,
} from "@/utils/medical-records"
import { Activity, TrendingUp, TrendingDown, Minus, Pill } from "lucide-react"

type ConditionSymptomCorrelationProps = {
  medicalRecord: PatientMedicalRecord
  symptomData: Record<string, any[]>
}

export function ConditionSymptomCorrelation({ medicalRecord, symptomData }: ConditionSymptomCorrelationProps) {
  // Find correlations between conditions and symptoms
  const correlations = findConditionSymptomCorrelations(medicalRecord, symptomData)

  // Analyze medication effects on symptoms
  const medicationEffects = analyzeMedicationEffects(medicalRecord.medications, symptomData)

  // Helper function to render confidence level
  const renderConfidence = (confidence: number) => {
    if (confidence >= 0.8) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          High Confidence
        </Badge>
      )
    } else if (confidence >= 0.5) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Medium Confidence
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Low Confidence
        </Badge>
      )
    }
  }

  // Helper function to render effect icon
  const renderEffectIcon = (effect: string) => {
    switch (effect) {
      case "improved":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "worsened":
        return <TrendingUp className="h-4 w-4 text-rose-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-rose-500" />
            Condition-Symptom Correlations
          </CardTitle>
          <CardDescription>Potential relationships between medical conditions and reported symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          {correlations.length === 0 ? (
            <p className="text-muted-foreground">No significant correlations found</p>
          ) : (
            <div className="space-y-4">
              {correlations.map((correlation, index) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{correlation.condition}</h3>
                    {renderConfidence(correlation.confidence)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    This condition may be related to the following symptoms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {correlation.relatedSymptoms.map((symptom, i) => (
                      <Badge key={i} variant="outline">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5 text-blue-500" />
            Medication Effects on Symptoms
          </CardTitle>
          <CardDescription>How medications may be affecting reported symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          {medicationEffects.length === 0 ? (
            <p className="text-muted-foreground">No significant medication effects detected</p>
          ) : (
            <div className="space-y-4">
              {medicationEffects.map((effect, index) => (
                <div key={index} className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">{effect.medication}</h3>
                  <div className="space-y-2">
                    {effect.affectedSymptoms.map((symptomEffect, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>{symptomEffect.symptom}</span>
                        <div className="flex items-center">
                          {renderEffectIcon(symptomEffect.effect)}
                          <span className="ml-1 text-sm">
                            {symptomEffect.effect === "improved"
                              ? "Improved"
                              : symptomEffect.effect === "worsened"
                                ? "Worsened"
                                : "No Change"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
