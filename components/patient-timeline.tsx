"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  type TimelineEvent,
  filterTimelineEvents,
  groupTimelineEventsByDate,
  groupTimelineEventsByMonth,
  findRelatedEvents,
} from "@/utils/timeline-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PatientTimelineProps {
  events: TimelineEvent[]
  patientName: string
}

export function PatientTimeline({ events, patientName }: PatientTimelineProps) {
  const [view, setView] = useState<"detailed" | "compact">("detailed")
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({})
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  // Available categories
  const categories = [
    { id: "symptom", label: "Symptoms" },
    { id: "condition", label: "Conditions" },
    { id: "medication", label: "Medications" },
    { id: "lab", label: "Lab Results" },
    { id: "vital", label: "Vital Signs" },
    { id: "note", label: "Clinical Notes" },
  ]

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return filterTimelineEvents(events, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      startDate,
      endDate,
      searchTerm,
    })
  }, [events, selectedCategories, startDate, endDate, searchTerm])

  // Group events by date or month depending on view
  const groupedEvents = useMemo(() => {
    return view === "detailed" ? groupTimelineEventsByDate(filteredEvents) : groupTimelineEventsByMonth(filteredEvents)
  }, [filteredEvents, view])

  // Sort dates in descending order (most recent first)
  const sortedDates = useMemo(() => {
    return Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a))
  }, [groupedEvents])

  // Toggle date expansion
  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }))
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedCategories([])
  }

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Get event icon and color based on type
  const getEventStyle = (event: TimelineEvent): { icon: React.ReactNode; color: string } => {
    switch (event.type) {
      case "symptom_report":
        return {
          icon: "🤒",
          color: "bg-rose-100 text-rose-800 border-rose-200",
        }
      case "condition_diagnosis":
        return {
          icon: "🏥",
          color: "bg-purple-100 text-purple-800 border-purple-200",
        }
      case "medication_started":
        return {
          icon: "💊",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "medication_stopped":
        return {
          icon: "🛑",
          color: "bg-orange-100 text-orange-800 border-orange-200",
        }
      case "medication_changed":
        return {
          icon: "⚙️",
          color: "bg-cyan-100 text-cyan-800 border-cyan-200",
        }
      case "lab_result":
        return {
          icon: "🧪",
          color: "bg-amber-100 text-amber-800 border-amber-200",
        }
      case "vital_sign":
        return {
          icon: "📊",
          color: "bg-green-100 text-green-800 border-green-200",
        }
      case "appointment":
        return {
          icon: "📅",
          color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        }
      case "note":
        return {
          icon: "📝",
          color: "bg-gray-100 text-gray-800 border-gray-200",
        }
      default:
        return {
          icon: "❓",
          color: "bg-gray-100 text-gray-800 border-gray-200",
        }
    }
  }

  // Format date for display
  const formatDateHeader = (dateKey: string) => {
    if (view === "detailed") {
      const date = new Date(dateKey)
      return format(date, "MMMM d, yyyy")
    } else {
      const [year, month] = dateKey.split("-")
      return format(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1), "MMMM yyyy")
    }
  }

  // Find related events for the selected event
  const relatedEvents = useMemo(() => {
    if (!selectedEvent) return []
    return findRelatedEvents(selectedEvent, events)
  }, [selectedEvent, events])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Patient Timeline</CardTitle>
            <CardDescription>Chronological view of {patientName}'s health journey</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v as "detailed" | "compact")} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="compact">Compact</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search timeline..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filter Timeline</h4>
                      <p className="text-sm text-muted-foreground">Show or hide specific types of events</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="space-y-2">
                        <Label>Categories</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => toggleCategory(category.id)}
                              />
                              <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !endDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Filter indicators */}
              {selectedCategories.length > 0 && (
                <Badge variant="outline" className="h-9 px-3">
                  {selectedCategories.length} categories
                </Badge>
              )}
              {startDate && (
                <Badge variant="outline" className="h-9 px-3">
                  From: {format(startDate, "MMM d, yyyy")}
                </Badge>
              )}
              {endDate && (
                <Badge variant="outline" className="h-9 px-3">
                  To: {format(endDate, "MMM d, yyyy")}
                </Badge>
              )}
              {(selectedCategories.length > 0 || startDate || endDate) && (
                <Button variant="ghost" size="icon" onClick={resetFilters} className="h-9 w-9">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events found matching your filters.</p>
              </div>
            ) : (
              sortedDates.map((dateKey) => (
                <div key={dateKey} className="border rounded-lg">
                  <div
                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleDateExpansion(dateKey)}
                  >
                    <div className="font-medium">{formatDateHeader(dateKey)}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{groupedEvents[dateKey].length} events</Badge>
                      {expandedDates[dateKey] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>

                  {expandedDates[dateKey] && (
                    <div className="p-3 pt-0 border-t">
                      <div className="relative pl-6 border-l-2 border-muted space-y-4 py-2">
                        {groupedEvents[dateKey].map((event, index) => {
                          const { icon, color } = getEventStyle(event)
                          return (
                            <div key={event.id} className="relative">
                              <div className="absolute -left-[22px] top-0 w-10 h-10 flex items-center justify-center rounded-full bg-background border-2 border-muted">
                                <span className="text-lg">{icon}</span>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div
                                    className={`ml-4 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${color}`}
                                    onClick={() => setSelectedEvent(event)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="font-medium">{event.title}</div>
                                      <div className="text-xs">
                                        {view === "detailed"
                                          ? format(event.date, "h:mm a")
                                          : format(event.date, "MMM d, yyyy")}
                                      </div>
                                    </div>
                                    <p className="text-sm mt-1">{event.description}</p>
                                    {event.status && (
                                      <Badge variant="outline" className="mt-2">
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                      </Badge>
                                    )}
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>{event.title}</DialogTitle>
                                    <DialogDescription>
                                      {format(event.date, "MMMM d, yyyy 'at' h:mm a")}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium">Description</h4>
                                      <p className="mt-1">{event.description}</p>
                                    </div>

                                    {event.status && (
                                      <div>
                                        <h4 className="text-sm font-medium">Status</h4>
                                        <Badge variant="outline" className="mt-1">
                                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </Badge>
                                      </div>
                                    )}

                                    {event.severity !== undefined && (
                                      <div>
                                        <h4 className="text-sm font-medium">Severity</h4>
                                        <p className="mt-1">{event.severity}/10</p>
                                      </div>
                                    )}

                                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-medium">Additional Information</h4>
                                        <div className="mt-1 space-y-1">
                                          {Object.entries(event.metadata).map(
                                            ([key, value]) =>
                                              // Skip certain metadata fields that are already displayed
                                              !["symptomName", "severity", "notes"].includes(key) &&
                                              typeof value !== "object" && (
                                                <div key={key} className="grid grid-cols-2">
                                                  <span className="text-sm text-muted-foreground">
                                                    {key.charAt(0).toUpperCase() +
                                                      key.slice(1).replace(/([A-Z])/g, " $1")}
                                                  </span>
                                                  <span className="text-sm">{String(value)}</span>
                                                </div>
                                              ),
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {relatedEvents.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-medium">Related Events</h4>
                                        <ScrollArea className="h-[200px] mt-1">
                                          <div className="space-y-2">
                                            {relatedEvents.map((relatedEvent) => {
                                              const { icon, color } = getEventStyle(relatedEvent)
                                              return (
                                                <div key={relatedEvent.id} className={`p-2 rounded-md border ${color}`}>
                                                  <div className="flex items-center gap-2">
                                                    <span>{icon}</span>
                                                    <div>
                                                      <div className="font-medium text-sm">{relatedEvent.title}</div>
                                                      <div className="text-xs">
                                                        {format(relatedEvent.date, "MMM d, yyyy")}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </ScrollArea>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
            {selectedCategories.length > 0 &&
              ` in ${selectedCategories.length} ${selectedCategories.length === 1 ? "category" : "categories"}`}
            {startDate && ` from ${format(startDate, "MMM d, yyyy")}`}
            {endDate && ` to ${format(endDate, "MMM d, yyyy")}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
