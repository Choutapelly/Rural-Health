"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, CalendarIcon, Video, MessageSquare, AlertCircle } from "lucide-react"

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface Doctor {
  id: string
  name: string
  specialty: string
  avatar?: string
  availableDates: Date[]
}

export function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined)
  const [appointmentType, setAppointmentType] = useState<"video" | "messaging">("video")
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "/confident-scientist.png",
      availableDates: [
        new Date(2023, 5, 15),
        new Date(2023, 5, 16),
        new Date(2023, 5, 17),
        new Date(2023, 5, 20),
        new Date(2023, 5, 21),
      ],
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "General Practice",
      availableDates: [
        new Date(2023, 5, 15),
        new Date(2023, 5, 16),
        new Date(2023, 5, 18),
        new Date(2023, 5, 19),
        new Date(2023, 5, 22),
      ],
    },
    {
      id: "3",
      name: "Dr. Lisa Rodriguez",
      specialty: "Endocrinology",
      availableDates: [
        new Date(2023, 5, 17),
        new Date(2023, 5, 18),
        new Date(2023, 5, 19),
        new Date(2023, 5, 23),
        new Date(2023, 5, 24),
      ],
    },
  ]

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "9:00 AM", available: true },
    { id: "2", time: "10:00 AM", available: true },
    { id: "3", time: "11:00 AM", available: false },
    { id: "4", time: "1:00 PM", available: true },
    { id: "5", time: "2:00 PM", available: true },
    { id: "6", time: "3:00 PM", available: false },
    { id: "7", time: "4:00 PM", available: true },
  ]

  const handleConfirmAppointment = () => {
    setIsConfirming(true)
    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false)
      setIsConfirmed(true)
    }, 1500)
  }

  const resetForm = () => {
    setSelectedDate(undefined)
    setSelectedDoctor(undefined)
    setSelectedTimeSlot(undefined)
    setIsConfirmed(false)
  }

  const selectedDoctorData = doctors.find((doctor) => doctor.id === selectedDoctor)

  if (isConfirmed) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
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
          <h3 className="text-xl font-semibold mb-2">Appointment Confirmed</h3>
          <p className="text-muted-foreground mb-6">Your appointment has been scheduled successfully.</p>
          <div className="bg-muted p-4 rounded-lg w-full max-w-md mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedDoctorData?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedDoctorData?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedDoctorData?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedDoctorData?.specialty}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                {appointmentType === "video" ? (
                  <Video className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{appointmentType === "video" ? "Video Consultation" : "Messaging Consultation"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm}>
              Schedule Another
            </Button>
            <Button>View My Appointments</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
        <CardDescription>Choose a doctor, date, and time for your consultation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="doctor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="doctor">1. Select Doctor</TabsTrigger>
            <TabsTrigger value="date" disabled={!selectedDoctor}>
              2. Select Date & Time
            </TabsTrigger>
            <TabsTrigger value="confirm" disabled={!selectedDate || !selectedTimeSlot}>
              3. Confirm Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctor" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Specialty</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="general">General Practice</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Available Doctors</label>
                <div className="space-y-2">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDoctor === doctor.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedDoctor(doctor.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="date" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium block mb-2">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    // Disable dates in the past
                    if (date < new Date()) return true
                    // Disable dates not in the doctor's available dates
                    if (!selectedDoctor) return true
                    const doctorData = doctors.find((d) => d.id === selectedDoctor)
                    if (!doctorData) return true
                    return !doctorData.availableDates.some((d) => d.toDateString() === date.toDateString())
                  }}
                  className="border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Select Time</label>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 border rounded-md text-center cursor-pointer transition-colors ${
                          !slot.available
                            ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                            : selectedTimeSlot === slot.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          if (slot.available) {
                            setSelectedTimeSlot(slot.id)
                          }
                        }}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Appointment Type</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    appointmentType === "video" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setAppointmentType("video")}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <Video className="h-8 w-8 text-primary" />
                    <p className="font-medium">Video Consultation</p>
                    <p className="text-sm text-muted-foreground">Face-to-face virtual appointment with your doctor</p>
                  </div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    appointmentType === "messaging" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setAppointmentType("messaging")}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <p className="font-medium">Messaging Consultation</p>
                    <p className="text-sm text-muted-foreground">Communicate with your doctor via secure messaging</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Appointment Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedDoctorData?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedDoctorData?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedDoctorData?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedDoctorData?.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  {appointmentType === "video" ? (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{appointmentType === "video" ? "Video Consultation" : "Messaging Consultation"}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700">Important Information</p>
                  <ul className="text-sm text-yellow-600 list-disc list-inside space-y-1 mt-1">
                    <li>Please be available 5 minutes before your scheduled time</li>
                    <li>Ensure you have a stable internet connection for video consultations</li>
                    <li>Have your medical history and current medications list ready</li>
                    <li>You can cancel or reschedule up to 24 hours before the appointment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Visit (Optional)</label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Briefly describe your symptoms or reason for consultation..."
              ></textarea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirmAppointment}
          disabled={!selectedDoctor || !selectedDate || !selectedTimeSlot || isConfirming}
        >
          {isConfirming ? "Confirming..." : "Confirm Appointment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
