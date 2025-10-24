import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  Info,
  Building2,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api/api";

const mockNotifications = [
  {
    id: "1",
    type: "success",
    title: "Meeting recorded",
    message: "Q4 Planning Meeting has been successfully recorded and processed",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New task assigned",
    message: 'You have been assigned to "Review marketing proposal"',
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Upcoming meeting",
    message: "Team Sync starts in 15 minutes",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "success",
    title: "Task completed",
    message: 'Sarah completed "Update website copy"',
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "New integration",
    message: "Slack integration is now active",
    time: "1 day ago",
    read: true,
  },
];

const mockWorkspaces = [
  {
    id: "1",
    name: "Acme Corp",
    role: "Owner",
    current: true,
  },
  {
    id: "2",
    name: "TechStart Inc",
    role: "Admin",
    current: false,
  },
  {
    id: "3",
    name: "Design Studio",
    role: "Member",
    current: false,
  },
];

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search meetings, tasks, or press Cmd+K"
            className="pl-9"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Meeting Note</DropdownMenuItem>
            <DropdownMenuItem>Task</DropdownMenuItem>
            <DropdownMenuItem>Template</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Automation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[400px]">
              {mockNotifications.length > 0 ? (
                <div className="space-y-1 p-2">
                  {mockNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <button
                        className={`w-full text-left p-3 rounded-lg hover:bg-accent transition-colors ${
                          !notification.read ? "bg-accent/50" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 space-y-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium leading-tight">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </button>
                      {index < mockNotifications.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              )}
            </ScrollArea>
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Alex Kim | Acme Corp</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Alex Kim</span>
                <span className="text-xs text-muted-foreground">
                  alex@acme.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Workspace Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowWorkspaceSwitcher(true)}>
              Switch Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await apiFetch("/auth/logout", {
                  method: "POST",
                  body: JSON.stringify({}),
                });
                sessionStorage.removeItem("access_token");
                navigate("/login");
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={showWorkspaceSwitcher}
        onOpenChange={setShowWorkspaceSwitcher}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch Workspace</DialogTitle>
            <DialogDescription>
              Select a workspace to switch to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {mockWorkspaces.map((workspace) => (
              <button
                key={workspace.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                onClick={() => {
                  // Handle workspace switch
                  setShowWorkspaceSwitcher(false);
                }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <Building2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{workspace.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {workspace.role}
                  </p>
                </div>
                {workspace.current && (
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
