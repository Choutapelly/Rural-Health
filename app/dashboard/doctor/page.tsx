"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, FileText, MessageSquare, Video, Bell, User, LogOut, BarChart2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PrescriptionForm } from "@/components/prescription-form"
import Link from "next/link"

export default function DoctorDashboard() {
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      patientName: "Maria Gonzalez",
      age: 42,
      location: "Rural Mexico",
      symptoms: "Chest pain, shortness of breath, fatigue",
      urgency: "high",
      requestedDate: "2 hours ago",
    },
    {
      id: 2,
      patientName: "Raj Patel",
      age: 35,
      location: "Rural India",
      symptoms: "Persistent cough, mild fever for 5 days",
      urgency: "medium",
      requestedDate: "Yesterday",
    },
  ])

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      patientName: "John Smith",
      age: 58,
      location: "Rural Kenya",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "confirmed",
      reason: "Follow-up on hypertension medication",
    },
  ])

  const [pastAppointments, setPastAppointments] = useState([
    {
      id: 1,
      patientName: "Emily Chen",
      age: 29,
      location: "Rural Philippines",
      date: "May 15, 2023",
      time: "2:30 PM",
      status: "completed",
      diagnosis: "Allergic rhinitis",
    },
    {
      id: 2,
      patientName: "David Okafor",
      age: 45,
      location: "Rural Nigeria",
      date: "April 28, 2023",
      time: "11:15 AM",
      status: "completed",
      diagnosis: "Type 2 diabetes",
    },
  ])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Consultation Request",
      description: "Maria Gonzalez has requested a consultation for chest pain.",
      date: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      description: "You have an appointment with John Smith tomorrow at 10:00 AM.",
      date: "Yesterday",
      read: true,
    },
  ])

  const acceptRequest = (id) => {
    // In a real app, we would handle the API call here
    setPendingRequests(pendingRequests.filter((request) => request.id !== id))
    // Add to upcoming appointments
  }

  const declineRequest = (id) => {
    // In a real app, we would handle the API call here
    setPendingRequests(pendingRequests.filter((request) => request.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/doctor/symptom-dashboard">
              <Button variant="outline" size="sm">
                <BarChart2 className="h-4 w-4 mr-2" />
                Symptom Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/doctor/symptom-visualization">
              <Button variant="outline" size="sm">
                <BarChart2 className="h-4 w-4 mr-2" />
                Symptom Visualization
              </Button>
            </Link>
            <Link href="/dashboard/doctor/patient-timeline?patientId=p1">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Patient Timeline
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </Button>
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
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length === 0
                  ? "No pending requests"
                  : pendingRequests.length === 1
                    ? "1 patient waiting"
                    : `${pendingRequests.length} patients waiting`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
              <p className="text-xs text-muted-foreground">
                {upcomingAppointments.length === 0
                  ? "No upcoming appointments"
                  : upcomingAppointments.length === 1
                    ? "1 appointment scheduled"
                    : `${upcomingAppointments.length} appointments scheduled`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Consultations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pastAppointments.length}</p>
              <p className="text-xs text-muted-foreground">
                {pastAppointments.length === 0
                  ? "No past consultations"
                  : `${pastAppointments.length} consultations completed`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{notifications.filter((n) => !n.read).length}</p>
              <p className="text-xs text-muted-foreground">
                {notifications.filter((n) => !n.read).length === 0
                  ? "No unread notifications"
                  : `${notifications.filter((n) => !n.read).length} unread notifications`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Consultation Requests</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Write Prescription</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Pending Consultation Requests</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-muted-foreground">You have no pending consultation requests.</p>
              ) : (
                pendingRequests.map((request) => (
                  <Card
                    key={request.id}
                    className={request.urgency === "high" ? "border-rose-200 bg-rose-50 dark:bg-rose-950/10" : ""}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${request.patientName}`}
                              alt={request.patientName}
                            />
                            <AvatarFallback>
                              {request.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {request.patientName}, {request.age}
                            </p>
                            <p className="text-sm text-muted-foreground">{request.location}</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Symptoms:</p>
                              <p className="text-sm text-muted-foreground">{request.symptoms}</p>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">Requested {request.requestedDate}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            request.urgency === "high"
                              ? "destructive"
                              : request.urgency === "medium"
                                ? "default"
                                : "outline"
                          }
                        >
                          {request.urgency === "high" ? "Urgent" : request.urgency === "medium" ? "Medium" : "Low"}{" "}
                          Priority
                        </Badge>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => declineRequest(request.id)}>
                          Decline
                        </Button>
                        <Button size="sm" onClick={() => acceptRequest(request.id)}>
                          Accept Request
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted-foreground">You have no upcoming appointments.</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${appointment.patientName}`}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {appointment.patientName}, {appointment.age}
                            </p>
                            <p className="text-sm text-muted-foreground">{appointment.location}</p>
                            <div className="mt-2 flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.date}</span>
                            </div>
                            <div className="mt-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Reason:</p>
                              <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                          {appointment.status === "confirmed" ? "Confirmed" : appointment.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        <Link href="/dashboard/doctor/symptom-dashboard">
                          <Button variant="outline" size="sm">
                            <BarChart2 className="mr-2 h-4 w-4" />
                            View Symptoms
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Patient Records
                        </Button>
                        <Button size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Start Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <h2 className="text-xl font-semibold mt-6">Past Appointments</h2>
              {pastAppointments.length === 0 ? (
                <p className="text-muted-foreground">You have no past appointments.</p>
              ) : (
                pastAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${appointment.patientName}`}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {appointment.patientName}, {appointment.age}
                            </p>
                            <p className="text-sm text-muted-foreground">{appointment.location}</p>
                            <div className="mt-2 flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.date}</span>
                            </div>
                            <div className="mt-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Diagnosis:</p>
                              <p className="text-sm text-muted-foreground">{appointment.diagnosis}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{appointment.status}</Badge>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Summary
                        </Button>
                        <Link href="/dashboard/doctor/symptom-dashboard">
                          <Button variant="outline" size="sm">
                            <BarChart2 className="mr-2 h-4 w-4" />
                            View Symptoms
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Patient
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Write a Prescription</CardTitle>
                <CardDescription>Create a digital prescription for your patient</CardDescription>
              </CardHeader>
              <CardContent>
                <PrescriptionForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Notifications</h2>
              {notifications.some((n) => !n.read) && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-muted-foreground">You have no notifications.</p>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={notification.read ? "" : "border-rose-200 bg-rose-50 dark:bg-rose-950/10"}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                      {!notification.read && (
                        <Badge variant="default" className="bg-rose-500">
                          New
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </>
  )
}
