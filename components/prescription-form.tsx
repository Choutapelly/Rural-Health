"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

export function PrescriptionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }])

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }])
  }

  const removeMedication = (index: number) => {
    const newMedications = [...medications]
    newMedications.splice(index, 1)
    setMedications(newMedications)
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const newMedications = [...medications]
    newMedications[index] = { ...newMedications[index], [field]: value }
    setMedications(newMedications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-green-100 p-3 text-green-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Prescription Created</h3>
        <p className="text-muted-foreground mb-6">The prescription has been created and sent to the patient.</p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false)
            setMedications([{ name: "", dosage: "", frequency: "", duration: "" }])
          }}
        >
          Create Another Prescription
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="patient">Patient</Label>
          <Select>
            <SelectTrigger id="patient">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="maria-gonzalez">Maria Gonzalez</SelectItem>
              <SelectItem value="raj-patel">Raj Patel</SelectItem>
              <SelectItem value="emily-chen">Emily Chen</SelectItem>
              <SelectItem value="david-okafor">David Okafor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Input id="diagnosis" placeholder="Primary diagnosis" required />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Medications</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMedication}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medications.map((medication, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <div className="grid gap-2">
                <Label htmlFor={`medication-${index}`}>Medication Name</Label>
                <Input
                  id={`medication-${index}`}
                  value={medication.name}
                  onChange={(e) => updateMedication(index, "name", e.target.value)}
                  placeholder="Medication name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                <Input
                  id={`dosage-${index}`}
                  value={medication.dosage}
                  onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                <Input
                  id={`frequency-${index}`}
                  value={medication.frequency}
                  onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                  placeholder="e.g., Twice daily with meals"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`duration-${index}`}>Duration</Label>
                <Input
                  id={`duration-${index}`}
                  value={medication.duration}
                  onChange={(e) => updateMedication(index, "duration", e.target.value)}
                  placeholder="e.g., 7 days, 1 month"
                  required
                />
              </div>

              {medications.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-rose-500 hover:text-rose-600"
                  onClick={() => removeMedication(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Medication
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="instructions">Additional Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="Any additional instructions for the patient"
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Prescription..." : "Create Prescription"}
      </Button>
    </form>
  )
}
