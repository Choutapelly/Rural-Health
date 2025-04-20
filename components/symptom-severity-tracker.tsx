"use client"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Symptom = {
  id: string
  name: string
  severity: number
  startDate?: Date
}

type SymptomSeverityTrackerProps = {
  symptoms: Symptom[]
  onSeverityChange: (id: string, severity: number) => void
}

export function SymptomSeverityTracker({ symptoms, onSeverityChange }: SymptomSeverityTrackerProps) {
  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) return "Mild"
    if (severity <= 6) return "Moderate"
    return "Severe"
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return "bg-green-100 text-green-800 hover:bg-green-100"
    if (severity <= 6) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    return "bg-rose-100 text-rose-800 hover:bg-rose-100"
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Symptom Severity</h3>

      {symptoms.length === 0 ? (
        <p className="text-sm text-muted-foreground">No symptoms added yet.</p>
      ) : (
        <div className="space-y-4">
          {symptoms.map((symptom) => (
            <div key={symptom.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`severity-${symptom.id}`} className="font-medium">
                  {symptom.name}
                </Label>
                <Badge variant="outline" className={getSeverityColor(symptom.severity)}>
                  {getSeverityLabel(symptom.severity)}
                </Badge>
              </div>

              <Slider
                id={`severity-${symptom.id}`}
                min={1}
                max={10}
                step={1}
                value={[symptom.severity]}
                onValueChange={(value) => onSeverityChange(symptom.id, value[0])}
                className="py-2"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>

              {symptom.startDate && (
                <p className="text-xs text-muted-foreground">Started: {symptom.startDate.toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
