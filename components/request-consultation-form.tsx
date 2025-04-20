"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedSymptomAnalyzer } from "@/components/enhanced-symptom-analyzer"

export function RequestConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("basic")

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
        <h3 className="text-xl font-semibold mb-2">Consultation Request Submitted</h3>
        <p className="text-muted-foreground mb-6">
          Your request has been submitted successfully. A doctor will review your case and contact you soon.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit Another Request
        </Button>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic Form</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Symptom Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="symptoms">What symptoms are you experiencing?</Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your symptoms in detail"
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">How long have you been experiencing these symptoms?</Label>
              <Input id="duration" placeholder="e.g., 3 days, 2 weeks" required />
            </div>

            <div className="grid gap-2">
              <Label>How severe are your symptoms?</Label>
              <RadioGroup defaultValue="medium">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="mild" />
                  <Label htmlFor="mild">Mild - Noticeable but not interfering with daily activities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Moderate - Somewhat interfering with daily activities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="severe" />
                  <Label htmlFor="severe">Severe - Significantly interfering with daily activities</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specialty">What type of doctor would you like to consult with?</Label>
              <Select>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Practitioner</SelectItem>
                  <SelectItem value="cardiology">Cardiologist</SelectItem>
                  <SelectItem value="dermatology">Dermatologist</SelectItem>
                  <SelectItem value="pediatrics">Pediatrician</SelectItem>
                  <SelectItem value="psychiatry">Psychiatrist</SelectItem>
                  <SelectItem value="neurology">Neurologist</SelectItem>
                  <SelectItem value="orthopedics">Orthopedic Surgeon</SelectItem>
                  <SelectItem value="gynecology">Gynecologist</SelectItem>
                  <SelectItem value="ophthalmology">Ophthalmologist</SelectItem>
                  <SelectItem value="ent">ENT Specialist</SelectItem>
                  <SelectItem value="unsure">Not sure (let system assign)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="medical-history">Relevant Medical History</Label>
              <Textarea
                id="medical-history"
                placeholder="Please share any relevant medical history, conditions, or allergies"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Input id="medications" placeholder="List any medications you are currently taking" />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="urgent" />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="urgent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is urgent (within 24 hours)
                </Label>
                <p className="text-sm text-muted-foreground">Check this box if you need immediate medical attention</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="advanced">
        <EnhancedSymptomAnalyzer />
      </TabsContent>
    </Tabs>
  )
}
