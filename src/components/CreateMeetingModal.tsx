import { useState } from "react";
import { Calendar as CalendarIcon, X, ChevronDown } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/TimePicker";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMeetingModal({ open, onOpenChange }: CreateMeetingModalProps) {
  const { toast } = useToast();
  
  // Primary fields
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [timeError, setTimeError] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [currentAttendee, setCurrentAttendee] = useState("");
  const [attendeeError, setAttendeeError] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingPasscode, setMeetingPasscode] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [autoJoinRecorder, setAutoJoinRecorder] = useState(false);
  const [startRecordingAuto, setStartRecordingAuto] = useState(false);
  
  // Secondary options
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [owner, setOwner] = useState("Current User");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [notes, setNotes] = useState("");
  const [sendInvites, setSendInvites] = useState(false);
  const [emailAttendees, setEmailAttendees] = useState(false);
  const [postToSlack, setPostToSlack] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate end time when duration changes
  const updateEndTimeFromDuration = (newDuration: string, newStartTime?: string) => {
    const startTimeToUse = newStartTime || startTime;
    if (startTimeToUse && newDuration !== "custom") {
      const [hours, minutes] = startTimeToUse.split(":").map(Number);
      const durationMinutes = parseInt(newDuration);
      const endDate = addMinutes(new Date(2000, 0, 1, hours, minutes), durationMinutes);
      setEndTime(format(endDate, "HH:mm"));
    }
  };

  // Calculate duration when end time changes
  const updateDurationFromEndTime = (newEndTime: string) => {
    if (startTime && newEndTime) {
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = newEndTime.split(":").map(Number);
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      const diff = endTotalMinutes - startTotalMinutes;
      
      if (diff <= 0) {
        setTimeError("End time must be after start time");
      } else {
        setTimeError("");
        if ([15, 30, 45, 60].includes(diff)) {
          setDuration(diff.toString());
        } else {
          setDuration("custom");
        }
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addAttendee = () => {
    if (!currentAttendee.trim()) return;
    
    if (!validateEmail(currentAttendee)) {
      setAttendeeError("Please enter a valid email address");
      return;
    }
    
    if (attendees.includes(currentAttendee)) {
      setAttendeeError("This attendee has already been added");
      return;
    }
    
    setAttendees([...attendees, currentAttendee]);
    setCurrentAttendee("");
    setAttendeeError("");
  };

  const removeAttendee = (email: string) => {
    setAttendees(attendees.filter((a) => a !== email));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (startNow: boolean = false) => {
    setTitleError(false);
    setTimeError("");
    
    // Validate required fields
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    
    if (!startNow) {
      if (!date || !startTime) {
        toast({
          title: "Missing information",
          description: "Please select a date and start time",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate auto-join recorder requirements
    if (autoJoinRecorder && !meetingLink) {
      toast({
        title: "Meeting link required",
        description: "Please provide a meeting link to enable auto-join with recorder",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: startNow ? "Meeting started" : "Meeting scheduled",
        description: startNow ? "Your meeting has been created and is ready to start" : "Meeting invitation has been sent to all attendees",
      });
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDate(undefined);
      setStartTime("");
      setEndTime("");
      setDuration("60");
      setAttendees([]);
      setProvider("");
      setMeetingLink("");
      setAutoJoinRecorder(false);
      setStartRecordingAuto(false);
      setMoreOptionsOpen(false);
      setOwner("Current User");
      setTags([]);
      setNotes("");
      setSendInvites(false);
    }, 1000);
  };

  const isScheduleDisabled = !title.trim() || !date || !startTime || (autoJoinRecorder && !meetingLink);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle>Create meeting</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Meeting Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className={cn(titleError && "text-destructive")}>
                  Meeting title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError(false);
                  }}
                  placeholder="Weekly team sync"
                  className={cn(titleError && "border-destructive")}
                />
                {titleError && (
                  <p className="text-sm text-destructive">Meeting title is required</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMM d") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start time *</Label>
                    <TimePicker
                      value={startTime}
                      onChange={(value) => {
                        setStartTime(value);
                        setTimeError("");
                        updateEndTimeFromDuration(duration, value);
                      }}
                      placeholder="Start"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={duration}
                      onValueChange={(value) => {
                        setDuration(value);
                        updateEndTimeFromDuration(value);
                      }}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {duration === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End time</Label>
                    <TimePicker
                      value={endTime}
                      onChange={(value) => {
                        setEndTime(value);
                        updateDurationFromEndTime(value);
                      }}
                      placeholder="End"
                    />
                  </div>
                )}

                {timeError && (
                  <p className="text-sm text-destructive">{timeError}</p>
                )}
              </div>

              {/* Attendees */}
              <div className="space-y-3">
                <Label htmlFor="attendees">Attendees</Label>
                <div className="flex gap-2">
                  <Input
                    id="attendees"
                    value={currentAttendee}
                    onChange={(e) => {
                      setCurrentAttendee(e.target.value);
                      setAttendeeError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAttendee();
                      }
                    }}
                    placeholder="Email address"
                    className={cn(attendeeError && "border-destructive")}
                  />
                </div>
                {attendeeError && (
                  <p className="text-sm text-destructive">{attendeeError}</p>
                )}

                {attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attendees.map((attendee) => (
                      <Badge key={attendee} variant="secondary" className="gap-1">
                        {attendee}
                        <button
                          onClick={() => removeAttendee(attendee)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Location / Provider */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="provider">Location / Provider</Label>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-link">
                    Meeting link {autoJoinRecorder && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="meeting-link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                {provider === "zoom" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="meeting-id">Meeting ID</Label>
                      <Input
                        id="meeting-id"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        placeholder="123 456 7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passcode">Passcode</Label>
                      <Input
                        id="passcode"
                        value={meetingPasscode}
                        onChange={(e) => setMeetingPasscode(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Auto-join with recorder */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="auto-join" className="cursor-pointer">
                      Auto-join with recorder
                    </Label>
                    {autoJoinRecorder && (
                      <p className="text-xs text-muted-foreground">
                        Ensure all participants consent to recording. A meeting link is required.
                      </p>
                    )}
                  </div>
                  <Switch
                    id="auto-join"
                    checked={autoJoinRecorder}
                    onCheckedChange={setAutoJoinRecorder}
                  />
                </div>

                {autoJoinRecorder && (
                  <div className="ml-6 flex items-center justify-between">
                    <Label htmlFor="auto-record" className="cursor-pointer text-sm">
                      Start recording automatically
                    </Label>
                    <Switch
                      id="auto-record"
                      checked={startRecordingAuto}
                      onCheckedChange={setStartRecordingAuto}
                    />
                  </div>
                )}
              </div>

              {/* More Options */}
              <Collapsible open={moreOptionsOpen} onOpenChange={setMoreOptionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                    <span className="text-sm font-medium">More options</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        moreOptionsOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  {/* Owner */}
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Select value={owner} onValueChange={setOwner}>
                      <SelectTrigger id="owner">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current User">Current User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Add tag"
                      />
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes / Agenda */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes / Agenda</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add meeting notes or agenda"
                      rows={3}
                    />
                  </div>

                  {/* Send Invites */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="send-invites" className="cursor-pointer">
                        Send invites
                      </Label>
                      <Switch
                        id="send-invites"
                        checked={sendInvites}
                        onCheckedChange={setSendInvites}
                      />
                    </div>

                    {sendInvites && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email-attendees"
                            checked={emailAttendees}
                            onCheckedChange={(checked) => setEmailAttendees(checked as boolean)}
                          />
                          <Label htmlFor="email-attendees" className="cursor-pointer text-sm font-normal">
                            Email attendees
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="post-slack"
                            checked={postToSlack}
                            onCheckedChange={(checked) => setPostToSlack(checked as boolean)}
                          />
                          <Label htmlFor="post-slack" className="cursor-pointer text-sm font-normal">
                            Post to Slack
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
          <div className="flex justify-between w-full gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleSubmit(true)}
                disabled={!title.trim() || isSubmitting}
              >
                Create & start now
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isScheduleDisabled || isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
