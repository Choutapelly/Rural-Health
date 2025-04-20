"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VideoIcon, Calendar, Users, MessageSquare } from "lucide-react"

interface GroupConsultationProps {
  title: string
  description?: string
  topic?: string
  date?: Date
  maxParticipants?: number
  doctorName?: string
  doctorSpecialty?: string
  doctorAvatar?: string
}

export function GroupConsultation({
  title = "Diabetes Management",
  description = "Monthly group session for diabetes management and support",
  topic = "Managing Blood Sugar During Holidays",
  date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  maxParticipants = 8,
  doctorName = "Dr. Sarah Johnson",
  doctorSpecialty = "Endocrinology",
  doctorAvatar = "/confident-scientist.png",
}: GroupConsultationProps) {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])

  // Mock patient data
  const patients = [
    { id: "p1", name: "Maria Gonzalez", age: 42, condition: "Type 2 Diabetes", avatar: "/thoughtful-artist.png" },
    { id: "p2", name: "John Smith", age: 65, condition: "Type 2 Diabetes", avatar: "/contemplative-elder.png" },
    { id: "p3", name: "Aisha Patel", age: 38, condition: "Gestational Diabetes", avatar: "/contemplative-artist.png" },
    { id: "p4", name: "Robert Chen", age: 57, condition: "Type 1 Diabetes", avatar: "/thoughtful-urbanite.png" },
    { id: "p5", name: "Elena Rodriguez", age: 29, condition: "Type 1 Diabetes", avatar: "/sunlit-smile.png" },
    { id: "p6", name: "James Wilson", age: 71, condition: "Type 2 Diabetes", avatar: "/thoughtful-elder.png" },
  ]

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId],
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button>
          <VideoIcon className="mr-2 h-4 w-4" />
          Start Group Consultation
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Consultation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Scheduled Date & Time</p>
                  <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Topic</p>
                  <p className="text-sm text-muted-foreground">{topic}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatients.length} selected / {maxParticipants} maximum
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={doctorAvatar || "/placeholder.svg"} alt={doctorName} />
                  <AvatarFallback>
                    {doctorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{doctorName}</p>
                  <p className="text-sm text-muted-foreground">{doctorSpecialty}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Invite Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="select">
              <TabsList className="mb-4">
                <TabsTrigger value="select">Select Patients</TabsTrigger>
                <TabsTrigger value="message">Invitation Message</TabsTrigger>
              </TabsList>

              <TabsContent value="select">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select patients to invite to this group consultation. You can select up to {maxParticipants}{" "}
                    participants.
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`patient-${patient.id}`}
                            checked={selectedPatients.includes(patient.id)}
                            onCheckedChange={() => togglePatientSelection(patient.id)}
                            disabled={
                              selectedPatients.length >= maxParticipants && !selectedPatients.includes(patient.id)
                            }
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Label htmlFor={`patient-${patient.id}`} className="text-sm font-medium cursor-pointer">
                              {patient.name}, {patient.age}
                            </Label>
                            <p className="text-xs text-muted-foreground">{patient.condition}</p>
                          </div>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {patient.condition.includes("Type 1")
                            ? "Type 1"
                            : patient.condition.includes("Type 2")
                              ? "Type 2"
                              : "Gestational"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button disabled={selectedPatients.length === 0}>
                      Send Invitations ({selectedPatients.length})
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="message">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Customize the invitation message that will be sent to selected patients.
                  </p>

                  <Textarea
                    className="min-h-[200px]"
                    defaultValue={`Dear Patient,

You are invited to join a group consultation on "${topic}" with ${doctorName}.

Date: ${formatDate(date)}
Duration: 60 minutes

This session will provide valuable information about managing diabetes and will include time for questions and discussion with other patients.

To join, please click the link in the email you will receive before the session.

Best regards,
Rural Health Telemedicine Team`}
                  />

                  <div className="flex justify-end">
                    <Button disabled={selectedPatients.length === 0}>Preview & Send</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
