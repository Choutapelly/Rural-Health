"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Users, Activity, Map, CheckCircle, XCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      location: "London, UK",
      status: "active",
      patients: 24,
      consultations: 156,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "General Practice",
      location: "Toronto, Canada",
      status: "active",
      patients: 18,
      consultations: 89,
    },
    {
      id: 3,
      name: "Dr. Aisha Patel",
      specialty: "Pediatrics",
      location: "Mumbai, India",
      status: "pending",
      patients: 0,
      consultations: 0,
    },
  ])

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Maria Gonzalez",
      location: "Rural Mexico",
      age: 42,
      status: "active",
      consultations: 3,
    },
    {
      id: 2,
      name: "John Smith",
      location: "Rural Kenya",
      age: 58,
      status: "active",
      consultations: 5,
    },
    {
      id: 3,
      name: "Raj Patel",
      location: "Rural India",
      age: 35,
      status: "active",
      consultations: 1,
    },
  ])

  const [pendingDoctors, setPendingDoctors] = useState([
    {
      id: 3,
      name: "Dr. Aisha Patel",
      specialty: "Pediatrics",
      location: "Mumbai, India",
      licenseNumber: "MCI-12345",
      status: "pending",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Neurology",
      location: "Sydney, Australia",
      licenseNumber: "AMC-67890",
      status: "pending",
    },
  ])

  const [consultations, setConsultations] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      patient: "Maria Gonzalez",
      date: "May 20, 2023",
      status: "completed",
      duration: "25 minutes",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      patient: "John Smith",
      date: "May 18, 2023",
      status: "completed",
      duration: "35 minutes",
    },
    {
      id: 3,
      doctor: "Dr. Sarah Johnson",
      patient: "John Smith",
      date: "Tomorrow",
      status: "scheduled",
      time: "10:00 AM",
    },
  ])

  const approveDoctor = (id) => {
    // In a real app, we would handle the API call here
    setPendingDoctors(pendingDoctors.filter((doctor) => doctor.id !== id))
    // Update doctors list
  }

  const rejectDoctor = (id) => {
    // In a real app, we would handle the API call here
    setPendingDoctors(pendingDoctors.filter((doctor) => doctor.id !== id))
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{doctors.filter((d) => d.status === "active").length}</p>
              <p className="text-xs text-muted-foreground">{pendingDoctors.length} pending approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{patients.length}</p>
              <p className="text-xs text-muted-foreground">
                From {new Set(patients.map((p) => p.location.split(",")[0])).size} different regions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{consultations.length}</p>
              <p className="text-xs text-muted-foreground">
                {consultations.filter((c) => c.status === "completed").length} completed,{" "}
                {consultations.filter((c) => c.status === "scheduled").length} scheduled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regions Served</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{new Set(patients.map((p) => p.location.split(",")[0])).size}</p>
              <p className="text-xs text-muted-foreground">
                Across {new Set(patients.map((p) => p.location.split(",")[1]?.trim())).size} countries
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="doctors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="approvals">Doctor Approvals</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-6 p-4 font-medium border-b">
                <div className="col-span-2">Name</div>
                <div>Specialty</div>
                <div>Location</div>
                <div>Patients</div>
                <div>Status</div>
              </div>
              {doctors.map((doctor) => (
                <div key={doctor.id} className="grid grid-cols-6 p-4 border-b last:border-0 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?height=32&width=32&query=${doctor.name}`}
                        alt={doctor.name}
                      />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{doctor.name}</span>
                  </div>
                  <div>{doctor.specialty}</div>
                  <div>{doctor.location}</div>
                  <div>{doctor.patients}</div>
                  <div>
                    <Badge variant={doctor.status === "active" ? "default" : "outline"}>{doctor.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium border-b">
                <div className="col-span-2">Name</div>
                <div>Location</div>
                <div>Age</div>
                <div>Consultations</div>
              </div>
              {patients.map((patient) => (
                <div key={patient.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?height=32&width=32&query=${patient.name}`}
                        alt={patient.name}
                      />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{patient.name}</span>
                  </div>
                  <div>{patient.location}</div>
                  <div>{patient.age}</div>
                  <div>{patient.consultations}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium border-b">
                <div>Doctor</div>
                <div>Patient</div>
                <div>Date</div>
                <div>Duration</div>
                <div>Status</div>
              </div>
              {consultations.map((consultation) => (
                <div key={consultation.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                  <div>{consultation.doctor}</div>
                  <div>{consultation.patient}</div>
                  <div>
                    {consultation.date} {consultation.time ? `at ${consultation.time}` : ""}
                  </div>
                  <div>{consultation.duration || "N/A"}</div>
                  <div>
                    <Badge variant={consultation.status === "completed" ? "default" : "outline"}>
                      {consultation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Pending Doctor Approvals</h2>
              {pendingDoctors.length === 0 ? (
                <p className="text-muted-foreground">No pending doctor approvals.</p>
              ) : (
                pendingDoctors.map((doctor) => (
                  <Card key={doctor.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${doctor.name}`}
                              alt={doctor.name}
                            />
                            <AvatarFallback>
                              {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            <p className="text-sm text-muted-foreground">{doctor.location}</p>
                            <p className="mt-2 text-sm">License Number: {doctor.licenseNumber}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{doctor.status}</Badge>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => rejectDoctor(doctor.id)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => approveDoctor(doctor.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </>
  )
}
