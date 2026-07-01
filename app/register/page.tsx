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
import { Heart, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<string>("patient")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [specialty, setSpecialty] = useState<string>("")
  const [specialties] = useState<string[]>([
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role,
        ...(role === "doctor" && {
          license: formData.get("license") as string,
          specialty: specialty || formData.get("specialty") as string,
          languages: formData.get("languages") as string,
        }),
        ...(role === "patient" && {
          location: formData.get("location") as string,
          dob: formData.get("dob") as string,
        }),
      }

      // Validate required fields
      if (!data.name || !data.email || !data.password) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      if (role === "doctor" && !data.license) {
        setError("Please fill in all doctor-specific fields")
        setLoading(false)
        return
      }

      if (role === "patient" && (!data.location || !data.dob)) {
        setError("Please fill in all patient-specific fields")
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Registration failed")
        setLoading(false)
        return
      }

      // Redirect to login page on success
      router.push("/login")
    } catch (err) {
      console.error("Registration error:", err)
      setError("An error occurred during registration. Please try again.")
      setLoading(false)
    }
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
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                <Label
                  htmlFor="patient"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  Patient
                </Label>
              </div>
              <div>
                <RadioGroupItem value="doctor" id="doctor" className="peer sr-only" />
                <Label
                  htmlFor="doctor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  Doctor
                </Label>
              </div>
            </RadioGroup>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={loading} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={loading} />
            </div>

            {role === "doctor" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="license">Medical License Number</Label>
                  <Input id="license" name="license" type="text" placeholder="License #" required disabled={loading} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="specialty">Specialty (Optional)</Label>
                  <Select value={specialty} onValueChange={setSpecialty} disabled={loading}>
                    <SelectTrigger id="specialty" name="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="languages">Languages Spoken</Label>
                  <Input id="languages" name="languages" type="text" placeholder="English, Spanish, etc." disabled={loading} />
                </div>
              </>
            )}

            {role === "patient" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location (Village/Region)</Label>
                  <Input id="location" name="location" type="text" placeholder="Your location" required disabled={loading} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" name="dob" type="date" required disabled={loading} />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
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
