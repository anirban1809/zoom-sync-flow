import { useState } from "react";
import { Calendar, Plus, X, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMeetingModal({ open, onOpenChange }: CreateMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [timezone, setTimezone] = useState("America/New_York");
  const [participants, setParticipants] = useState<string[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState("");
  const [sendCalendarInvite, setSendCalendarInvite] = useState(true);
  const [addNotetaker, setAddNotetaker] = useState(false);
  const [conferencing, setConferencing] = useState("none");
  const [linkType, setLinkType] = useState("auto");
  const [customLink, setCustomLink] = useState("");
  const [location, setLocation] = useState("");
  const [agenda, setAgenda] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [recurrence, setRecurrence] = useState("none");
  const [reminder, setReminder] = useState("none");
  const [visibility, setVisibility] = useState("default");
  const [canModify, setCanModify] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const addParticipant = () => {
    if (currentParticipant && !participants.includes(currentParticipant)) {
      setParticipants([...participants, currentParticipant]);
      setCurrentParticipant("");
    }
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const handleCreate = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSending(false);
    onOpenChange(false);
  };

  const isValid = title.trim().length > 0 && (!allDay ? date && startTime : date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle>Create meeting</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* 1) Basics */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Basics</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Weekly Team Sync"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="all-day" className="cursor-pointer">All-day</Label>
                  <Switch
                    id="all-day"
                    checked={allDay}
                    onCheckedChange={setAllDay}
                  />
                </div>

                {!allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start time *</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {allDay && (
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                )}

                {!allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time zone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 2) Participants */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Participants</Label>

                <div className="space-y-2">
                  <Label htmlFor="participants">Add participants</Label>
                  <div className="flex gap-2">
                    <Input
                      id="participants"
                      value={currentParticipant}
                      onChange={(e) => setCurrentParticipant(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addParticipant();
                        }
                      }}
                      placeholder="Enter email or name"
                    />
                    <Button variant="outline" onClick={addParticipant}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Add from Google Workspace
                  </Button>
                  <Button variant="outline" size="sm">
                    Add from Microsoft 365
                  </Button>
                </div>

                {participants.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected participants ({participants.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {participants.map((participant) => (
                        <Badge key={participant} variant="secondary" className="gap-1">
                          {participant}
                          <button
                            onClick={() => removeParticipant(participant)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="send-invite" className="cursor-pointer">
                      Send calendar invite email
                    </Label>
                    <Switch
                      id="send-invite"
                      checked={sendCalendarInvite}
                      onCheckedChange={setSendCalendarInvite}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="add-notetaker" className="cursor-pointer">
                      Add notetaker to meeting
                    </Label>
                    <Switch
                      id="add-notetaker"
                      checked={addNotetaker}
                      onCheckedChange={setAddNotetaker}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 3) Conferencing */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Conferencing</Label>

                <div className="space-y-2">
                  <Label htmlFor="conferencing">Conferencing provider</Label>
                  <Select value={conferencing} onValueChange={setConferencing}>
                    <SelectTrigger id="conferencing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="google-meet">Google Meet</SelectItem>
                      <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="custom">Custom link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {conferencing !== "none" && conferencing !== "custom" && (
                  <div className="space-y-3">
                    <Label>Meeting link</Label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="auto-link"
                          name="link-type"
                          checked={linkType === "auto"}
                          onChange={() => setLinkType("auto")}
                          className="cursor-pointer"
                        />
                        <Label htmlFor="auto-link" className="cursor-pointer font-normal">
                          Auto-generate link
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="custom-link-radio"
                          name="link-type"
                          checked={linkType === "custom"}
                          onChange={() => setLinkType("custom")}
                          className="cursor-pointer"
                        />
                        <Label htmlFor="custom-link-radio" className="cursor-pointer font-normal">
                          Paste custom link
                        </Label>
                      </div>
                    </div>
                    {linkType === "auto" && (
                      <Input
                        readOnly
                        value="https://meet.google.com/xxx-yyyy-zzz"
                        className="bg-muted"
                      />
                    )}
                    {linkType === "custom" && (
                      <Input
                        value={customLink}
                        onChange={(e) => setCustomLink(e.target.value)}
                        placeholder="Paste meeting link"
                      />
                    )}
                  </div>
                )}

                {conferencing === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-link-input">Custom meeting link</Label>
                    <Input
                      id="custom-link-input"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Conference Room A or In-person"
                  />
                </div>
              </div>

              <Separator />

              {/* 4) Agenda & attachments */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Agenda & attachments</Label>

                <div className="space-y-2">
                  <Label htmlFor="agenda">Agenda / notes (optional)</Label>
                  <Textarea
                    id="agenda"
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    placeholder="Enter meeting agenda or notes"
                    rows={4}
                  />
                </div>

                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Attach files
                </Button>
              </div>

              <Separator />

              {/* 5) Advanced */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <Label className="text-base font-semibold cursor-pointer">Advanced</Label>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        advancedOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Recurrence</Label>
                    <Select value={recurrence} onValueChange={setRecurrence}>
                      <SelectTrigger id="recurrence">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Does not repeat</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder">Reminder</Label>
                    <Select value={reminder} onValueChange={setReminder}>
                      <SelectTrigger id="reminder">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="0">At time of event</SelectItem>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="10">10 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger id="visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can-modify"
                      checked={canModify}
                      onCheckedChange={(checked) => setCanModify(checked as boolean)}
                    />
                    <Label htmlFor="can-modify" className="cursor-pointer font-normal">
                      Participants can modify event
                    </Label>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* 6) Summary */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <Label className="text-base font-semibold">Summary</Label>
                <div className="space-y-1 text-sm">
                  {date && (
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(date).toLocaleDateString()} {!allDay && startTime && `at ${startTime}`}{" "}
                      {!allDay && `(${duration} min, ${timezone})`}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Participants:</span> {participants.length} invitee(s)
                  </p>
                  {conferencing !== "none" && (
                    <p>
                      <span className="font-medium">Conferencing:</span>{" "}
                      {conferencing === "google-meet" && "Google Meet"}
                      {conferencing === "microsoft-teams" && "Microsoft Teams"}
                      {conferencing === "zoom" && "Zoom"}
                      {conferencing === "custom" && "Custom link"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Save as draft</Button>
            <Button onClick={handleCreate} disabled={!isValid || isSending}>
              {isSending ? "Creating..." : "Create & send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
