"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, MoreVertical, UserPlus, Volume2, VolumeX, MicOff, Crown, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export type ParticipantRole = "host" | "specialist" | "family" | "interpreter" | "patient" | "observer"

export interface Participant {
  id: string
  name: string
  role: ParticipantRole
  avatar?: string
  isActive: boolean
  isSpeaking: boolean
  hasAudio: boolean
  hasVideo: boolean
  isPinned?: boolean
}

interface ParticipantManagementProps {
  participants: Participant[]
  onAddParticipant: (email: string, role: ParticipantRole) => void
  onRemoveParticipant: (id: string) => void
  onToggleAudio: (id: string) => void
  onTogglePin: (id: string) => void
  consultationId: string
  className?: string
}

export function ParticipantManagement({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onToggleAudio,
  onTogglePin,
  consultationId,
  className,
}: ParticipantManagementProps) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<ParticipantRole>("family")
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onAddParticipant(inviteEmail.trim(), inviteRole)
      setInviteEmail("")
      setShowInviteDialog(false)
    }
  }

  const copyInviteLink = () => {
    const link = `${window.location.origin}/video-consultation/join/${consultationId}`
    navigator.clipboard.writeText(link)
    // In a real app, we would show a toast notification here
  }

  const getRoleBadgeStyles = (role: ParticipantRole) => {
    switch (role) {
      case "host":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "specialist":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "family":
        return "bg-green-100 text-green-800 border-green-200"
      case "interpreter":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "patient":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "observer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleIcon = (role: ParticipantRole) => {
    switch (role) {
      case "host":
        return <Crown className="h-3 w-3 mr-1" />
      case "specialist":
        return <Shield className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Participants ({participants.length})</h3>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite to Consultation</DialogTitle>
              <DialogDescription>
                Send an invitation to join this video consultation. They will receive an email with a secure link.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as ParticipantRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family Member</SelectItem>
                    <SelectItem value="specialist">Specialist</SelectItem>
                    <SelectItem value="interpreter">Interpreter</SelectItem>
                    <SelectItem value="observer">Observer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Or share invitation link:</span>
                <Button variant="outline" size="sm" onClick={copyInviteLink}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={cn(
              "flex items-center justify-between p-2 rounded-md",
              participant.isPinned ? "bg-muted" : "hover:bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {participant.isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate max-w-[120px]">{participant.name}</span>
                  {!participant.hasAudio && <MicOff className="h-3 w-3 text-muted-foreground" />}
                  {!participant.hasVideo && <span className="text-xs text-muted-foreground">(video off)</span>}
                </div>
                <Badge variant="outline" className={cn("text-xs py-0 px-1", getRoleBadgeStyles(participant.role))}>
                  {getRoleIcon(participant.role)}
                  {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onToggleAudio(participant.id)}
                    >
                      {participant.hasAudio ? (
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{participant.hasAudio ? "Mute for you" : "Unmute for you"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Participant Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onTogglePin(participant.id)}>
                    {participant.isPinned ? "Unpin participant" : "Pin to main view"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onRemoveParticipant(participant.id)}>
                    Remove from call
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
