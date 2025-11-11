import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Video, User, Flag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MeetingCard } from "@/components/MeetingCard";
import { TaskRow } from "@/components/TaskRow";
import { mockMeetings, mockTasks } from "@/lib/mockData";
import { CreateMeetingModal } from "@/components/CreateMeetingModal";
import { Task, Meeting } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAccessToken } from "@/lib/api/auth";
import { apiFetch } from "@/lib/api/api";

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-info/10 text-info border-info/20",
  done: "bg-success/10 text-success border-success/20",
  cancelled: "bg-muted text-muted-foreground",
} as const;

const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return {
      greeting: "Good morning",
      caption: "Here's what's happening today"
    };
  } else if (hour < 16) {
    return {
      greeting: "Good afternoon",
      caption: "Let's keep the momentum going."
    };
  } else {
    return {
      greeting: "Good evening",
      caption: "Time to wrap up the day's goals."
    };
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [createMeetingOpen, setCreateMeetingOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const todaysMeetings = mockMeetings.filter(
    (m) => m.start.toDateString() === new Date().toDateString()
  );
  const { greeting, caption } = getGreeting();

  const fetchUserInfo = async () => {
    try {
      const res = await apiFetch("/me");
      setUserInfo(await res.json());
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for selected workspace in sessionStorage
    const storedWorkspace = sessionStorage.getItem("selected_workspace");
    if (storedWorkspace) {
      // Workspace already selected, fetch user info
      fetchUserInfo();
    } else {
      // No workspace selected, redirect to workspace selection
      navigate("/workspace-selection");
    }
  }, [navigate]);

  const upcomingTasks = mockTasks
    .filter((t) => t.status !== "done")
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 p-4 border rounded-lg">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-36 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 p-4 border rounded-lg">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {greeting}, {userInfo?.user?.given_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {caption}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => setCreateMeetingOpen(true)}
          >
            <Calendar className="h-5 w-5" />
            Create Meeting
          </Button>
        </div>
      </div>

      <CreateMeetingModal
        open={createMeetingOpen}
        onOpenChange={setCreateMeetingOpen}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Meetings</CardTitle>
            <CardDescription>Scheduled for October 7, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysMeetings.length > 0 ? (
              todaysMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onClick={() => setSelectedMeeting(meeting)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">No meetings scheduled for today</p>
                <Button variant="outline" size="sm">
                  Connect Calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Your pending tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="cursor-pointer"
                >
                  <TaskRow task={task} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No pending tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Meetings</CardTitle>
          <CardDescription>From the past 7 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockMeetings.length > 0 ? (
            mockMeetings
              .slice(0, 3)
              .map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  showActions={false}
                />
              ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent meetings</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Details Modal */}
      <Dialog
        open={!!selectedMeeting}
        onOpenChange={() => setSelectedMeeting(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedMeeting.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Time and Status */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(selectedMeeting.start, "MMM d, yyyy h:mm a")} -{" "}
                    {format(selectedMeeting.end, "h:mm a")}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedMeeting.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedMeeting.provider}
                  </Badge>
                </div>

                {/* Participants */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">
                    Participants ({selectedMeeting.participants.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedMeeting.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {participant.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {participant.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {selectedMeeting.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Join Meeting</Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Details Modal */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedTask.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Status chips */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={cn("border", statusColors[selectedTask.status])}
                  >
                    {selectedTask.status}
                  </Badge>
                  {selectedTask.due && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(selectedTask.due, "MMM d, yyyy")}
                    </Badge>
                  )}
                  {selectedTask.ownerName && (
                    <Badge variant="outline">
                      <User className="h-3 w-3 mr-1" />
                      {selectedTask.ownerName}
                    </Badge>
                  )}
                </div>

                {/* Meeting origin card */}
                {selectedTask.meetingId && (
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold text-sm">Origin Meeting</h4>
                    </div>
                    <p className="font-medium mb-1">
                      {
                        mockMeetings.find(
                          (m) => m.id === selectedTask.meetingId
                        )?.title
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {mockMeetings.find((m) => m.id === selectedTask.meetingId)
                        ?.start
                        ? format(
                            mockMeetings.find(
                              (m) => m.id === selectedTask.meetingId
                            )!.start,
                            "MMM d, yyyy h:mm a"
                          )
                        : ""}
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 p-0 h-auto text-xs text-primary"
                    >
                      View meeting →
                    </Button>
                  </div>
                )}

                {/* External Links */}
                {selectedTask.externalLinks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      External Links
                    </h4>
                    <div className="space-y-2">
                      {selectedTask.externalLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          {link.provider}: {link.id}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Comments</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">YO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a comment… (use @mentions)"
                          className="min-h-[80px]"
                        />
                        <Button size="sm" className="mt-2">
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <Tabs defaultValue="activity" className="w-full">
                    <TabsList>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="related">Related</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>
                      Created {format(selectedTask.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
