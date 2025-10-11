import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  Send,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const categories = [
  { id: "all", label: "All" },
  { id: "articles", label: "Articles" },
  { id: "faqs", label: "FAQs" },
  { id: "getting-started", label: "Getting Started" },
  { id: "billing", label: "Billing" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
];

const quickActions = [
  { label: "Getting started guide", icon: FileText },
  { label: "Troubleshoot recording issues", icon: AlertCircle },
  { label: "Billing & subscriptions", icon: FileText },
  { label: "Integrations setup", icon: FileText },
];

const featuredHelp = [
  {
    title: "Recordings & Transcripts",
    description: "Learn how to manage and share your meeting recordings",
    category: "Recordings",
  },
  {
    title: "Meetings & Calendar",
    description: "Sync calendars and schedule meetings efficiently",
    category: "Calendar",
  },
  {
    title: "Tasks & Automations",
    description: "Automate workflows and manage action items",
    category: "Automation",
  },
  {
    title: "Data Management & Security",
    description: "Understand data retention and security policies",
    category: "Security",
  },
  {
    title: "Billing & Accounts",
    description: "Manage subscriptions and payment methods",
    category: "Billing",
  },
  {
    title: "Integrations (Zoom/Meet/Teams/CRM)",
    description: "Connect with your favorite tools",
    category: "Integrations",
  },
];

const faqs = [
  {
    question: "How do I record a meeting?",
    answer:
      "To record a meeting, simply add the Recordin.ai bot to your calendar invite. The bot will automatically join and start recording when the meeting begins.",
  },
  {
    question: "Where can I find my transcripts?",
    answer:
      "All transcripts are available in the Meetings section. Click on any past meeting to view its recording, transcript, and AI-generated summary.",
  },
  {
    question: "Can I edit transcripts?",
    answer:
      "Yes, you can edit transcripts directly in the meeting detail page. Click the edit icon next to any section to make changes.",
  },
  {
    question: "How do I share a recording?",
    answer:
      "Navigate to the meeting detail page and click the 'Share' button. You can generate a shareable link or invite specific people via email.",
  },
  {
    question: "What integrations are supported?",
    answer:
      "We support Google Meet, Zoom, Microsoft Teams, Slack, Salesforce, HubSpot, and many more. Check the Integrations page for the full list.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Go to Settings > Billing and click 'Manage Subscription'. You can cancel or modify your plan at any time.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use enterprise-grade encryption and comply with SOC 2, GDPR, and HIPAA standards. Learn more in our Security & Compliance page.",
  },
  {
    question: "How long are recordings stored?",
    answer:
      "Recordings are stored based on your plan. Free plans retain data for 30 days, while paid plans offer unlimited storage.",
  },
];

const recentTickets = [
  {
    id: "#12345",
    subject: "Recording not joining meeting",
    status: "In Progress",
    updated: "2 hours ago",
  },
  {
    id: "#12344",
    subject: "Transcript accuracy issue",
    status: "Resolved",
    updated: "1 day ago",
  },
  {
    id: "#12343",
    subject: "Integration connection failed",
    status: "Waiting for response",
    updated: "2 days ago",
  },
];

const quickLinks = [
  { label: "Community forum / Feature requests", url: "#" },
  { label: "API & developer docs", url: "#" },
  { label: "Privacy, security & compliance", url: "#" },
  { label: "Training webinars & tutorials", url: "#" },
];

const articles = [
  {
    title: "Getting Started with Recordin.ai",
    snippet:
      "Learn the basics of setting up your account and recording your first meeting",
    category: "Getting Started",
    readTime: "5 min",
    badge: "New",
  },
  {
    title: "Advanced Search Tips",
    snippet:
      "Master search operators to find exactly what you need in your transcripts",
    category: "Features",
    readTime: "3 min",
    badge: null,
  },
  {
    title: "Setting Up Zoom Integration",
    snippet: "Step-by-step guide to connect your Zoom account",
    category: "Integrations",
    readTime: "4 min",
    badge: "Updated",
  },
  {
    title: "Understanding Your Bill",
    snippet: "Breakdown of pricing tiers and usage calculations",
    category: "Billing",
    readTime: "6 min",
    badge: null,
  },
];

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    }, 3000);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-1">
          Find answers, get help, or contact our support team
        </p>
      </div>

      {/* System Status Banner */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">All systems operational</p>
              <p className="text-sm text-muted-foreground">
                Last updated: 5 minutes ago
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            View incident details
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search help articles, FAQs, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="h-auto py-4 justify-start gap-3"
          >
            <action.icon className="h-5 w-5" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Help Blocks */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Help Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredHelp.map((item, idx) => (
                  <Card
                    key={idx}
                    className="hover:border-primary transition-colors cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {item.title}
                          </CardTitle>
                          <Badge variant="outline" className="mt-2">
                            {item.category}
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription className="mt-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button variant="link" className="mt-4">
                View all FAQs →
              </Button>
            </CardContent>
          </Card>

          {/* Article List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Help Articles</CardTitle>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="views">Most viewed</SelectItem>
                    <SelectItem value="updated">Recently updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {articles.map((article, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{article.title}</h4>
                      {article.badge && (
                        <Badge
                          variant={
                            article.badge === "New" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {article.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {article.snippet}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{article.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Load more articles
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Assist Panel */}
        <div className="space-y-6">
          {/* Contact Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>We're here to help</CardDescription>
            </CardHeader>
            <CardContent>
              {ticketSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium">Ticket submitted!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ticket ID: #12346
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We'll respond within 24 hours
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View ticket
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="email">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        placeholder="Brief description of your issue"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={ticketCategory}
                        onValueChange={setTicketCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recordings">
                            Recordings/Transcripts
                          </SelectItem>
                          <SelectItem value="meetings">
                            Meetings/Calendar
                          </SelectItem>
                          <SelectItem value="tasks">
                            Tasks/Automations
                          </SelectItem>
                          <SelectItem value="integrations">
                            Integrations
                          </SelectItem>
                          <SelectItem value="security">
                            Data/Security
                          </SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your issue in detail..."
                        rows={4}
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Attachments</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload files
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="diagnostics" className="text-sm">
                          Include diagnostic info
                        </Label>
                        <Switch id="diagnostics" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="logs" className="text-sm">
                          Include last meeting logs
                        </Label>
                        <Switch id="logs" />
                      </div>
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={handleSubmitTicket}
                    >
                      <Send className="h-4 w-4" />
                      Submit ticket
                    </Button>
                  </TabsContent>
                  <TabsContent value="chat" className="mt-4">
                    <div className="text-center py-8 space-y-3">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Chat currently unavailable
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please use email support or schedule a call
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Schedule a call
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1">
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
                  <p className="text-sm text-muted-foreground mb-1">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.updated}
                  </p>
                </div>
              ))}
              <Button variant="link" className="w-full">
                View all tickets →
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((link, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <a href={link.url}>
                    {link.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
