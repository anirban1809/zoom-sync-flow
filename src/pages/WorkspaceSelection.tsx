import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Building2, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

interface Workspace {
    id: string;
    name: string;
    description?: string;
    role: WorkspaceRole;
}

const WorkspaceSelection = () => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    
    // Mock user email - in production, get from auth context
    const userEmail = "user@example.com";
    
    // Mock workspaces - in production, fetch from API
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

    useEffect(() => {
        // Mock: Fetch user's workspace memberships
        const fetchWorkspaces = async () => {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                // Mock data - change array to test different scenarios
                const mockWorkspaces: Workspace[] = [
                    {
                        id: "ws-1",
                        name: "Acme Design Team",
                        description: "Main design workspace",
                        role: "OWNER"
                    },
                    {
                        id: "ws-2",
                        name: "Marketing Department",
                        role: "ADMIN"
                    },
                    {
                        id: "ws-3",
                        name: "Engineering Hub",
                        description: "Product development",
                        role: "MEMBER"
                    }
                ];
                
                setWorkspaces(mockWorkspaces);
                
                // Auto-select if only one workspace
                if (mockWorkspaces.length === 1) {
                    setSelectedWorkspace(mockWorkspaces[0].id);
                }
                
                setLoading(false);
            }, 500);
        };

        fetchWorkspaces();
    }, []);

    const handleContinue = () => {
        if (workspaces.length === 1) {
            // Navigate directly for single workspace
            navigate("/onboarding"); // In production: navigate(`/app/${workspaces[0].id}`)
        } else if (selectedWorkspace) {
            // Navigate to selected workspace
            navigate("/onboarding"); // In production: navigate(`/app/${selectedWorkspace}`)
        }
    };

    const getRoleBadgeVariant = (role: WorkspaceRole) => {
        switch (role) {
            case "OWNER":
                return "default";
            case "ADMIN":
                return "secondary";
            case "MEMBER":
                return "outline";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading workspaces...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="absolute top-4 right-4"
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">luminote.ai</h1>
                    <h2 className="text-2xl font-bold">Choose a workspace</h2>
                    <p className="text-sm text-muted-foreground">
                        Signed in as <span className="font-medium text-foreground">{userEmail}</span>
                    </p>
                </div>

                {/* No Workspaces */}
                {workspaces.length === 0 && (
                    <Card className="p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                This account is not a member of any workspace
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                If you expected to see a workspace, ask an owner or admin to invite you.
                            </p>
                        </div>
                        <div className="pt-4">
                            <Button
                                onClick={() => navigate("/signup")}
                                size="lg"
                            >
                                Create a new workspace
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Single Workspace */}
                {workspaces.length === 1 && (
                    <div className="space-y-4">
                        <Card className="p-6 space-y-4 border-2 border-primary">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="text-lg font-semibold">
                                            {workspaces[0].name}
                                        </h3>
                                        <Badge variant={getRoleBadgeVariant(workspaces[0].role)}>
                                            {workspaces[0].role}
                                        </Badge>
                                    </div>
                                    {workspaces[0].description && (
                                        <p className="text-sm text-muted-foreground">
                                            {workspaces[0].description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                        <Button
                            onClick={handleContinue}
                            size="lg"
                            className="w-full"
                        >
                            Continue to workspace
                        </Button>
                    </div>
                )}

                {/* Multiple Workspaces */}
                {workspaces.length > 1 && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {workspaces.map((workspace) => (
                                <Card
                                    key={workspace.id}
                                    className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                                        selectedWorkspace === workspace.id
                                            ? "border-2 border-primary bg-accent-light"
                                            : "border"
                                    }`}
                                    onClick={() => setSelectedWorkspace(workspace.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                            selectedWorkspace === workspace.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        }`}>
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <h3 className="font-semibold">
                                                    {workspace.name}
                                                </h3>
                                                <Badge variant={getRoleBadgeVariant(workspace.role)}>
                                                    {workspace.role}
                                                </Badge>
                                            </div>
                                            {workspace.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {workspace.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedWorkspace}
                                size="lg"
                                className="w-full"
                            >
                                Continue
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                You can switch workspaces later from inside the app
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-4">
                    <Link to="/help-support" className="hover:text-foreground">
                        Help
                    </Link>
                    <span>•</span>
                    <a href="#" className="hover:text-foreground">
                        Privacy
                    </a>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceSelection;
