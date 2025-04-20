"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MicOff, Pin, PinOff, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Participant } from "./participant-management"

interface VideoParticipantGridProps {
  participants: Participant[]
  onTogglePin: (id: string) => void
  onMaximizeParticipant?: (id: string) => void
  className?: string
}

export function VideoParticipantGrid({
  participants,
  onTogglePin,
  onMaximizeParticipant,
  className,
}: VideoParticipantGridProps) {
  const [layout, setLayout] = useState<"auto" | "spotlight" | "grid">("auto")
  const [maximizedParticipant, setMaximizedParticipant] = useState<string | null>(null)

  // Determine the best layout based on participant count
  useEffect(() => {
    if (participants.length <= 2) {
      setLayout("spotlight")
    } else if (participants.length <= 4) {
      setLayout("grid")
    } else {
      setLayout("spotlight") // Default to spotlight for many participants
    }

    // If we have a pinned participant, use spotlight layout
    if (participants.some((p) => p.isPinned)) {
      setLayout("spotlight")
    }
  }, [participants])

  const handleMaximizeParticipant = (id: string) => {
    if (maximizedParticipant === id) {
      setMaximizedParticipant(null)
    } else {
      setMaximizedParticipant(id)
      if (onMaximizeParticipant) {
        onMaximizeParticipant(id)
      }
    }
  }

  // Get pinned participant or first active one for spotlight view
  const getMainParticipant = () => {
    const pinned = participants.find((p) => p.isPinned)
    if (pinned) return pinned

    // If maximized, show that participant
    if (maximizedParticipant) {
      const maximized = participants.find((p) => p.id === maximizedParticipant)
      if (maximized) return maximized
    }

    // Otherwise show the first active participant
    return participants.find((p) => p.isActive) || participants[0]
  }

  // Get the remaining participants for the sidebar
  const getSideParticipants = () => {
    const mainParticipant = getMainParticipant()
    return participants.filter((p) => p.id !== mainParticipant.id)
  }

  // Render a single participant video
  const renderParticipantVideo = (participant: Participant, isMain = false, className = "") => {
    return (
      <div
        className={cn(
          "relative rounded-lg overflow-hidden bg-muted",
          isMain ? "aspect-video w-full" : "aspect-video w-full",
          className,
        )}
      >
        {participant.hasVideo ? (
          <img
            src={
              participant.avatar || `/placeholder.svg?height=720&width=1280&query=video call with ${participant.name}`
            }
            alt={`${participant.name}'s video`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
              <AvatarFallback className="text-2xl">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground">{participant.name}</p>
          </div>
        )}

        {/* Participant info overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-transparent text-foreground">
              {participant.name}
            </Badge>
            {!participant.hasAudio && <MicOff className="h-4 w-4 text-rose-500" />}
          </div>

          {/* Controls */}
          <div className="flex gap-1">
            {isMain && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm border-transparent"
                onClick={() => onTogglePin(participant.id)}
              >
                {participant.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
              </Button>
            )}
            {onMaximizeParticipant && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm border-transparent"
                onClick={() => handleMaximizeParticipant(participant.id)}
              >
                {maximizedParticipant === participant.id ? (
                  <Minimize2 className="h-3 w-3" />
                ) : (
                  <Maximize2 className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Speaking indicator */}
        {participant.isSpeaking && (
          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
        )}
      </div>
    )
  }

  // Render spotlight layout (one main + others in sidebar)
  const renderSpotlightLayout = () => {
    const mainParticipant = getMainParticipant()
    const sideParticipants = getSideParticipants()

    return (
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-2 h-full">
        <div className="flex items-center justify-center">{renderParticipantVideo(mainParticipant, true)}</div>
        {sideParticipants.length > 0 && (
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {sideParticipants.map((participant) => (
              <div key={participant.id} className="flex-shrink-0">
                {renderParticipantVideo(participant)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render grid layout (equal sized videos)
  const renderGridLayout = () => {
    let gridCols = "grid-cols-1"
    if (participants.length === 2) {
      gridCols = "grid-cols-1 md:grid-cols-2"
    } else if (participants.length === 3 || participants.length === 4) {
      gridCols = "grid-cols-1 md:grid-cols-2"
    } else if (participants.length > 4) {
      gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }

    return (
      <div className={`grid ${gridCols} gap-2 h-full`}>
        {participants.map((participant) => (
          <div key={participant.id}>{renderParticipantVideo(participant)}</div>
        ))}
      </div>
    )
  }

  // Render maximized layout (one participant full screen)
  const renderMaximizedLayout = () => {
    if (!maximizedParticipant) return renderSpotlightLayout()

    const participant = participants.find((p) => p.id === maximizedParticipant)
    if (!participant) return renderSpotlightLayout()

    return <div className="h-full">{renderParticipantVideo(participant, true, "h-full")}</div>
  }

  return (
    <div className={cn("w-full h-full", className)}>
      {maximizedParticipant
        ? renderMaximizedLayout()
        : layout === "grid"
          ? renderGridLayout()
          : renderSpotlightLayout()}
    </div>
  )
}
