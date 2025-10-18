import { useState } from "react";
import {
  Search,
  Plus,
  Settings,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Video,
  MoreHorizontal,
  X,
  Edit,
  Send,
  Trash2,
  Link2,
  ChevronDown,
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
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TaskStatus = "Open" | "Done";
type TaskPriority = "Low" | "Medium" | "High";

interface ParsedField {
  type: "assignee" | "due" | "tag";
  value: string;
  display: string;
}

interface Task {
  id: string;
  title: string;
  notes?: string;
  assignee?: string;
  assigneeAvatar?: string;
  due?: string;
  priority: TaskPriority;
  status: TaskStatus;
  sourceMeeting?: {
    id: string;
    title: string;
    date: string;
  };
  externalLink?: {
    platform: "jira" | "linear" | "asana";
    url: string;
  };
  tags?: string[];
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with Acme on SOW",
    notes: "Reach out to Acme regarding the Statement of Work for the new project.",
    assignee: "Rita Johnson",
    assigneeAvatar: "RJ",
    due: "2025-10-15",
    priority: "High",
    status: "Open",
    sourceMeeting: {
      id: "m1",
      title: "Q4 Business Review",
      date: "2025-10-13",
    },
    tags: ["sales", "urgent"],
    createdBy: "You",
    createdAt: "2025-10-13 2:30 PM",
    lastUpdated: "2h ago",
  },
  {
    id: "2",
    title: "Ship v0.4 release notes",
    notes: "Finalize and publish the release notes for version 0.4.",
    assignee: "You",
    assigneeAvatar: "YO",
    due: "2025-10-12",
    priority: "High",
    status: "Open",
    sourceMeeting: {
      id: "m2",
      title: "Product Sync",
      date: "2025-10-14",
    },
    tags: ["product"],
    createdBy: "You",
    createdAt: "2025-10-14 10:30 AM",
    lastUpdated: "1d ago",
    externalLink: {
      platform: "jira",
      url: "#",
    },
  },
  {
    id: "3",
    title: "Review API documentation",
    assignee: "Alex Chen",
    assigneeAvatar: "AC",
    due: "2025-10-11",
    priority: "Medium",
    status: "Open",
    sourceMeeting: {
      id: "m3",
      title: "Engineering Standup",
      date: "2025-10-11",
    },
    createdBy: "John Smith",
    createdAt: "2025-10-11 9:00 AM",
    lastUpdated: "3h ago",
  },
  {
    id: "4",
    title: "Update customer presentation",
    due: "2025-10-20",
    priority: "Low",
    status: "Done",
    sourceMeeting: {
      id: "m4",
      title: "Sales Meeting",
      date: "2025-10-09",
    },
    createdBy: "You",
    createdAt: "2025-10-09 3:00 PM",
    lastUpdated: "2d ago",
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [quickAddText, setQuickAddText] = useState("");
  const [parsedFields, setParsedFields] = useState<ParsedField[]>([]);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Filters
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [dueFilter, setDueFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("due");

  // Edit drawer states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("Open");
  const [editDue, setEditDue] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("Medium");

  const parseQuickAddText = (text: string) => {
    const fields: ParsedField[] = [];
    
    // Parse @mention for assignee
    const assigneeMatch = text.match(/@(\w+)/);
    if (assigneeMatch) {
      fields.push({
        type: "assignee",
        value: assigneeMatch[1],
        display: `@${assigneeMatch[1]}`,
      });
    }

    // Parse due date
    const dueMatch = text.match(/due\s+([\w\s]+?)(?=\s+@|#|$)/i);
    if (dueMatch) {
      fields.push({
        type: "due",
        value: dueMatch[1].trim(),
        display: `due ${dueMatch[1].trim()}`,
      });
    }

    // Parse #tags
    const tagMatches = text.match(/#(\w+)/g);
    if (tagMatches) {
      tagMatches.forEach((tag) => {
        fields.push({
          type: "tag",
          value: tag.substring(1),
          display: tag,
        });
      });
    }

    setParsedFields(fields);
  };

  const handleQuickAddChange = (text: string) => {
    setQuickAddText(text);
    parseQuickAddText(text);
  };

  const removeField = (index: number) => {
    const newFields = [...parsedFields];
    newFields.splice(index, 1);
    setParsedFields(newFields);
  };

  const handleQuickAdd = () => {
    if (!quickAddText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: quickAddText.replace(/@\w+|due\s+[\w\s]+|#\w+/gi, "").trim(),
      assignee: parsedFields.find((f) => f.type === "assignee")?.value,
      due: parsedFields.find((f) => f.type === "due")?.value,
      tags: parsedFields.filter((f) => f.type === "tag").map((f) => f.value),
      priority: "Medium",
      status: "Open",
      createdBy: "You",
      createdAt: new Date().toLocaleString(),
      lastUpdated: "Just now",
    };

    setTasks([newTask, ...tasks]);
    setQuickAddText("");
    setParsedFields([]);
    toast.success("Task created");
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "Open" ? "Done" : "Open" }
          : t
      )
    );
  };

  const resetFilters = () => {
    setAssigneeFilter("all");
    setStatusFilter("open");
    setDueFilter("all");
    setSearchQuery("");
  };

  const openEditDrawer = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditNotes(task.notes || "");
    setEditAssignee(task.assignee || "");
    setEditStatus(task.status);
    setEditDue(task.due || "");
    setEditPriority(task.priority);
  };

  const saveTask = () => {
    if (!editingTask) return;

    setTasks(
      tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: editTitle,
              notes: editNotes,
              assignee: editAssignee || undefined,
              status: editStatus,
              due: editDue || undefined,
              priority: editPriority,
              lastUpdated: "Just now",
            }
          : t
      )
    );
    setEditingTask(null);
    toast.success("Task updated");
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setEditingTask(null);
    toast.success("Task deleted");
  };

  const copyDeepLink = () => {
    const url = `${window.location.origin}/tasks?filters=${encodeURIComponent(
      JSON.stringify({
        assignee: assigneeFilter,
        status: statusFilter,
        due: dueFilter,
        search: searchQuery,
      })
    )}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (assigneeFilter === "me" && task.assignee !== "You") return false;
    if (
      assigneeFilter !== "all" &&
      assigneeFilter !== "me" &&
      task.assignee !== assigneeFilter
    )
      return false;
    if (statusFilter === "open" && task.status !== "Open") return false;
    if (statusFilter === "done" && task.status !== "Done") return false;

    if (dueFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDue = task.due ? new Date(task.due) : null;

      if (dueFilter === "overdue" && taskDue) {
        if (taskDue >= today) return false;
      } else if (dueFilter === "today" && taskDue) {
        if (taskDue.toDateString() !== today.toDateString()) return false;
      } else if (dueFilter === "week" && taskDue) {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        if (taskDue < today || taskDue > weekFromNow) return false;
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.notes?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "due") {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    } else {
      // Sort by last updated
      return b.lastUpdated.localeCompare(a.lastUpdated);
    }
  });

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Action items captured from meetings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreferencesOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
          <Button size="sm" onClick={() => openEditDrawer({
            id: Date.now().toString(),
            title: "",
            priority: "Medium",
            status: "Open",
            createdBy: "You",
            createdAt: new Date().toLocaleString(),
            lastUpdated: "Just now",
          })}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder='Add a task… (e.g., "Follow up with Acme @rita due next Tue #sales")'
              value={quickAddText}
              onChange={(e) => handleQuickAddChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickAdd();
              }}
              className="pr-20"
            />
            <Popover open={helpOpen} onOpenChange={setHelpOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                >
                  Syntax
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Quick Add Syntax</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        @name
                      </code>
                      <span className="text-muted-foreground ml-2">
                        Assign to person
                      </span>
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        due [date]
                      </code>
                      <span className="text-muted-foreground ml-2">
                        Set due date
                      </span>
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        #tag
                      </code>
                      <span className="text-muted-foreground ml-2">
                        Add tag
                      </span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleQuickAdd} disabled={!quickAddText.trim()}>
            Add
          </Button>
        </div>

        {/* Parsed fields chips */}
        {parsedFields.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {parsedFields.map((field, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => removeField(index)}
              >
                {field.display}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Compact Filter Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="me">Me</SelectItem>
            <SelectItem value="Rita Johnson">Rita Johnson</SelectItem>
            <SelectItem value="Alex Chen">Alex Chen</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dueFilter} onValueChange={setDueFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Due" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sortedTasks.length} tasks
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due">Due date</SelectItem>
              <SelectItem value="updated">Last updated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={copyDeepLink}>
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="border rounded-lg bg-card">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || assigneeFilter !== "all" || statusFilter !== "all" || dueFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
            {(searchQuery || assigneeFilter !== "all" || statusFilter !== "all" || dueFilter !== "all") && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors group"
              >
                <Checkbox
                  checked={task.status === "Done"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskStatus(task.id);
                  }}
                />

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <p
                    className={cn(
                      "font-medium",
                      task.status === "Done" && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    {task.assignee ? (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60">Unassigned</span>
                    )}
                    {task.due && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span
                          className={cn(
                            isOverdue(task.due) && task.status !== "Done" && "text-destructive font-medium"
                          )}
                        >
                          {formatDueDate(task.due)}
                          {isOverdue(task.due) && task.status !== "Done" && " (overdue)"}
                        </span>
                      </div>
                    )}
                    {task.sourceMeeting && (
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        <button
                          className="hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to meeting
                          }}
                        >
                          {task.sourceMeeting.title}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.externalLink && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {task.externalLink.platform}
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openEditDrawer(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Send to Jira</DropdownMenuItem>
                      <DropdownMenuItem>Send to Linear</DropdownMenuItem>
                      <DropdownMenuItem>Send to Asana</DropdownMenuItem>
                      <DropdownMenuItem disabled className="text-xs">
                        Connect integration first
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Sheet */}
      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedTask && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTask.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="font-medium mt-1">{selectedTask.status}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priority</Label>
                    <p className="font-medium mt-1">{selectedTask.priority}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Assignee</Label>
                    <p className="font-medium mt-1">
                      {selectedTask.assignee || "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due date</Label>
                    <p className="font-medium mt-1">
                      {selectedTask.due
                        ? formatDueDate(selectedTask.due)
                        : "No due date"}
                    </p>
                  </div>
                </div>

                {selectedTask.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="mt-2 text-sm">{selectedTask.notes}</p>
                  </div>
                )}

                {selectedTask.sourceMeeting && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Source Meeting
                    </Label>
                    <p className="font-medium mt-2">
                      {selectedTask.sourceMeeting.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(
                        selectedTask.sourceMeeting.date
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2" size="sm">
                      Open meeting →
                    </Button>
                  </div>
                )}

                {selectedTask.externalLink && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <Label className="text-muted-foreground">External Link</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedTask.externalLink.platform}
                      </Badge>
                      <Button variant="link" className="p-0 h-auto" size="sm">
                        View in {selectedTask.externalLink.platform} →
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Created by {selectedTask.createdBy}</p>
                    <p>Created {selectedTask.createdAt}</p>
                    <p>Last updated {selectedTask.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      openEditDrawer(selectedTask);
                      setSelectedTask(null);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send to…
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Task Sheet */}
      <Sheet
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {editingTask && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {editingTask.title ? "Edit Task" : "New Task"}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add details…"
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-assignee">Assignee</Label>
                    <Select value={editAssignee} onValueChange={setEditAssignee}>
                      <SelectTrigger id="edit-assignee" className="mt-1">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        <SelectItem value="You">You</SelectItem>
                        <SelectItem value="Rita Johnson">Rita Johnson</SelectItem>
                        <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editStatus}
                      onValueChange={(v) => setEditStatus(v as TaskStatus)}
                    >
                      <SelectTrigger id="edit-status" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-due">Due date</Label>
                    <Input
                      id="edit-due"
                      type="date"
                      value={editDue}
                      onChange={(e) => setEditDue(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editPriority}
                      onValueChange={(v) => setEditPriority(v as TaskPriority)}
                    >
                      <SelectTrigger id="edit-priority" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {editingTask.createdAt && (
                  <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                    <p>Created by {editingTask.createdBy}</p>
                    <p>Created {editingTask.createdAt}</p>
                    <p>Last updated {editingTask.lastUpdated}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={saveTask}
                    disabled={!editTitle.trim()}
                  >
                    Save
                  </Button>
                  {editingTask.createdAt && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        deleteTask(editingTask.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Preferences Dialog */}
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Preferences</DialogTitle>
            <DialogDescription>
              Set default values for new tasks
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="default-assignee">Default assignee</Label>
              <Select defaultValue="me">
                <SelectTrigger id="default-assignee" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="me">Me</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="default-due">Default due date</Label>
              <Select defaultValue="none">
                <SelectTrigger id="default-due" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
