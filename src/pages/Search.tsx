import {
  Search as SearchIcon,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckSquare,
  PlayCircle,
  Video,
  Mic,
  Tag,
  X,
  Info,
  ArrowUpDown,
  Link2,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Mock data for unified search results
const mockResults = [
  {
    id: "m1",
    type: "meeting" as const,
    title: "Q4 Planning Discussion",
    date: "2025-10-15",
    time: "10:00 AM",
    provider: "Zoom",
    participants: 8,
    tags: ["planning", "quarterly"],
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "t1",
    type: "transcript" as const,
    snippet: "We need to prioritize the customer retention strategy for Q4...",
    speaker: "Sarah Chen",
    timestamp: "00:15:32",
    meetingTitle: "Q4 Planning Discussion",
    meetingDate: "2025-10-15",
  },
  {
    id: "task1",
    type: "task" as const,
    title: "Review pricing model for enterprise tier",
    status: "in-progress",
    dueDate: "2025-10-20",
    assignee: "Mike Johnson",
    sourceMeeting: "Pricing Strategy Session",
  },
  {
    id: "m2",
    type: "meeting" as const,
    title: "Customer Feedback Review",
    date: "2025-10-14",
    time: "2:00 PM",
    provider: "Google Meet",
    participants: 5,
    tags: ["customer"],
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "t2",
    type: "transcript" as const,
    snippet:
      "The pricing feedback from enterprise customers has been consistently positive...",
    speaker: "Alex Rivera",
    timestamp: "00:08:15",
    meetingTitle: "Customer Feedback Review",
    meetingDate: "2025-10-14",
  },
  {
    id: "task2",
    type: "task" as const,
    title: "Update customer retention dashboard",
    status: "completed",
    dueDate: "2025-10-18",
    assignee: "Sarah Chen",
    sourceMeeting: "Q4 Planning Discussion",
  },
];

const suggestedPrompts = [
  "action items due this week",
  "decisions about pricing",
  "meetings with customer tag",
  "owner:me has:recording",
  "transcript mentions budget",
];

const recentSearches = [
  "pricing strategy",
  "owner:me has:transcript",
  "customer feedback after:2025-10-01",
];

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [owner, setOwner] = useState("all");
  const [hasRecording, setHasRecording] = useState(false);
  const [hasTranscript, setHasTranscript] = useState(false);
  const [hasActionItems, setHasActionItems] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [operatorChips, setOperatorChips] = useState<
    Array<{ key: string; value: string }>
  >([]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      // Parse operators from query
      const operators = [];
      if (searchQuery.includes("owner:")) {
        const match = searchQuery.match(/owner:(\w+)/);
        if (match) operators.push({ key: "owner", value: match[1] });
      }
      if (searchQuery.includes("has:recording"))
        operators.push({ key: "has", value: "recording" });
      if (searchQuery.includes("has:transcript"))
        operators.push({ key: "has", value: "transcript" });
      if (searchQuery.includes("tag:")) {
        const match = searchQuery.match(/tag:(\w+)/);
        if (match) operators.push({ key: "tag", value: match[1] });
      }
      setOperatorChips(operators);

      const timer = setTimeout(() => {
        setIsSearching(false);
        setShowResults(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
      setOperatorChips([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowRecentSearches(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDateRange("30");
    setOwner("all");
    setHasRecording(false);
    setHasTranscript(false);
    setHasActionItems(false);
    setOperatorChips([]);
  };

  const removeOperatorChip = (key: string) => {
    const newQuery = searchQuery
      .replace(new RegExp(`${key}:\\w+\\s*`, "g"), "")
      .trim();
    setSearchQuery(newQuery);
  };

  const copySearchLink = () => {
    const params = new URLSearchParams({
      q: searchQuery,
      date: dateRange,
      owner,
      ...(hasRecording && { hasRecording: "true" }),
      ...(hasTranscript && { hasTranscript: "true" }),
      ...(hasActionItems && { hasActionItems: "true" }),
    });
    const url = `${window.location.origin}/search?${params.toString()}`;
    navigator.clipboard.writeText(url);
    toast.success("Search link copied to clipboard");
  };

  const handleResultClick = (result: typeof mockResults[0]) => {
    if (result.type === "meeting") {
      navigate(`/meetings/${result.id}`);
    } else if (result.type === "transcript") {
      // Navigate to meeting detail with timestamp
      const meetingId = result.meetingTitle.toLowerCase().replace(/\s+/g, "-");
      navigate(`/meetings/${meetingId}?timestamp=${result.timestamp}`);
    } else if (result.type === "task") {
      navigate(`/tasks?taskId=${result.id}`);
    }
  };

  const filteredResults = showResults ? mockResults : [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Search</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Search syntax
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="space-y-3">
                <h4 className="font-semibold">Search operators</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">owner:me</code>
                    <span className="text-muted-foreground ml-2">
                      Items owned by you
                    </span>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">
                      has:recording
                    </code>
                    <span className="text-muted-foreground ml-2">
                      Meetings with recordings
                    </span>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">
                      has:transcript
                    </code>
                    <span className="text-muted-foreground ml-2">
                      Meetings with transcripts
                    </span>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">
                      tag:customer
                    </code>
                    <span className="text-muted-foreground ml-2">
                      Items tagged "customer"
                    </span>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">
                      before:2025-10-01
                    </code>
                    <span className="text-muted-foreground ml-2">
                      Before a date
                    </span>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">
                      after:2025-09-01
                    </code>
                    <span className="text-muted-foreground ml-2">
                      After a date
                    </span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-muted-foreground">
          Search across meetings, transcripts, and tasks
        </p>
      </div>

      {/* Global Search Bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search... (try owner:me, has:recording, tag:customer)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => !searchQuery && setShowRecentSearches(true)}
            onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Recent Searches Dropdown */}
        {showRecentSearches && recentSearches.length > 0 && (
          <Card className="absolute z-50 w-full mt-1 p-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              Recent searches
            </div>
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                className="w-full text-left px-2 py-1.5 hover:bg-accent rounded text-sm"
                onClick={() => handleSearch(search)}
              >
                <SearchIcon className="h-3 w-3 inline mr-2 text-muted-foreground" />
                {search}
              </button>
            ))}
          </Card>
        )}
      </div>

      {/* Suggested Prompts (when empty) */}
      {!searchQuery && !showResults && (
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">
            Try searching for:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleSearch(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Filter Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            <SelectItem value="me">Me</SelectItem>
            <SelectItem value="sarah">Sarah Chen</SelectItem>
            <SelectItem value="mike">Mike Johnson</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={hasRecording ? "default" : "outline"}
            size="sm"
            onClick={() => setHasRecording(!hasRecording)}
          >
            <Video className="h-4 w-4 mr-1" />
            Recording
          </Button>
          <Button
            variant={hasTranscript ? "default" : "outline"}
            size="sm"
            onClick={() => setHasTranscript(!hasTranscript)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Transcript
          </Button>
          <Button
            variant={hasActionItems ? "default" : "outline"}
            size="sm"
            onClick={() => setHasActionItems(!hasActionItems)}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            Action items
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="h-4 w-4 mr-1" />
          Reset filters
        </Button>

        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={copySearchLink}>
            <Link2 className="h-4 w-4 mr-1" />
            Copy search link
          </Button>
        </div>
      </div>

      {/* Operator Chips */}
      {operatorChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {operatorChips.map((chip, idx) => (
            <Badge key={idx} variant="secondary" className="gap-2">
              {chip.key}:{chip.value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeOperatorChip(chip.key)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Main Content */}
      {!searchQuery && !showResults ? (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start searching</h3>
          <p className="text-muted-foreground">
            Enter a query or click a suggestion above
          </p>
        </div>
      ) : isSearching ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try broadening your date range or clearing filters
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredResults.length} results
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unified Results List */}
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <Card
                key={result.id}
                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                {result.type === "meeting" && (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Meeting
                        </Badge>
                        {result.hasRecording && (
                          <Badge variant="secondary" className="text-xs">
                            <Mic className="h-3 w-3 mr-1" />
                            Recording
                          </Badge>
                        )}
                        {result.hasTranscript && (
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Transcript
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{result.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {result.date} • {result.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {result.participants} participants
                        </span>
                        <span>{result.provider}</span>
                        {result.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </p>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Summary
                      </Button>
                      {result.hasTranscript && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Transcript
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {result.type === "transcript" && (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Transcript
                        </Badge>
                      </div>
                      <p className="mb-2">
                        <span className="bg-yellow-200 dark:bg-yellow-900/30 px-1">
                          {result.snippet}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="font-medium">{result.speaker}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.timestamp}
                        </span>
                        <span>{result.meetingTitle}</span>
                        <span className="text-xs">• {result.meetingDate}</span>
                      </p>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Play at time
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Open transcript
                      </Button>
                    </div>
                  </div>
                )}

                {result.type === "task" && (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <CheckSquare className="h-3 w-3 mr-1" />
                          Task
                        </Badge>
                        <Badge
                          variant={
                            result.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {result.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{result.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {result.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {result.assignee}
                        </span>
                        <span className="text-xs">
                          From: {result.sourceMeeting}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {result.status !== "completed" && (
                        <Button variant="outline" size="sm">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Mark done
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <Button variant="outline">Load more results</Button>
          </div>
        </>
      )}
    </div>
  );
}
