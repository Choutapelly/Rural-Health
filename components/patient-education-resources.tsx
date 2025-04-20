"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, Bookmark, Share2, Download, Search, ExternalLink } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "article" | "video" | "infographic" | "pdf"
  category: string[]
  thumbnail?: string
  url: string
  duration?: string
  saved?: boolean
}

export function PatientEducationResources() {
  const [searchQuery, setSearchQuery] = useState("")
  const [savedResources, setSavedResources] = useState<string[]>([])

  const resources: Resource[] = [
    {
      id: "1",
      title: "Understanding Hypertension: Causes and Management",
      description: "Learn about the causes of high blood pressure and strategies to manage it effectively.",
      type: "article",
      category: ["Cardiovascular", "Chronic Conditions"],
      url: "#",
    },
    {
      id: "2",
      title: "Diabetes Self-Management: Daily Care Tips",
      description: "Practical advice for managing diabetes through diet, exercise, and medication.",
      type: "video",
      category: ["Diabetes", "Chronic Conditions"],
      thumbnail: "/healthy-living-diabetes.png",
      url: "#",
      duration: "12:45",
    },
    {
      id: "3",
      title: "Healthy Eating for Rural Communities",
      description: "Nutritional guidance tailored to food options commonly available in rural areas.",
      type: "infographic",
      category: ["Nutrition", "Preventive Care"],
      thumbnail: "/balanced-nutrition-guide.png",
      url: "#",
    },
    {
      id: "4",
      title: "Managing Chronic Pain Without Opioids",
      description: "Alternative approaches to pain management for chronic conditions.",
      type: "article",
      category: ["Pain Management", "Chronic Conditions"],
      url: "#",
    },
    {
      id: "5",
      title: "Recognizing Signs of Heart Attack and Stroke",
      description: "Emergency guide to identifying symptoms that require immediate medical attention.",
      type: "pdf",
      category: ["Emergency Care", "Cardiovascular"],
      url: "#",
    },
    {
      id: "6",
      title: "Medication Adherence: Why It Matters",
      description: "Understanding the importance of taking medications as prescribed.",
      type: "video",
      category: ["Medication Management", "Patient Safety"],
      thumbnail: "/pills-and-calendar.png",
      url: "#",
      duration: "8:20",
    },
  ]

  const toggleSaved = (resourceId: string) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter((id) => id !== resourceId))
    } else {
      setSavedResources([...savedResources, resourceId])
    }
  }

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getResourcesByCategory = (category: string) => {
    return filteredResources.filter((resource) => resource.category.includes(category))
  }

  const getSavedResources = () => {
    return filteredResources.filter((resource) => savedResources.includes(resource.id))
  }

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <Card>
      <CardContent className="p-4">
        {resource.thumbnail && (
          <div className="mb-3 relative rounded-md overflow-hidden">
            <img src={resource.thumbnail || "/placeholder.svg"} alt={resource.title} className="w-full h-auto" />
            {resource.type === "video" && resource.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {resource.duration}
              </div>
            )}
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{resource.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {resource.category.map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                {resource.type === "article" ? (
                  <FileText className="h-3 w-3" />
                ) : resource.type === "video" ? (
                  <Video className="h-3 w-3" />
                ) : resource.type === "pdf" ? (
                  <FileText className="h-3 w-3" />
                ) : (
                  <FileText className="h-3 w-3" />
                )}
                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={savedResources.includes(resource.id) ? "text-yellow-500" : ""}
            onClick={() => toggleSaved(resource.id)}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-2 border-t">
        <Button variant="ghost" size="sm" className="text-xs">
          <Share2 className="h-3 w-3 mr-1" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <Download className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          Open
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="chronic">Chronic Conditions</TabsTrigger>
          <TabsTrigger value="preventive">Preventive Care</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedResources.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No resources found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chronic" className="space-y-4">
          {getResourcesByCategory("Chronic Conditions").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No chronic condition resources found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getResourcesByCategory("Chronic Conditions").map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preventive" className="space-y-4">
          {getResourcesByCategory("Preventive Care").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No preventive care resources found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getResourcesByCategory("Preventive Care").map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {getSavedResources().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No saved resources yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click the bookmark icon on any resource to save it for later.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getSavedResources().map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
