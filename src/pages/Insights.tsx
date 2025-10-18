import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/KPICard";
import { ExceptionListItem } from "@/components/ExceptionListItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  AlertCircle,
  Mail,
  CheckCircle,
  Video,
  FileText,
  ListTodo,
  RotateCcw,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";

export default function Insights() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("30");
  const [teamFilter, setTeamFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");

  const handleResetFilters = () => {
    setDateRange("30");
    setTeamFilter("all");
    setProviderFilter("all");
  };

  const hasActiveFilters =
    dateRange !== "30" || teamFilter !== "all" || providerFilter !== "all";

  // Mock KPI data
  const kpiData = [
    {
      label: "Meetings Captured",
      value: "142",
      delta: { value: 12, isPositive: true },
      sparklineData: [45, 52, 48, 60, 55, 65, 68],
      info: "Total number of meetings recorded in the selected period",
      onClick: () => navigate("/meetings"),
    },
    {
      label: "Transcript Success Rate",
      value: "96%",
      delta: { value: 3, isPositive: true },
      sparklineData: [88, 90, 92, 94, 95, 95, 96],
      info: "Percentage of meetings with successfully generated transcripts",
      onClick: () => navigate("/meetings"),
    },
    {
      label: "Recap Delivery Rate",
      value: "89%",
      delta: { value: 5, isPositive: false },
      sparklineData: [92, 93, 91, 90, 89, 88, 89],
      info: "Percentage of meetings with recaps sent to participants",
      onClick: () => navigate("/meetings"),
    },
    {
      label: "Unique Viewers",
      value: "87",
      delta: { value: 8, isPositive: true },
      sparklineData: [65, 70, 72, 75, 80, 83, 87],
      info: "Number of distinct people who viewed meeting content",
      onClick: () => navigate("/meetings"),
    },
    {
      label: "Action Items Created",
      value: "234",
      delta: { value: 15, isPositive: true },
      sparklineData: [180, 190, 200, 210, 220, 228, 234],
      info: "Total action items extracted from meetings",
      onClick: () => navigate("/tasks"),
    },
    {
      label: "Action Follow-through",
      value: "78%",
      delta: { value: 2, isPositive: true },
      sparklineData: [74, 75, 76, 76, 77, 77, 78],
      info: "Percentage of action items completed on time",
      onClick: () => navigate("/tasks"),
    },
  ];

  // Mock trend data
  const trendData = [
    { date: "Day 1", meetings: 4, followThrough: 75 },
    { date: "Day 5", meetings: 5, followThrough: 78 },
    { date: "Day 10", meetings: 6, followThrough: 76 },
    { date: "Day 15", meetings: 4, followThrough: 80 },
    { date: "Day 20", meetings: 7, followThrough: 79 },
    { date: "Day 25", meetings: 5, followThrough: 82 },
    { date: "Day 30", meetings: 6, followThrough: 78 },
  ];

  // Mock exception data
  const atRiskCaptures = [
    {
      id: "1",
      title: "Q4 Planning Review",
      date: "2 hours ago",
      reason: "Transcript missing",
    },
    {
      id: "2",
      title: "Client Onboarding Call",
      date: "Yesterday",
      reason: "Recording failed",
    },
    {
      id: "3",
      title: "Sprint Retrospective",
      date: "2 days ago",
      reason: "Low audio quality",
    },
  ];

  const unsentRecaps = [
    {
      id: "1",
      title: "Product Roadmap Discussion",
      completedTime: "3 hours ago",
    },
    {
      id: "2",
      title: "Marketing Strategy Session",
      completedTime: "5 hours ago",
    },
    {
      id: "3",
      title: "Team All-Hands",
      completedTime: "Yesterday",
    },
  ];

  const overdueActions = [
    {
      id: "1",
      title: "Update API documentation",
      assignee: "Sarah Chen",
      dueDate: "2 days ago",
    },
    {
      id: "2",
      title: "Review contract terms",
      assignee: "Mike Johnson",
      dueDate: "1 day ago",
    },
    {
      id: "3",
      title: "Complete user research report",
      assignee: "Emily Davis",
      dueDate: "Today",
    },
  ];

  const metricDefinitions = [
    {
      name: "Meetings Captured",
      definition:
        "Total number of meetings recorded and processed by the system during the selected time period.",
    },
    {
      name: "Transcript Success Rate",
      definition:
        "Percentage of recorded meetings that successfully generated accurate transcripts. Calculated as (meetings with transcripts / total meetings) × 100.",
    },
    {
      name: "Recap Delivery Rate",
      definition:
        "Percentage of completed meetings where recap summaries were successfully sent to all participants. Calculated as (meetings with sent recaps / completed meetings) × 100.",
    },
    {
      name: "Unique Viewers",
      definition:
        "Count of distinct individuals who accessed meeting recordings, transcripts, or recaps during the selected period.",
    },
    {
      name: "Action Items Created",
      definition:
        "Total number of action items extracted from meeting transcripts and summaries during the selected time period.",
    },
    {
      name: "Action Follow-through",
      definition:
        "Percentage of action items that were completed by their due date. Calculated as (completed on-time actions / total due actions) × 100.",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Insights</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Track meeting performance, engagement, and action item
                    follow-through across your organization
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground mt-1">
            Monitor meeting effectiveness and team productivity metrics
          </p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="mine">My Team</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="zoom">Zoom</SelectItem>
            <SelectItem value="teams">Microsoft Teams</SelectItem>
            <SelectItem value="meet">Google Meet</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Trend Card */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Trend</CardTitle>
          <CardDescription>
            Meeting capture volume and action follow-through rate over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="meetings"
                fill="hsl(var(--primary))"
                name="Meetings Captured"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="followThrough"
                stroke="hsl(var(--chart-2))"
                name="Follow-through %"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attention Panel */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* At-Risk Captures */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              At-Risk Captures
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {atRiskCaptures.map((item) => (
                <ExceptionListItem
                  key={item.id}
                  icon={Video}
                  title={item.title}
                  metadata={item.date}
                  badge={{ text: item.reason, variant: "destructive" }}
                  onClick={() => navigate(`/meetings/${item.id}`)}
                />
              ))}
            </div>
            <div className="p-4 border-t">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/meetings")}
              >
                View all capture issues →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Unsent Recaps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-500" />
              Unsent Recaps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {unsentRecaps.map((item) => (
                <ExceptionListItem
                  key={item.id}
                  icon={FileText}
                  title={item.title}
                  metadata={item.completedTime}
                  quickAction={{
                    label: "Send recap",
                    onClick: () => console.log("Send recap", item.id),
                  }}
                  onClick={() => navigate(`/meetings/${item.id}`)}
                />
              ))}
            </div>
            <div className="p-4 border-t">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/meetings")}
              >
                View all unsent recaps →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-red-500" />
              Overdue Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {overdueActions.map((item) => (
                <ExceptionListItem
                  key={item.id}
                  icon={ListTodo}
                  title={item.title}
                  metadata={`${item.assignee} • ${item.dueDate}`}
                  onClick={() => navigate("/tasks")}
                />
              ))}
            </div>
            <div className="p-4 border-t">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/tasks")}
              >
                View all overdue tasks →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Help */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 h-auto">
              <HelpCircle className="h-4 w-4 mr-2" />
              How are these metrics calculated?
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Metric Definitions</DialogTitle>
              <DialogDescription>
                Understanding how each metric is calculated
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {metricDefinitions.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-semibold">{metric.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {metric.definition}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Button variant="link" className="p-0 h-auto">
          <MessageSquare className="h-4 w-4 mr-2" />
          Send feedback
        </Button>
      </div>
    </div>
  );
}
