import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Download,
  Save,
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

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [scopeChips, setScopeChips] = useState<string[]>([]);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="border-b bg-background flex-shrink-0">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-2xl font-semibold">AI Chat</h1>
              <p className="text-sm text-muted-foreground">
                Ask about your meetings, transcripts, and action items.
              </p>
            </div>
          </div>

          {/* Context Bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {scopeChips.map((chip) => (
                <Badge key={chip} variant="secondary" className="gap-1">
                  {chip}
                  <button
                    className="ml-1"
                    onClick={() => removeScope(chip)}
                  >
                    ×
                  </button>
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
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>

        {/* Composer */}
        <div className="border-t bg-background p-4 flex-shrink-0">
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
    </div>
  );
}
