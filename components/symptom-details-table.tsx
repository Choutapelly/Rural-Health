"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Search, ChevronDown, ChevronUp } from "lucide-react"
import type { PatientSymptomData, TimeRange, SymptomEntry } from "@/utils/chart-data"

type SymptomDetailsTableProps = {
  patientData: PatientSymptomData
  timeRange: TimeRange
  selectedSymptoms: string[]
}

export function SymptomDetailsTable({ patientData, timeRange, selectedSymptoms }: SymptomDetailsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"date" | "symptom" | "severity">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Get all symptom entries
  const getAllEntries = (): SymptomEntry[] => {
    const entries: SymptomEntry[] = []

    // If specific symptoms are selected, only include those
    const symptomsToInclude = selectedSymptoms.length > 0 ? selectedSymptoms : Object.keys(patientData.symptoms)

    symptomsToInclude.forEach((symptom) => {
      if (patientData.symptoms[symptom]) {
        entries.push(...patientData.symptoms[symptom])
      }
    })

    return entries
  }

  // Filter entries by time range and search term
  const getFilteredEntries = (): SymptomEntry[] => {
    const allEntries = getAllEntries()

    // Filter by time range
    const endDate = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30days":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90days":
        startDate.setDate(startDate.getDate() - 90)
        break
      case "6months":
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case "1year":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case "all":
        startDate = new Date(0) // Beginning of time
        break
    }

    const timeFiltered = allEntries.filter((entry) => entry.date >= startDate && entry.date <= endDate)

    // Filter by search term
    if (!searchTerm) return timeFiltered

    const searchLower = searchTerm.toLowerCase()
    return timeFiltered.filter(
      (entry) => entry.symptom.toLowerCase().includes(searchLower) || entry.notes?.toLowerCase().includes(searchLower),
    )
  }

  // Sort entries
  const getSortedEntries = (): SymptomEntry[] => {
    const filtered = getFilteredEntries()

    return filtered.sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
      }

      if (sortField === "symptom") {
        return sortDirection === "asc" ? a.symptom.localeCompare(b.symptom) : b.symptom.localeCompare(a.symptom)
      }

      // severity
      return sortDirection === "asc" ? a.severity - b.severity : b.severity - a.severity
    })
  }

  // Toggle sort direction or change sort field
  const handleSort = (field: "date" | "symptom" | "severity") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc") // Default to descending when changing fields
    }
  }

  // Get severity badge color
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-100 text-green-800"
    if (severity <= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-rose-100 text-rose-800"
  }

  const entries = getSortedEntries()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Details</CardTitle>
        <CardDescription>Detailed log of all recorded symptoms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms or notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center">
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("symptom")}>
                  <div className="flex items-center">
                    Symptom
                    {sortField === "symptom" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("severity")}>
                  <div className="flex items-center">
                    Severity
                    {sortField === "severity" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No symptom entries found
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {entry.date.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{entry.symptom}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                        {entry.severity}/10
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{entry.notes || "No notes"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-2 text-xs text-muted-foreground text-right">Showing {entries.length} entries</div>
      </CardContent>
    </Card>
  )
}
