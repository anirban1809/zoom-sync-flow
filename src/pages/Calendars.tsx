import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  RefreshCw,
  Check,
  Settings,
  Clock,
  Users,
} from "lucide-react";
import ConnectCalendarModal from "@/components/ConnectCalendarModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Empty array to show empty state - replace with actual data
const connectedCalendars: {
  id: string;
  provider: string;
  email: string;
  status: string;
  lastSync: string;
  autoJoin: boolean;
  meetings: number;
}[] = [
  {
    id: "1",
    provider: "Google Calendar",
    email: "john.doe@company.com",
    status: "connected",
    lastSync: "2 minutes ago",
    autoJoin: true,
    meetings: 42,
  },
  {
    id: "2",
    provider: "Microsoft 365",
    email: "john@microsoft-account.com",
    status: "connected",
    lastSync: "5 minutes ago",
    autoJoin: true,
    meetings: 28,
  },
];

export default function Calendars() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <ConnectCalendarModal
        open={connectModalOpen}
        onOpenChange={setConnectModalOpen}
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendars</h1>
        <p className="text-muted-foreground mt-2">
          Connect your calendars to automatically detect and join meetings
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Calendars</CardTitle>
              <CardDescription>
                Manage calendar connections and sync settings
              </CardDescription>
            </div>
            <Button onClick={() => setConnectModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Connect Calendar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {connectedCalendars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No calendars connected</h3>
              <p className="text-muted-foreground max-w-sm mb-4">
                Connect your calendar to automatically detect meetings and enable auto-join features.
              </p>
              <Button onClick={() => setConnectModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Calendar
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Calendar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Meetings</TableHead>
                  <TableHead>Auto-join</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedCalendars.map((calendar) => (
                  <TableRow key={calendar.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{calendar.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {calendar.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {calendar.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {calendar.lastSync}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {calendar.meetings}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`auto-join-${calendar.id}`}
                          checked={calendar.autoJoin}
                        />
                        <Label
                          htmlFor={`auto-join-${calendar.id}`}
                          className="text-sm cursor-pointer"
                        >
                          Enabled
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Sync
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
