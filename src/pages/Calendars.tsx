import { useEffect, useState } from "react";
import {
    Calendar as CalendarIcon,
    Plus,
    RefreshCw,
    Check,
    Loader2,
} from "lucide-react";
import ConnectCalendarModal from "@/components/ConnectCalendarModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";

// Platform icons as simple SVG components
const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const MicrosoftIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
        <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
);

interface CalendarData {
    id: string;
    name: string;
    email: string;
    provider: "google" | "microsoft";
    status: "CONNECTED" | "SYNCING" | "NOT_CONNECTED";
    auto_join: boolean;
    owner?: string;
}

interface PlatformConnection {
    connected: boolean;
    email?: string;
    lastSync?: string;
}

// Mock data for demonstration
const mockPlatformConnections: Record<string, PlatformConnection> = {
    google: { connected: true, email: "user@gmail.com", lastSync: "5 minutes ago" },
    microsoft: { connected: false },
};

const mockConnectedCalendars: CalendarData[] = [
    { id: "1", name: "Work Calendar", email: "user@gmail.com", provider: "google", status: "CONNECTED", auto_join: true },
    { id: "2", name: "Personal", email: "user@gmail.com", provider: "google", status: "SYNCING", auto_join: false },
];

const mockAvailableCalendars: CalendarData[] = [
    { id: "3", name: "Team Events", email: "team@gmail.com", provider: "google", status: "NOT_CONNECTED", auto_join: false },
    { id: "4", name: "Holidays", email: "user@gmail.com", provider: "google", status: "NOT_CONNECTED", auto_join: false },
];

export default function Calendars() {
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [calendarToDisconnect, setCalendarToDisconnect] = useState<CalendarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [platformConnections, setPlatformConnections] = useState<Record<string, PlatformConnection>>({
        google: { connected: false },
        microsoft: { connected: false },
    });
    const [connectedCalendars, setConnectedCalendars] = useState<CalendarData[]>([]);
    const [availableCalendars, setAvailableCalendars] = useState<CalendarData[]>([]);

    const handleDisconnect = () => {
        console.log("Disconnecting calendar:", calendarToDisconnect?.name);
        setCalendarToDisconnect(null);
    };

    const handleConnectPlatform = (platform: "google" | "microsoft") => {
        console.log("Connecting platform:", platform);
        setConnectModalOpen(true);
    };

    const handleConnectCalendar = (calendar: CalendarData) => {
        console.log("Connecting calendar:", calendar.name);
    };

    useEffect(() => {
        (async () => {
            const workspaceId = sessionStorage.getItem("selected_workspace_id");
            try {
                const response = await apiFetch(`/calendars?workspaceId=${workspaceId}`);
                const result = await response.json();
                console.log(result);
                // For now, use mock data
                setPlatformConnections(mockPlatformConnections);
                setConnectedCalendars(mockConnectedCalendars);
                setAvailableCalendars(mockAvailableCalendars);
            } catch (error) {
                console.error("Failed to fetch calendars:", error);
                // Use mock data on error
                setPlatformConnections(mockPlatformConnections);
                setConnectedCalendars(mockConnectedCalendars);
                setAvailableCalendars(mockAvailableCalendars);
            }
            setLoading(false);
        })();
    }, []);

    const getConnectedCalendarsForPlatform = (platform: string) =>
        connectedCalendars.filter((c) => c.provider === platform);

    const getAvailableCalendarsForPlatform = (platform: string) =>
        availableCalendars.filter((c) => c.provider === platform);

    const renderPlatformSection = (
        platform: "google" | "microsoft",
        platformName: string,
        Icon: React.ComponentType<{ className?: string }>
    ) => {
        const connection = platformConnections[platform];
        const connected = getConnectedCalendarsForPlatform(platform);
        const available = getAvailableCalendarsForPlatform(platform);

        return (
            <Card key={platform}>
                {/* Platform Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8" />
                        <span className="text-lg font-semibold">{platformName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {connection.connected ? (
                            <>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{connection.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Last synced {connection.lastSync}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reconnect
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-muted-foreground">Not connected</span>
                                <Button onClick={() => handleConnectPlatform(platform)}>
                                    Connect {platformName}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Platform Content */}
                <CardContent className="p-6">
                    {loading ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-40" />
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-5 w-5 rounded" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-40" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                            <Skeleton className="h-5 w-10 rounded-full" />
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !connection.connected ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-muted p-6 mb-6">
                                <Icon className="h-12 w-12 opacity-50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {platformName} is not connected
                            </h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                Connect your {platformName} account to view and manage your calendars,
                                enable auto-join, and sync your meetings.
                            </p>
                            <Button size="lg" onClick={() => handleConnectPlatform(platform)}>
                                Connect {platformName}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Connected Calendars Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-base font-semibold">Connected Calendars</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {connected.length}
                                    </Badge>
                                </div>

                                {connected.length === 0 ? (
                                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            No calendars connected
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Select calendars from the available list below to start syncing
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border border-border rounded-lg divide-y divide-border">
                                        {connected.map((calendar) => (
                                            <div
                                                key={calendar.id}
                                                className="flex items-center justify-between p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CalendarIcon className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{calendar.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {calendar.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            calendar.status === "CONNECTED"
                                                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                                        }
                                                    >
                                                        {calendar.status === "SYNCING" ? (
                                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        ) : (
                                                            <Check className="h-3 w-3 mr-1" />
                                                        )}
                                                        {calendar.status === "SYNCING" ? "Syncing" : "Connected"}
                                                    </Badge>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">Auto-Join</span>
                                                        <Switch
                                                            checked={calendar.auto_join}
                                                            onCheckedChange={() => {}}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setCalendarToDisconnect(calendar)}
                                                    >
                                                        Disconnect
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Available Calendars Section */}
                            {available.length > 0 && (
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-base font-semibold">Available Calendars</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            These calendars are not currently syncing with your account
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-lg divide-y divide-border">
                                        {available.map((calendar) => (
                                            <div
                                                key={calendar.id}
                                                className="flex items-center justify-between p-4 opacity-70"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{calendar.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {calendar.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-sm text-muted-foreground">
                                                        Not connected
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleConnectCalendar(calendar)}
                                                    >
                                                        Connect
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <ConnectCalendarModal
                open={connectModalOpen}
                onOpenChange={setConnectModalOpen}
            />

            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendars</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your calendar connections and sync settings
                    </p>
                </div>
                <Button onClick={() => setConnectModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Calendar
                </Button>
            </div>

            {/* Platform Sections */}
            <div className="space-y-6">
                {renderPlatformSection("google", "Google Calendar", GoogleIcon)}
                {renderPlatformSection("microsoft", "Microsoft Outlook", MicrosoftIcon)}
            </div>

            {/* Disconnect Confirmation Dialog */}
            <AlertDialog
                open={!!calendarToDisconnect}
                onOpenChange={(open) => !open && setCalendarToDisconnect(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Calendar</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <span>
                                Are you sure you want to disconnect{" "}
                                <span className="font-medium text-foreground">
                                    {calendarToDisconnect?.name}
                                </span>{" "}
                                ({calendarToDisconnect?.email})?
                            </span>
                            <span className="block mt-2">
                                Syncing will stop and upcoming events from this calendar will be removed
                                from your account.
                            </span>
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
