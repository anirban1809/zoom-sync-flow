import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  ChevronDown,
  Calendar,
  User,
  Flag,
  Clock,
  Tag,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Zap,
  Video,
  MoreHorizontal,
  MessageSquare,
  Copy,
  Link2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TaskStatus = "Open" | "In review" | "Blocked" | "Done";
type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
type TaskConfidence = "Low" | "Medium" | "High";

interface Task {
  id: string;
  title: string;
  assignee?: string;
  due?: string;
  priority: TaskPriority;
  status: TaskStatus;
  source: string;
  sourceIcon: string;
  confidence: TaskConfidence;
  updated: string;
  completed: boolean;
  description?: string;
  meeting?: {
    title: string;
    date: string;
    participants: string[];
    snippet: string;
  };
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with Acme on SOW",
    assignee: "Rita Johnson",
    due: "Next Tuesday",
    priority: "High",
    status: "Open",
    source: "Q4 Business Review",
    sourceIcon: "zoom",
    confidence: "High",
    updated: "2h ago",
    completed: false,
    description: "Reach out to Acme regarding the Statement of Work for the new project.",
    meeting: {
      title: "Q4 Business Review",
      date: "2025-10-13 2:00 PM",
      participants: ["Rita Johnson", "John Smith", "Sarah Lee"],
      snippet: "We need to follow up with Acme on finalizing the SOW before the end of the month.",
    },
  },
  {
    id: "2",
    title: "Ship v0.4 release notes",
    assignee: "You",
    due: "Tomorrow 4pm",
    priority: "Urgent",
    status: "In review",
    source: "Product Sync",
    sourceIcon: "teams",
    confidence: "High",
    updated: "1d ago",
    completed: false,
    description: "Finalize and publish the release notes for version 0.4.",
    meeting: {
      title: "Product Sync",
      date: "2025-10-14 10:00 AM",
      participants: ["You", "Dev Team"],
      snippet: "Let's get those v0.4 release notes out by tomorrow afternoon.",
    },
  },
  {
    id: "3",
    title: "Review API documentation",
    assignee: "Alex Chen",
    due: "Today",
    priority: "Medium",
    status: "Open",
    source: "Engineering Standup",
    sourceIcon: "meet",
    confidence: "Medium",
    updated: "3h ago",
    completed: false,
    description: "Complete review of the updated API documentation.",
  },
];

const views = [
  { id: "my-tasks", label: "My tasks", icon: User },
  { id: "assigned-by-me", label: "Assigned by me", icon: User },
  { id: "inbox", label: "Inbox", icon: Inbox, badge: 5 },
  { id: "due-today", label: "Due today", icon: Calendar },
  { id: "upcoming", label: "Upcoming", icon: Clock },
  { id: "overdue", label: "Overdue", icon: AlertCircle, badge: 3 },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
  { id: "all", label: "All", icon: Flag },
];

const priorityColors = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-info/10 text-info border-info/20",
  High: "bg-warning/10 text-warning border-warning/20",
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusColors = {
  Open: "bg-muted text-muted-foreground",
  "In review": "bg-info/10 text-info border-info/20",
  Blocked: "bg-destructive/10 text-destructive border-destructive/20",
  Done: "bg-success/10 text-success border-success/20",
};

export default function Tasks() {
  const [selectedView, setSelectedView] = useState("my-tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your action items
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Import/Export
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Import from CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export to JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="gap-2" onClick={() => setQuickCaptureOpen(true)}>
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>
      </div>

      {/* Quick Capture */}
      {quickCaptureOpen && (
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a task… (e.g., 'Follow up with Acme @rita due next Tue #sales')"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuickCaptureOpen(false);
              }}
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={() => setQuickCaptureOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use @name for assignee, #tag for tags, "due [date]" for due date
          </p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, people, meetings…"
            className="pl-9"
          />
        </div>
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-auto">
          <TabsList>
            <TabsTrigger value="my-tasks">My tasks</TabsTrigger>
            <TabsTrigger value="inbox">
              Inbox
              {views.find(v => v.id === 'inbox')?.badge && (
                <Badge variant="secondary" className="ml-2">
                  {views.find(v => v.id === 'inbox')?.badge}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="due-today">Due today</TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue
              {views.find(v => v.id === 'overdue')?.badge && (
                <Badge variant="secondary" className="ml-2">
                  {views.find(v => v.id === 'overdue')?.badge}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          Assignee
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Flag className="h-4 w-4" />
          Priority
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Due date
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Due date</DropdownMenuItem>
              <DropdownMenuItem>Priority</DropdownMenuItem>
              <DropdownMenuItem>Recently updated</DropdownMenuItem>
              <DropdownMenuItem>Confidence</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Group by
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>None</DropdownMenuItem>
              <DropdownMenuItem>Assignee</DropdownMenuItem>
              <DropdownMenuItem>Due date</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Overdue Alert */}
      {selectedView === "overdue" && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          3 tasks are overdue. Review now.
        </div>
      )}

      {/* Task List Card */}
      <div className="border rounded-lg bg-card">
        <div className="divide-y">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                  task.completed && "opacity-60"
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    task.completed && "line-through"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {task.source && (
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {task.source}
                      </span>
                    )}
                    <span>•</span>
                    <span>{task.updated}</span>
                  </div>
                </div>
                {task.assignee && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden lg:inline">{task.assignee}</span>
                  </div>
                )}
                {task.due && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {task.due}
                  </Badge>
                )}
                <Badge variant="outline" className={cn("text-xs border", priorityColors[task.priority])}>
                  {task.priority}
                </Badge>
                <Badge variant="outline" className={cn("text-xs border", statusColors[task.status])}>
                  {task.status}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {task.confidence}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="h-4 w-4 mr-2" />
                      Snooze
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link2 className="h-4 w-4 mr-2" />
                      Copy link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </div>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nothing here yet</h3>
            <p className="text-sm text-muted-foreground">
              Capture from your next meeting or create a task.
            </p>
          </div>
        )}
      </div>

      {/* Right Side Drawer */}
      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedTask && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedTask.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status chips */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={cn("border", statusColors[selectedTask.status])}>
                    {selectedTask.status}
                  </Badge>
                  <Badge variant="outline" className={cn("border", priorityColors[selectedTask.priority])}>
                    <Flag className="h-3 w-3 mr-1" />
                    {selectedTask.priority}
                  </Badge>
                  {selectedTask.due && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {selectedTask.due}
                    </Badge>
                  )}
                  {selectedTask.assignee && (
                    <Badge variant="outline">
                      <User className="h-3 w-3 mr-1" />
                      {selectedTask.assignee}
                    </Badge>
                  )}
                </div>

                {/* Meeting origin card */}
                {selectedTask.meeting && (
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold text-sm">Origin Meeting</h4>
                    </div>
                    <p className="font-medium mb-1">{selectedTask.meeting.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedTask.meeting.date}
                    </p>
                    <p className="text-sm mb-3">
                      Participants: {selectedTask.meeting.participants.join(", ")}
                    </p>
                    <div className="bg-background p-3 rounded border text-sm italic">
                      "{selectedTask.meeting.snippet}"
                    </div>
                    <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                      Jump to timestamp →
                    </Button>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Description</h4>
                  <Textarea
                    placeholder="Add description…"
                    defaultValue={selectedTask.description}
                    className="min-h-[100px]"
                  />
                </div>

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
                        <Button size="sm" className="mt-2">Comment</Button>
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
                    <p>Created {selectedTask.updated}</p>
                    <p>AI confidence: {selectedTask.confidence}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
