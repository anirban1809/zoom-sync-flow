import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Clock,
  Video,
  FileText,
  Users,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockMeetings } from "@/lib/mockData";
import { Meeting } from "@/types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const providerColors = {
  zoom: "bg-blue-500",
  teams: "bg-purple-500",
  meet: "bg-green-500",
};

export default function Meetings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const recordedMeetings = mockMeetings.filter(
    (meeting) => meeting.status === "completed"
  );

  const upcomingMeetings = mockMeetings.filter(
    (meeting) => meeting.status === "scheduled"
  );

  const filteredRecorded = recordedMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpcoming = upcomingMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">
            Your recorded and upcoming meetings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Recorded Meetings Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5 text-primary" />
            Recorded Meetings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRecorded.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecorded.map((meeting) => (
                  <TableRow
                    key={meeting.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/meetings/${meeting.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            providerColors[meeting.provider]
                          }`}
                        />
                        <span className="font-medium">{meeting.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{format(meeting.start, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{format(meeting.start, "h:mm a")}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {meeting.participants
                            .slice(0, 3)
                            .map((participant) => (
                              <Avatar
                                key={participant.id}
                                className="h-6 w-6 border-2 border-background"
                              >
                                <AvatarImage src={participant.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          {meeting.participants.length > 3 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{meeting.participants.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {meeting.participants.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {meeting.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {meeting.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{meeting.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">No recorded meetings yet</p>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Your recorded and transcribed meetings will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Meetings Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Meetings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUpcoming.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUpcoming.map((meeting) => (
                  <TableRow
                    key={meeting.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            providerColors[meeting.provider]
                          }`}
                        />
                        <span className="font-medium">{meeting.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{format(meeting.start, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{format(meeting.start, "h:mm a")}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {meeting.participants
                            .slice(0, 3)
                            .map((participant) => (
                              <Avatar
                                key={participant.id}
                                className="h-6 w-6 border-2 border-background"
                              >
                                <AvatarImage src={participant.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          {meeting.participants.length > 3 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{meeting.participants.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {meeting.participants.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {meeting.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {meeting.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{meeting.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">No upcoming meetings</p>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Connect your calendar to see scheduled meetings
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Meeting Details Modal */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                  selectedMeeting ? providerColors[selectedMeeting.provider] : ""
                }`}
              />
              {selectedMeeting?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(selectedMeeting.start, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(selectedMeeting.start, "h:mm a")} - {format(selectedMeeting.end, "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {selectedMeeting.participants.slice(0, 4).map((participant) => (
                        <Avatar
                          key={participant.id}
                          className="h-6 w-6 border-2 border-background"
                        >
                          <AvatarImage src={participant.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      {selectedMeeting.participants.length} participant{selectedMeeting.participants.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {selectedMeeting.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {selectedMeeting.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Button className="w-full gap-2" size="lg">
                <ExternalLink className="h-4 w-4" />
                Join Meeting
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
