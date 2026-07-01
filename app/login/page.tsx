"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<string>("patient")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      // For demo purposes, we'll simulate login with demo accounts
      // In production, this would call a real authentication endpoint
      const isDemoAccount = (email === "doctor@example.com" || email === "patient@example.com" || email === "admin@example.com")
      
      if (isDemoAccount && password === "password") {
        // Simulate successful login - in production this would be real auth
        console.log("[v0] Demo login successful for:", email)
        
        // Store session info (in production, this would be handled by NextAuth)
        if (typeof window !== 'undefined') {
          localStorage.setItem("user_email", email)
          localStorage.setItem("user_role", role)
        }
        
        router.push(`/dashboard/${role}`)
      } else {
        // Demo credentials: doctor@example.com / patient@example.com / admin@example.com with password "password"
        setError("Invalid credentials. Use demo account: doctor@example.com, patient@example.com, or admin@example.com with password 'password'")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
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
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="patient" id="patient-login" className="peer sr-only" />
                <Label
                  htmlFor="patient-login"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  Patient
                </Label>
              </div>
              <div>
                <RadioGroupItem value="doctor" id="doctor-login" className="peer sr-only" />
                <Label
                  htmlFor="doctor-login"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  Doctor
                </Label>
              </div>
              <div>
                <RadioGroupItem value="admin" id="admin-login" className="peer sr-only" />
                <Label
                  htmlFor="admin-login"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  Admin
                </Label>
              </div>
            </RadioGroup>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="doctor@example.com" required disabled={loading} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="password" required disabled={loading} />
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </p>
    </div>
  )
}
