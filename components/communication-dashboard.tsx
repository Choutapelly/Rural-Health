"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Video, Calendar, FileText, Bell, Settings } from "lucide-react"
import { SecureMessaging } from "./secure-messaging"
import { AppointmentScheduler } from "./appointment-scheduler"
import { PatientEducationResources } from "./patient-education-resources"

export function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState("messaging")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Communication Center</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className={activeTab === "messaging" ? "border-primary" : ""} onClick={() => setActiveTab("messaging")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secure Messaging</CardTitle>
            <MessageSquare
              className={`h-4 w-4 ${activeTab === "messaging" ? "text-primary" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
        <Card
          className={activeTab === "appointments" ? "border-primary" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar
              className={`h-4 w-4 ${activeTab === "appointments" ? "text-primary" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Upcoming appointment</p>
          </CardContent>
        </Card>
        <Card className={activeTab === "video" ? "border-primary" : ""} onClick={() => setActiveTab("video")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Consultations</CardTitle>
            <Video className={`h-4 w-4 ${activeTab === "video" ? "text-primary" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active sessions</p>
          </CardContent>
        </Card>
        <Card className={activeTab === "resources" ? "border-primary" : ""} onClick={() => setActiveTab("resources")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Education</CardTitle>
            <FileText className={`h-4 w-4 ${activeTab === "resources" ? "text-primary" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Available resources</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messaging
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="h-4 w-4 mr-2" />
            Video Calls
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-4">
          <SecureMessaging />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentScheduler />
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Consultations</CardTitle>
              <CardDescription>
                Connect face-to-face with your healthcare provider through secure video calls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-6 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Video Consultations</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any scheduled video consultations at the moment.
                </p>
                <Button onClick={() => setActiveTab("appointments")}>Schedule a Consultation</Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Past Video Consultations</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Dr. Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">May 15, 2023 - 10:00 AM</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Completed</Badge>
                      <Button variant="outline" size="sm">
                        View Summary
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Dr. Michael Chen</p>
                      <p className="text-sm text-muted-foreground">April 28, 2023 - 2:30 PM</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Completed</Badge>
                      <Button variant="outline" size="sm">
                        View Summary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <PatientEducationResources />
        </TabsContent>
      </Tabs>
    </div>
  )
}
