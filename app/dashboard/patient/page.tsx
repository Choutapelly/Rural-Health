"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, FileText, MessageSquare, Video, Bell, User, LogOut } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RequestConsultationForm } from "@/components/request-consultation-form"

export default function PatientDashboard() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Appointment Confirmed",
      description: "Your appointment with Dr. Sarah Johnson has been confirmed for tomorrow at 10:00 AM.",
      date: "1 hour ago",
      read: false,
    },
    {
      id: 2,
      title: "New Message",
      description: "Dr. Sarah Johnson sent you a message regarding your last consultation.",
      date: "Yesterday",
      read: true,
    },
  ])

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "confirmed",
    },
  ])

  const [pastAppointments, setPastAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Michael Chen",
      specialty: "General Practice",
      date: "May 15, 2023",
      time: "2:30 PM",
      status: "completed",
    },
    {
      id: 2,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "April 28, 2023",
      time: "11:15 AM",
      status: "completed",
    },
  ])

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      doctorName: "Dr. Michael Chen",
      date: "May 15, 2023",
      medications: [{ name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" }],
    },
    {
      id: 2,
      doctorName: "Dr. Sarah Johnson",
      date: "April 28, 2023",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
        { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "30 days" },
      ],
    },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
          <div className="flex items-center gap-2">
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
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{prescriptions.length}</p>
              <p className="text-xs text-muted-foreground">
                {prescriptions.length === 0 ? "No prescriptions" : `${prescriptions.length} prescriptions issued`}
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

        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="request">Request Consultation</TabsTrigger>
          </TabsList>

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
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${appointment.doctorName}`}
                              alt={appointment.doctorName}
                            />
                            <AvatarFallback>
                              {appointment.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                            <div className="mt-2 flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.date}</span>
                            </div>
                            <div className="mt-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
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
                        <Button size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Join Call
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
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${appointment.doctorName}`}
                              alt={appointment.doctorName}
                            />
                            <AvatarFallback>
                              {appointment.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                            <div className="mt-2 flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.date}</span>
                            </div>
                            <div className="mt-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
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
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Doctor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Prescriptions</h2>
            </div>
            {prescriptions.length === 0 ? (
              <p className="text-muted-foreground">You have no prescriptions.</p>
            ) : (
              prescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{prescription.doctorName}</CardTitle>
                    <CardDescription>Issued on {prescription.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="rounded-lg border p-3">
                          <div className="font-medium">
                            {medication.name} - {medication.dosage}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Take {medication.frequency} for {medication.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
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

          <TabsContent value="request" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Request a Consultation</CardTitle>
                <CardDescription>
                  Describe your symptoms and medical concerns to be connected with an appropriate doctor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequestConsultationForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </>
  )
}
