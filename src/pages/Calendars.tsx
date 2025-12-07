import { useEffect, useState } from "react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiFetch } from "@/lib/api/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Calendars() {
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [calendars, setCalendars] = useState([]);
    const [calendarToDisconnect, setCalendarToDisconnect] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleDisconnect = () => {
        // Handle disconnect logic here
        console.log("Disconnecting calendar:", calendarToDisconnect?.provider);
        setCalendarToDisconnect(null);
    };

    useEffect(() => {
        (async () => {
            const workspaceId = sessionStorage.getItem("selected_workspace_id");
            const response = await apiFetch(
                `/calendars?workspaceId=${workspaceId}`
            );

            const result = await response.json();
            console.log(result);
            setCalendars(result);
            setLoading(false);
            console.log(calendars);
        })();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <ConnectCalendarModal
                open={connectModalOpen}
                onOpenChange={setConnectModalOpen}
            />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Calendars</h1>
                <p className="text-muted-foreground mt-2">
                    Connect your calendars to automatically detect and join
                    meetings
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
                {loading ? (
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-48" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-5 w-10 rounded-full" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                ) : (
                    <CardContent>
                        {calendars.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-muted p-4 mb-4">
                                    <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    No calendars connected
                                </h3>
                                <p className="text-muted-foreground max-w-sm mb-4">
                                    Connect your calendar to automatically
                                    detect meetings and enable auto-join
                                    features.
                                </p>
                                <Button
                                    onClick={() => setConnectModalOpen(true)}
                                >
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
                                        <TableHead>Auto-join</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {calendars.map((calendar, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-primary" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {calendar.provider}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {calendar.owner}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`bg-${
                                                        calendar.status ===
                                                        "CONNECTED"
                                                            ? "success"
                                                            : "destructive"
                                                    }/10 text-${
                                                        calendar.status ===
                                                        "CONNECTED"
                                                            ? "success"
                                                            : "destructive"
                                                    } border-${
                                                        calendar.status ===
                                                        "CONNECTED"
                                                            ? "success"
                                                            : "destructive"
                                                    }/20`}
                                                >
                                                    <Check className="h-3 w-3 mr-1" />
                                                    {calendar.status ===
                                                    "NOT_CONNECTED"
                                                        ? "Not Connected"
                                                        : "Connected"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        id={`auto-join-${calendar.id}`}
                                                        checked={
                                                            calendar.auto_join
                                                        }
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
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            setCalendarToDisconnect(
                                                                calendar
                                                            )
                                                        }
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
                )}
            </Card>

            <AlertDialog
                open={!!calendarToDisconnect}
                onOpenChange={(open) => !open && setCalendarToDisconnect(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Calendar</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to disconnect{" "}
                            <span className="font-medium text-foreground">
                                {calendarToDisconnect?.provider}
                            </span>{" "}
                            ({calendarToDisconnect?.email})? This will stop
                            syncing meetings from this calendar and disable
                            auto-join for its events.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDisconnect}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Disconnect
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
