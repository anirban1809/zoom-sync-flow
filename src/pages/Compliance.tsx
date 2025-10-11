import { useState } from "react";
import {
  Shield,
  FileText,
  Eye,
  Download,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const auditLogs = [
  {
    id: "1",
    action: "Meeting viewed",
    user: "Alex Kim",
    resource: "Q4 Planning Meeting",
    timestamp: "2024-01-15 10:34:22",
    ip: "192.168.1.1",
  },
  {
    id: "2",
    action: "Transcript exported",
    user: "Sarah Johnson",
    resource: "Product Roadmap Discussion",
    timestamp: "2024-01-15 09:22:11",
    ip: "192.168.1.5",
  },
  {
    id: "3",
    action: "Meeting shared",
    user: "John Smith",
    resource: "Sales Call - Acme Corp",
    timestamp: "2024-01-15 08:15:44",
    ip: "192.168.1.3",
  },
  {
    id: "4",
    action: "User role changed",
    user: "Alex Kim",
    resource: "Sarah Johnson promoted to Manager",
    timestamp: "2024-01-14 16:45:33",
    ip: "192.168.1.1",
  },
  {
    id: "5",
    action: "Integration connected",
    user: "Alex Kim",
    resource: "HubSpot integration",
    timestamp: "2024-01-14 14:20:17",
    ip: "192.168.1.1",
  },
];

const dlpMatches = [
  {
    id: "1",
    meeting: "Customer Support Call",
    type: "Credit Card",
    severity: "high",
    action: "Redacted",
    timestamp: "2024-01-15 11:22:33",
  },
  {
    id: "2",
    meeting: "HR Interview",
    type: "SSN",
    severity: "high",
    action: "Redacted",
    timestamp: "2024-01-15 10:15:22",
  },
  {
    id: "3",
    meeting: "Sales Demo",
    type: "Email Address",
    severity: "medium",
    action: "Flagged",
    timestamp: "2024-01-14 15:44:11",
  },
];

const dataRequests = [
  {
    id: "1",
    type: "Export",
    requestor: "john.doe@example.com",
    status: "completed",
    created: "2024-01-10",
    completed: "2024-01-11",
  },
  {
    id: "2",
    type: "Erase",
    requestor: "jane.smith@example.com",
    status: "pending_approval",
    created: "2024-01-14",
    completed: null,
  },
  {
    id: "3",
    type: "Export",
    requestor: "bob.wilson@example.com",
    status: "processing",
    created: "2024-01-15",
    completed: null,
  },
];

export default function Compliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("audit");

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-semibold">Compliance & Audit</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Security monitoring and data governance
              </p>
            </div>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">98.5%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Overall score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                Audit Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                DLP Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">23</p>
              <p className="text-sm text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Data Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-muted-foreground mt-1">
                Active requests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="audit">
              <Eye className="h-4 w-4 mr-2" />
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="dlp">
              <Lock className="h-4 w-4 mr-2" />
              DLP Matches
            </TabsTrigger>
            <TabsTrigger value="requests">
              <FileText className="h-4 w-4 mr-2" />
              Data Requests
            </TabsTrigger>
          </TabsList>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Audit Log</CardTitle>
                    <CardDescription>
                      Track all access, exports, and configuration changes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="view">Views</SelectItem>
                        <SelectItem value="export">Exports</SelectItem>
                        <SelectItem value="share">Shares</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="secondary">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.user}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.resource}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.ip}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DLP Matches Tab */}
          <TabsContent value="dlp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>DLP Policy Matches</CardTitle>
                <CardDescription>
                  Sensitive data detected and automatically redacted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meeting</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dlpMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          {match.meeting}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{match.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              match.severity === "high"
                                ? "destructive"
                                : match.severity === "medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {match.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-success" />
                            <span>{match.action}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {match.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Subject Requests</CardTitle>
                <CardDescription>
                  GDPR and CCPA data export and deletion requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Requestor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Badge
                            variant={
                              request.type === "Export"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {request.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.requestor}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {request.status === "completed" && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                            {request.status === "processing" && (
                              <Clock className="h-4 w-4 text-warning" />
                            )}
                            {request.status === "pending_approval" && (
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            )}
                            <span className="capitalize">
                              {request.status.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.created}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.completed || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "pending_approval" && (
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                Approve
                              </Button>
                              <Button size="sm" variant="ghost">
                                Reject
                              </Button>
                            </div>
                          )}
                          {request.status === "completed" && (
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
