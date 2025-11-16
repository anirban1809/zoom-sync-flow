import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiFetch } from "@/lib/api/api";

interface InviteUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface InvitedUser {
    email: string;
    role: string;
}

export function InviteUserModal({ open, onOpenChange }: InviteUserModalProps) {
    const [users, setUsers] = useState<InvitedUser[]>([]);
    const [emailInput, setEmailInput] = useState("");
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setUsers([]);
    }, []);

    const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && emailInput.trim()) {
            e.preventDefault();
            const trimmedEmail = emailInput.trim();
            if (!users.some((u) => u.email === trimmedEmail)) {
                setUsers([...users, { email: trimmedEmail, role: "member" }]);
                setEmailInput("");
            }
        }
    };

    const handlePasteEmails = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteText = e.clipboardData.getData("text");
        const emailList = pasteText
            .split(/[\n,;]/)
            .map((email) => email.trim())
            .filter((email) => email);
        const newUsers = emailList
            .filter((email) => !users.some((u) => u.email === email))
            .map((email) => ({ email, role: "member" }));
        if (newUsers.length > 0) {
            setUsers([...users, ...newUsers]);
            setEmailInput("");
            e.preventDefault();
        }
    };

    const handleRemoveUser = (email: string) => {
        setUsers(users.filter((u) => u.email !== email));
    };

    const handleRoleChange = (email: string, role: string) => {
        setUsers(users.map((u) => (u.email === email ? { ...u, role } : u)));
    };

    const handleSendInvites = () => {
        setIsSending(true);
        apiFetch("/invite", {
            method: "POST",
            body: JSON.stringify({
                workspaceId: sessionStorage.getItem("selected_workspace_id"),
                workspaceName: sessionStorage.getItem(
                    "selected_workspace_name"
                ),
                invites: users,
            }),
        }).then((res) => setIsSending(false));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                    <DialogTitle>Invite users</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-auto">
                    <div className="px-6 py-6">
                        <div className="space-y-6">
                            {/* Add people */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">
                                    Add people
                                </Label>

                                <Input
                                    placeholder="Enter email addresses (press Enter to add)..."
                                    value={emailInput}
                                    onChange={(e) =>
                                        setEmailInput(e.target.value)
                                    }
                                    onKeyDown={handleAddEmail}
                                    onPaste={handlePasteEmails}
                                />
                            </div>

                            {/* User list with roles */}
                            {users.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">
                                        Invited users ({users.length})
                                    </Label>
                                    <div className="space-y-2">
                                        {users.map((user) => (
                                            <div
                                                key={user.email}
                                                className="flex items-center gap-3 p-3 border rounded-lg bg-background"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(role) =>
                                                        handleRoleChange(
                                                            user.email,
                                                            role
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            Admin
                                                        </SelectItem>
                                                        <SelectItem value="member">
                                                            Member
                                                        </SelectItem>
                                                        <SelectItem value="viewer">
                                                            Viewer
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemoveUser(
                                                            user.email
                                                        )
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="welcome-email"
                                    className="text-sm font-normal"
                                >
                                    Send welcome email
                                </Label>
                                <Switch
                                    id="welcome-email"
                                    checked={sendWelcomeEmail}
                                    onCheckedChange={setSendWelcomeEmail}
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSendInvites}
                        disabled={users.length === 0 || isSending}
                    >
                        {isSending ? "Sending..." : "Send invites"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
