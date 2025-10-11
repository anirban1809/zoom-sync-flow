import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Send,
  Paperclip,
  Plus,
  Calendar,
  Clock,
  Copy,
  FileText,
  Play,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  History,
  Menu,
  X,
  Download,
  Save,
  Sparkles,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  suggestedFollowUps?: string[];
};

type Source = {
  type: "meeting" | "transcript" | "task" | "account";
  title: string;
  metadata: string;
  snippet: string;
  timestamp?: string;
  confidence: string;
};

type Thread = {
  id: string;
  title: string;
  lastMessage: string;
  pinned: boolean;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [scopeChips, setScopeChips] = useState<string[]>([]);
  const [showSources, setShowSources] = useState(true);
  const [onlyUseScoped, setOnlyUseScoped] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [threads, setThreads] = useState<Thread[]>([
    { id: "1", title: "Q4 customer meetings", lastMessage: "Summarize last week's...", pinned: true },
    { id: "2", title: "Action items review", lastMessage: "List open action items...", pinned: false },
  ]);
  const [leftRailOpen, setLeftRailOpen] = useState(false);
  const [rightRailOpen, setRightRailOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const starterPrompts = [
    "Summarize last week's customer meetings",
    "List open action items due this week",
    "Find decisions about pricing for Acme",
    "Show all mentions of 'renewal' with timestamps",
    "Who hasn't had a meeting with Acme in 30 days?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // Mock assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Based on your meetings and transcripts, here's what I found...",
      sources: [
        {
          type: "meeting",
          title: "Q3 Review with Acme Corp",
          metadata: "Oct 3, 2025 • John Smith • Acme Corp",
          snippet: "We discussed the pricing model and agreed to a 15% discount for annual contracts...",
          timestamp: "12:34",
          confidence: "High confidence",
        },
        {
          type: "transcript",
          title: "Product Strategy Session",
          metadata: "Oct 1, 2025 • Sarah Johnson",
          snippet: "The team decided to prioritize feature X for Q4 delivery...",
          timestamp: "08:15",
          confidence: "Medium confidence",
        },
      ],
      suggestedFollowUps: [
        "What were the key decisions?",
        "Show me related action items",
        "Who attended these meetings?",
      ],
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSourceExpansion = (messageId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const addScope = (scope: string) => {
    setScopeChips([...scopeChips, scope]);
  };

  const removeScope = (scope: string) => {
    setScopeChips(scopeChips.filter((s) => s !== scope));
  };

  useEffect(() => {
    // Focus input on mount
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Rail - Threads & History */}
      <Sheet open={leftRailOpen} onOpenChange={setLeftRailOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Chat History</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <Input placeholder="Search chats..." />
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {threads.map((thread) => (
                  <Card
                    key={thread.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{thread.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {thread.lastMessage}
                          </div>
                        </div>
                        {thread.pinned && (
                          <Badge variant="secondary" className="ml-2">
                            Pinned
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLeftRailOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">AI Chat</h1>
                <p className="text-sm text-muted-foreground">
                  Ask about your meetings, transcripts, and action items.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRightRailOpen(!rightRailOpen)}
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>

          {/* Context Bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {scopeChips.map((chip) => (
                <Badge key={chip} variant="secondary" className="gap-1">
                  {chip}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeScope(chip)}
                  />
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addScope("Last 7 days")}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add scope
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-1 h-3 w-3" />
                Attach meetings
              </Button>
            </div>
          </div>
        </div>

        {/* Conversation Area */}
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-lg font-medium">Get started with AI Chat</h2>
                <p className="text-sm text-muted-foreground">
                  Try one of these prompts or ask your own question
                </p>
              </div>
              <div className="grid gap-3">
                {starterPrompts.map((prompt) => (
                  <Card
                    key={prompt}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setInput(prompt)}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm">{prompt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <div
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {message.role === "assistant" && message.sources && (
                    <Card>
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => toggleSourceExpansion(message.id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">
                            Sources ({message.sources.length})
                          </CardTitle>
                          {expandedSources[message.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </CardHeader>
                      {expandedSources[message.id] && (
                        <CardContent className="space-y-3">
                          {message.sources.map((source, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                      {source.type}
                                    </Badge>
                                    <span className="font-medium text-sm">
                                      {source.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {source.metadata}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {source.confidence}
                                </Badge>
                              </div>
                              <p className="text-sm bg-muted p-2 rounded">
                                "{source.snippet}"
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                <Button variant="ghost" size="sm">
                                  <Play className="mr-1 h-3 w-3" />
                                  Play from {source.timestamp}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="mr-1 h-3 w-3" />
                                  Open transcript
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Save className="mr-1 h-3 w-3" />
                                  Save snippet
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <CheckSquare className="mr-1 h-3 w-3" />
                                  Create task
                                </Button>
                              </div>
                              {idx < message.sources.length - 1 && (
                                <Separator className="my-3" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      )}
                    </Card>
                  )}

                  {message.role === "assistant" && message.suggestedFollowUps && (
                    <div className="flex gap-2 flex-wrap">
                      {message.suggestedFollowUps.map((followUp) => (
                        <Badge
                          key={followUp}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => setInput(followUp)}
                        >
                          {followUp}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {message.role === "assistant" && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Save className="mr-1 h-3 w-3" />
                        Save to notes
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Composer */}
        <div className="border-t bg-background p-4">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-1 h-3 w-3" />
                Mention meeting
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="mr-1 h-3 w-3" />
                Insert timestamp
              </Button>
              <Button variant="outline" size="sm">
                <Paperclip className="mr-1 h-3 w-3" />
                Attach
              </Button>
            </div>
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Ask a question or type / for shortcuts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] resize-none"
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Enter to send, Shift+Enter for new line
              </p>
              <Button variant="link" size="sm" className="text-xs">
                Prompt tips
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Rail - Grounding */}
      {rightRailOpen && (
        <div className="w-80 border-l bg-background p-4 overflow-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Grounding & Sources</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRightRailOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-sources" className="text-sm">
                  Show sources
                </Label>
                <Switch
                  id="show-sources"
                  checked={showSources}
                  onCheckedChange={setShowSources}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="scoped-data" className="text-sm">
                  Only use scoped data
                </Label>
                <Switch
                  id="scoped-data"
                  checked={onlyUseScoped}
                  onCheckedChange={setOnlyUseScoped}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Active Sources</h4>
              <div className="space-y-2">
                <Card>
                  <CardContent className="p-3">
                    <Badge variant="outline" className="mb-2">
                      Meeting
                    </Badge>
                    <p className="text-sm font-medium">Q3 Review</p>
                    <p className="text-xs text-muted-foreground">
                      Oct 3, 2025 • Acme Corp
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <Badge variant="outline" className="mb-2">
                      Transcript
                    </Badge>
                    <p className="text-sm font-medium">Product Strategy</p>
                    <p className="text-xs text-muted-foreground">
                      Oct 1, 2025 • Internal
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
