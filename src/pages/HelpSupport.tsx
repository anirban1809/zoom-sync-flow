import { useState } from "react";
import {
  Search,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  FileText,
  Upload,
  Send,
  Calendar,
  Shield,
  CreditCard,
  Zap,
  MessageSquare,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const topics = [
  {
    id: "recordings",
    title: "Recordings & Transcripts",
    description: "Manage and share your meeting recordings",
    icon: Video,
  },
  {
    id: "calendar",
    title: "Meetings & Calendar",
    description: "Sync calendars and schedule meetings",
    icon: Calendar,
  },
  {
    id: "automations",
    title: "Tasks & Automations",
    description: "Automate workflows and action items",
    icon: Zap,
  },
  {
    id: "security",
    title: "Data & Security",
    description: "Data retention and security policies",
    icon: Shield,
  },
  {
    id: "billing",
    title: "Billing",
    description: "Manage subscriptions and payments",
    icon: CreditCard,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect with your favorite tools",
    icon: FileText,
  },
];

const faqChips = [
  { question: "How do I record a meeting?", answer: "Add the Recordin.ai bot to your calendar invite. The bot will automatically join and start recording when the meeting begins." },
  { question: "Where are my transcripts?", answer: "All transcripts are in the Meetings section. Click any past meeting to view its recording, transcript, and AI summary." },
  { question: "Can I edit transcripts?", answer: "Yes, you can edit transcripts directly in the meeting detail page. Click the edit icon next to any section." },
  { question: "How do I share recordings?", answer: "Go to the meeting detail page and click 'Share'. Generate a link or invite people via email." },
  { question: "What integrations are supported?", answer: "We support Google Meet, Zoom, Microsoft Teams, Slack, Salesforce, HubSpot, and more." },
  { question: "How do I cancel my subscription?", answer: "Go to Settings > Billing and click 'Manage Subscription'. You can cancel or modify your plan anytime." },
  { question: "Is my data secure?", answer: "Yes, we use enterprise-grade encryption and comply with SOC 2, GDPR, and HIPAA standards." },
  { question: "How long are recordings stored?", answer: "Free plans retain data for 30 days, paid plans offer unlimited storage." },
];

const recentTickets = [
  { id: "#12345", subject: "Recording not joining meeting", status: "In Progress", updated: "2 hours ago" },
  { id: "#12344", subject: "Transcript accuracy issue", status: "Resolved", updated: "1 day ago" },
  { id: "#12343", subject: "Integration connection failed", status: "Waiting for response", updated: "2 days ago" },
];

export default function HelpSupport() {
  const [view, setView] = useState<"main" | "search" | "contact">("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSubmitTicket = () => {
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject("");
      setTicketCategory("");
      setTicketDescription("");
      setShowAdvanced(false);
    }, 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header - Simple, decision-first */}
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl font-bold">Help & Support</h1>

        {/* Two primary choices side-by-side */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            variant={view === "search" ? "default" : "outline"}
            onClick={() => setView(view === "search" ? "main" : "search")}
            className="h-auto py-4"
          >
            <Search className="h-5 w-5 mr-2" />
            Search help
          </Button>
          <Button
            size="lg"
            variant={view === "contact" ? "default" : "outline"}
            onClick={() => setView(view === "contact" ? "main" : "contact")}
            className="h-auto py-4"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Contact support
          </Button>
        </div>

        {/* Status line (compact) */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">All systems operational</span>
          </div>
          <Button variant="link" size="sm" className="gap-1 h-auto p-0">
            View status
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Search inline (when activated) */}
      {view === "search" && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search help articles, FAQs, and guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="link" size="sm" className="h-auto p-0">
                Search tips
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact support form (when activated) */}
      {view === "contact" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>We'll respond within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-medium">Ticket submitted!</p>
                  <p className="text-sm text-muted-foreground mt-1">Ticket ID: #12346</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline">View ticket</Button>
                  <Button size="sm" variant="outline">Add more info</Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="email">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      placeholder="Brief description"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={ticketCategory} onValueChange={setTicketCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recordings">Recordings/Transcripts</SelectItem>
                        <SelectItem value="meetings">Meetings/Calendar</SelectItem>
                        <SelectItem value="automations">Tasks/Automations</SelectItem>
                        <SelectItem value="security">Data/Security</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="integrations">Integrations</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your issue..."
                      rows={4}
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Attachments</Label>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Upload className="h-4 w-4" />
                      Attach files
                    </Button>
                  </div>

                  {/* Progressive disclosure */}
                  <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <CollapsibleTrigger asChild>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        {showAdvanced ? "Hide" : "Add details"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Meeting ID (optional)</Label>
                        <Input placeholder="meeting-123" />
                      </div>
                      <div className="space-y-2">
                        <Label>Affected Integration (optional)</Label>
                        <Input placeholder="e.g., Zoom, Slack" />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />
                  <Button className="w-full gap-2" onClick={handleSubmitTicket}>
                    <Send className="h-4 w-4" />
                    Submit ticket
                  </Button>
                </TabsContent>
                <TabsContent value="chat">
                  <div className="text-center py-8 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Chat currently unavailable</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please use email support
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}

      {/* Self-serve section */}
      <div className="space-y-8">
        {/* Quick answers - FAQ chips */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Answers</h2>
          <div className="space-y-2">
            {faqChips.map((faq, idx) => (
              <Card key={idx} className="border">
                <Collapsible open={expandedFaq === idx} onOpenChange={(open) => setExpandedFaq(open ? idx : null)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                      <p className="text-sm font-medium text-left">{faq.question}</p>
                      <ChevronRight className={`h-4 w-4 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`} />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="px-4 pb-4 pt-0">
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
          <Button variant="link" className="mt-4 h-auto p-0">
            View all FAQs →
          </Button>
        </div>

        {/* Browse by topic */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Browse by Topic</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="hover:border-primary transition-colors cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <topic.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{topic.title}</CardTitle>
                      <CardDescription className="mt-1">{topic.description}</CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Your tickets */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
          <Card>
            <CardContent className="pt-6 space-y-3">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{ticket.id}</p>
                      <Badge
                        variant={
                          ticket.status === "Resolved"
                            ? "default"
                            : ticket.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.updated}</p>
                  </div>
                </div>
              ))}
              <Button variant="link" className="w-full h-auto p-0 mt-2">
                View all tickets →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
