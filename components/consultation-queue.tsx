"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Calendar,
  Video,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Consultation {
  id: string
  patientName: string
  patientAge: number
  patientLocation: string
  patientAvatar?: string
  scheduledTime: Date
  status: "scheduled" | "waiting" | "in-progress" | "completed" | "cancelled"
  type: "video" | "messaging"
  reason: string
  priority: "routine" | "urgent" | "emergency"
}

export function ConsultationQueue() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  const consultations: Consultation[] = [
    {
      id: "1",
      patientName: "Maria Gonzalez",
      patientAge: 42,
      patientLocation: "Rural Mexico",
      patientAvatar: "/thoughtful-artist.png",
      scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      status: "scheduled",
      type: "video",
      reason: "Chest pain, shortness of breath, fatigue",
      priority: "urgent",
    },
    {
      id: "2",
      patientName: "John Smith",
      patientAge: 65,
      patientLocation: "Rural Arizona",
      scheduledTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: "waiting",
      type: "video",
      reason: "Follow-up for hypertension medication adjustment",
      priority: "routine",
    },
    {
      id: "3",
      patientName: "Emily Johnson",
      patientAge: 35,
      patientLocation: "Rural Montana",
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      status: "scheduled",
      type: "messaging",
      reason: "Skin rash and itching for 2 weeks",
      priority: "routine",
    },
    {
      id: "4",
      patientName: "Robert Garcia",
      patientAge: 58,
      patientLocation: "Rural New Mexico",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: "scheduled",
      type: "video",
      reason: "Diabetic foot ulcer follow-up",
      priority: "urgent",
    },
    {
      id: "5",
      patientName: "Sarah Williams",
      patientAge: 29,
      patientLocation: "Rural Kentucky",
      scheduledTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: "in-progress",
      type: "video",
      reason: "Pregnancy check-up, 28 weeks",
      priority: "routine",
    },
    {
      id: "6",
      patientName: "David Lee",
      patientAge: 72,
      patientLocation: "Rural Maine",
      scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "completed",
      type: "video",
      reason: "COPD exacerbation, follow-up",
      priority: "urgent",
    },
  ]

  // Filter consultations based on tab and search
  const filteredConsultations = consultations
    .filter((consultation) => {
      // Filter by tab
      if (activeTab === "upcoming" && (consultation.status === "scheduled" || consultation.status === "waiting")) {
        return true
      } else if (activeTab === "active" && consultation.status === "in-progress") {
        return true
      } else if (
        activeTab === "completed" &&
        (consultation.status === "completed" || consultation.status === "cancelled")
      ) {
        return true
      } else if (activeTab !== "upcoming" && activeTab !== "active" && activeTab !== "completed") {
        return true
      }

      return false
    })
    .filter((consultation) => {
      // Filter by search
      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()
      return (
        consultation.patientName.toLowerCase().includes(query) ||
        consultation.reason.toLowerCase().includes(query) ||
        consultation.patientLocation.toLowerCase().includes(query)
      )
    })

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date
  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    }
  }

  // Get status badge
  const getStatusBadge = (status: Consultation["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheduled
          </Badge>
        )
      case "waiting":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Waiting
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: Consultation["priority"]) => {
    switch (priority) {
      case "routine":
        return null // No badge for routine
      case "urgent":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Urgent
          </Badge>
        )
      case "emergency":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Emergency
          </Badge>
        )
    }
  }

  // Start consultation
  const startConsultation = (consultationId: string) => {
    router.push(`/video-consultation/${consultationId}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Consultation Queue</CardTitle>
            <CardDescription>Manage your upcoming and active consultations</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="active">
              <Video className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>

          <div className="space-y-2">
            {filteredConsultations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No consultations found</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming consultations scheduled."
                    : activeTab === "active"
                      ? "You don't have any active consultations at the moment."
                      : "You don't have any completed consultations yet."}
                </p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={consultation.patientAvatar || "/placeholder.svg"}
                          alt={consultation.patientName}
                        />
                        <AvatarFallback>
                          {consultation.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{consultation.patientName}</p>
                          {getPriorityBadge(consultation.priority)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{consultation.patientAge} years</span>
                          <span>•</span>
                          <span>{consultation.patientLocation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(consultation.status)}
                      <Badge
                        variant="outline"
                        className={
                          consultation.type === "video"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }
                      >
                        {consultation.type === "video" ? (
                          <Video className="h-3 w-3 mr-1" />
                        ) : (
                          <MessageSquare className="h-3 w-3 mr-1" />
                        )}
                        {consultation.type === "video" ? "Video" : "Messaging"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Medical Records</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel Consultation</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-3 grid md:grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(consultation.scheduledTime)} at {formatTime(consultation.scheduledTime)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end">
                      {consultation.status === "waiting" && (
                        <Button onClick={() => startConsultation(consultation.id)}>Start Consultation</Button>
                      )}
                      {consultation.status === "scheduled" && (
                        <Button variant="outline" onClick={() => startConsultation(consultation.id)}>
                          Join Early
                        </Button>
                      )}
                      {consultation.status === "in-progress" && (
                        <Button onClick={() => startConsultation(consultation.id)}>Rejoin Consultation</Button>
                      )}
                      {consultation.status === "completed" && <Button variant="outline">View Summary</Button>}
                      {(consultation.status === "scheduled" || consultation.status === "waiting") && (
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Calendar</Button>
        <Button>Schedule New Consultation</Button>
      </CardFooter>
    </Card>
  )
}
