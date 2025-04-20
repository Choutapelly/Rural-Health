"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type BodyPart = {
  id: string
  name: string
  coords: number[]
  tooltipPosition: "top" | "right" | "bottom" | "left"
}

type BodyMapSelectorProps = {
  onSelect: (bodyPart: string) => void
  selectedParts: string[]
}

export function BodyMapSelector({ onSelect, selectedParts }: BodyMapSelectorProps) {
  const [view, setView] = useState<"front" | "back">("front")

  const bodyParts: BodyPart[] = [
    // Front view
    { id: "head", name: "Head", coords: [50, 10, 70, 30], tooltipPosition: "top" },
    { id: "chest", name: "Chest", coords: [40, 40, 60, 60], tooltipPosition: "right" },
    { id: "abdomen", name: "Abdomen", coords: [40, 65, 60, 85], tooltipPosition: "right" },
    { id: "left-arm", name: "Left Arm", coords: [25, 40, 35, 70], tooltipPosition: "left" },
    { id: "right-arm", name: "Right Arm", coords: [65, 40, 75, 70], tooltipPosition: "right" },
    { id: "left-leg", name: "Left Leg", coords: [35, 90, 45, 130], tooltipPosition: "left" },
    { id: "right-leg", name: "Right Leg", coords: [55, 90, 65, 130], tooltipPosition: "right" },

    // Back view (only shown when view === "back")
    { id: "back-upper", name: "Upper Back", coords: [40, 40, 60, 55], tooltipPosition: "right" },
    { id: "back-lower", name: "Lower Back", coords: [40, 60, 60, 85], tooltipPosition: "right" },
    { id: "back-left-arm", name: "Left Arm (Back)", coords: [25, 40, 35, 70], tooltipPosition: "left" },
    { id: "back-right-arm", name: "Right Arm (Back)", coords: [65, 40, 75, 70], tooltipPosition: "right" },
    { id: "back-left-leg", name: "Left Leg (Back)", coords: [35, 90, 45, 130], tooltipPosition: "left" },
    { id: "back-right-leg", name: "Right Leg (Back)", coords: [55, 90, 65, 130], tooltipPosition: "right" },
  ]

  const toggleBodyPart = (partId: string) => {
    onSelect(partId)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2 mb-2">
        <Button variant={view === "front" ? "default" : "outline"} size="sm" onClick={() => setView("front")}>
          Front View
        </Button>
        <Button variant={view === "back" ? "default" : "outline"} size="sm" onClick={() => setView("back")}>
          Back View
        </Button>
      </div>

      <div className="relative w-[200px] h-[300px] border rounded-md bg-muted/30">
        <img
          src={`/diverse-human-forms.png?height=300&width=200&query=human body ${view} silhouette`}
          alt={`Human body ${view} view`}
          className="w-full h-full"
        />

        <TooltipProvider>
          {bodyParts
            .filter(
              (part) =>
                (view === "front" && !part.id.startsWith("back")) || (view === "back" && part.id.startsWith("back")),
            )
            .map((part) => (
              <Tooltip key={part.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toggleBodyPart(part.id)}
                    className={`absolute rounded-full transition-colors ${
                      selectedParts.includes(part.id)
                        ? "bg-rose-500/70 hover:bg-rose-600/70"
                        : "bg-transparent hover:bg-rose-500/30"
                    }`}
                    style={{
                      left: `${part.coords[0]}%`,
                      top: `${part.coords[1]}%`,
                      width: `${part.coords[2] - part.coords[0]}%`,
                      height: `${part.coords[3] - part.coords[1]}%`,
                      border: selectedParts.includes(part.id) ? "2px solid #f43f5e" : "1px dashed #f43f5e",
                    }}
                    aria-label={part.name}
                  />
                </TooltipTrigger>
                <TooltipContent side={part.tooltipPosition}>
                  <p>{part.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
        </TooltipProvider>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Click on the body to indicate where your symptoms are located
      </p>
    </div>
  )
}
