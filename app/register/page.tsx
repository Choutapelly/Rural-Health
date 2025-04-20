"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<string>("patient")
  const [specialties, setSpecialties] = useState<string[]>([
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Psychiatry",
    "Neurology",
    "Orthopedics",
    "Gynecology",
    "Ophthalmology",
    "ENT",
  ])

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam && (roleParam === "doctor" || roleParam === "patient")) {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would handle form submission and API calls here
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Heart className="h-6 w-6 text-rose-500" />
        <span className="text-xl font-bold">RuralHealth Connect</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join our platform to{" "}
            {role === "doctor" ? "volunteer your medical expertise" : "connect with healthcare professionals"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <RadioGroup defaultValue={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                <Label
                  htmlFor="patient"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Patient
                </Label>
              </div>
              <div>
                <RadioGroupItem value="doctor" id="doctor" className="peer sr-only" />
                <Label
                  htmlFor="doctor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Doctor
                </Label>
              </div>
            </RadioGroup>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            {role === "doctor" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="license">Medical License Number</Label>
                  <Input id="license" type="text" placeholder="License #" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty.toLowerCase().replace(/\s+/g, "-")}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="languages">Languages Spoken</Label>
                  <Input id="languages" type="text" placeholder="English, Spanish, etc." />
                </div>
              </>
            )}

            {role === "patient" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location (Village/Region)</Label>
                  <Input id="location" type="text" placeholder="Your location" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" required />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Log in
        </Link>
      </p>
    </div>
  )
}
