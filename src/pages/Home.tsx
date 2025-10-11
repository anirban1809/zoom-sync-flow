import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MeetingCard } from "@/components/MeetingCard";
import { TaskRow } from "@/components/TaskRow";
import { mockMeetings, mockTasks } from "@/lib/mockData";
import { CreateMeetingModal } from "@/components/CreateMeetingModal";

export default function Home() {
  const [createMeetingOpen, setCreateMeetingOpen] = useState(false);
  const todaysMeetings = mockMeetings.filter(
    (m) => m.start.toDateString() === new Date().toDateString()
  );

  const upcomingTasks = mockTasks
    .filter((t) => t.status !== "done")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Good morning, Anirban</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening today
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="lg" variant="outline" className="gap-2" onClick={() => setCreateMeetingOpen(true)}>
            <Calendar className="h-5 w-5" />
            Create Meeting
          </Button>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Note
          </Button>
        </div>
      </div>

      <CreateMeetingModal 
        open={createMeetingOpen} 
        onOpenChange={setCreateMeetingOpen}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Meetings</CardTitle>
            <CardDescription>Scheduled for October 7, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysMeetings.length > 0 ? (
              todaysMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
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
            <CardTitle>My Action Items</CardTitle>
            <CardDescription>
              {upcomingTasks.length} tasks pending
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => <TaskRow key={task.id} task={task} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>All caught up! No pending tasks.</p>
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
          {mockMeetings.slice(0, 3).map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              showActions={false}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
