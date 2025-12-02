import { Meeting, Task, Summary, Transcript, TranscriptSegment } from "@/types";

export const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Q4 Product Planning",
    start: new Date(2025, 9, 15, 10, 0),
    end: new Date(2025, 9, 15, 11, 0),
    provider: "zoom",
    participants: [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@acme.com",
        role: "Product Manager",
      },
      {
        id: "2",
        name: "Mike Torres",
        email: "mike@acme.com",
        role: "Engineering Lead",
      },
      {
        id: "3",
        name: "Emma Wilson",
        email: "emma@acme.com",
        role: "Designer",
      },
    ],
    tags: ["product", "planning"],
    status: "completed",
    transcriptId: "1",
    summaryId: "1",
  },
  {
    id: "2",
    title: "Customer Discovery: Enterprise Segment",
    start: new Date(2025, 9, 19, 14, 0),
    end: new Date(2025, 9, 19, 15, 0),
    provider: "meet",
    participants: [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@acme.com",
        role: "Product Manager",
      },
      { id: "4", name: "David Park", email: "david@client.com", role: "CTO" },
    ],
    tags: ["sales", "enterprise"],
    status: "scheduled",
    transcriptId: "2",
  },
  {
    id: "3",
    title: "Weekly Standup",
    start: new Date(2025, 9, 19, 16, 30),
    end: new Date(2025, 9, 19, 17, 0),
    provider: "teams",
    participants: [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@acme.com",
        role: "Product Manager",
      },
      {
        id: "2",
        name: "Mike Torres",
        email: "mike@acme.com",
        role: "Engineering Lead",
      },
      {
        id: "3",
        name: "Emma Wilson",
        email: "emma@acme.com",
        role: "Designer",
      },
      { id: "5", name: "Lisa Zhang", email: "lisa@acme.com", role: "QA Lead" },
    ],
    tags: ["standup", "team"],
    status: "scheduled",
    transcriptId: "3",
    summaryId: "3",
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    meetingId: "1",
    title: "Review competitive analysis for Q4 roadmap",
    ownerId: "1",
    ownerName: "Sarah Chen",
    due: new Date(2025, 9, 10),
    status: "todo",
    externalLinks: [],
    createdAt: new Date(2025, 9, 7),
  },
  {
    id: "2",
    meetingId: "1",
    title: "Draft technical spec for new API endpoints",
    ownerId: "2",
    ownerName: "Mike Torres",
    due: new Date(2025, 9, 9),
    status: "in-progress",
    externalLinks: [
      {
        provider: "jira",
        url: "https://jira.acme.com/PROJ-123",
        id: "PROJ-123",
      },
    ],
    createdAt: new Date(2025, 9, 7),
  },
  {
    id: "3",
    meetingId: "3",
    title: "Update design mockups based on feedback",
    ownerId: "3",
    ownerName: "Emma Wilson",
    due: new Date(2025, 9, 8),
    status: "done",
    externalLinks: [],
    createdAt: new Date(2025, 9, 6),
  },
];

export const mockSummaries: Record<string, Summary> = {
  "1": {
    id: "1",
    meetingId: "1",
    bullets: [
      {
        text: "Team aligned on Q4 priorities: focus on enterprise features and API stability",
        evidence: [
          {
            transcriptSegmentId: "1-3",
            timestamp: 180,
            speaker: "Sarah Chen",
            text: "I think we should prioritize enterprise features this quarter. We're seeing strong demand from larger customers.",
          },
        ],
      },
      {
        text: "Engineering capacity is constrained due to two team members on leave",
        evidence: [
          {
            transcriptSegmentId: "1-2",
            timestamp: 420,
            speaker: "Mike Torres",
            text: "We'll be down two engineers for most of the quarter, so we need to be realistic about what we can deliver.",
          },
        ],
      },
    ],
    decisions: [
      {
        text: "Defer mobile app redesign to Q1 2026",
        owner: "Sarah Chen",
        evidence: [
          {
            transcriptSegmentId: "1-6",
            timestamp: 540,
            speaker: "Sarah Chen",
            text: "Let's push the mobile redesign to Q1. It's important but not as critical as the enterprise work.",
          },
        ],
      },
    ],
    risks: [
      {
        text: "API migration may impact existing customers if not communicated properly",
        severity: "medium",
        evidence: [
          {
            transcriptSegmentId: "1-5",
            timestamp: 720,
            speaker: "Mike Torres",
            text: "The API changes could break integrations if customers don't update their code. We need a solid migration plan.",
          },
        ],
      },
    ],
    questions: [
      {
        text: "Do we have budget for additional contractor support?",
        askedBy: "Mike Torres",
        evidence: [
          {
            transcriptSegmentId: "1-7",
            timestamp: 900,
            speaker: "Mike Torres",
            text: "Given our capacity constraints, should we consider bringing in contractors? What's our budget for that?",
          },
        ],
      },
    ],
    sentiment: "neutral",
    confidence: 0.87,
  },
  "3": {
    id: "3",
    meetingId: "3",
    bullets: [
      {
        text: "All critical bugs from last sprint have been resolved",
        evidence: [
          {
            transcriptSegmentId: "3-1",
            timestamp: 120,
            speaker: "Lisa Zhang",
            text: "Good news - we closed out all the P0 bugs from last week.",
          },
        ],
      },
      {
        text: "New feature flag system is ready for rollout",
        evidence: [
          {
            transcriptSegmentId: "3-2",
            timestamp: 240,
            speaker: "Mike Torres",
            text: "The feature flag system is done and tested. We can start using it this week.",
          },
        ],
      },
    ],
    decisions: [],
    risks: [],
    questions: [],
    sentiment: "positive",
    confidence: 0.92,
  },
};

export const mockTranscripts: Record<string, Transcript> = {
  "1": {
    id: "1",
    meetingId: "1",
    segments: [
      {
        id: "1-1",
        tStart: 0,
        tEnd: 8,
        speaker: "Sarah Chen",
        text: "Good morning everyone. Thanks for joining today's Q4 planning session.",
        confidence: 0.95,
      },
      {
        id: "1-2",
        tStart: 8,
        tEnd: 18,
        speaker: "Sarah Chen",
        text: "We have a lot to cover, so let's dive right in and make sure we're all aligned on priorities.",
        confidence: 0.95,
      },
      {
        id: "1-3",
        tStart: 18,
        tEnd: 28,
        speaker: "Mike Torres",
        text: "Sounds good. Before we start, I want to flag that we'll be down two engineers for most of the quarter.",
        confidence: 0.93,
      },
      {
        id: "1-4",
        tStart: 28,
        tEnd: 38,
        speaker: "Mike Torres",
        text: "So we need to be realistic about what we can actually deliver in the next three months.",
        confidence: 0.93,
      },
      {
        id: "1-5",
        tStart: 38,
        tEnd: 48,
        speaker: "Sarah Chen",
        text: "That's a good point. Let's keep that in mind as we prioritize our roadmap items.",
        confidence: 0.94,
      },
      {
        id: "1-6",
        tStart: 48,
        tEnd: 58,
        speaker: "Sarah Chen",
        text: "I think we should focus on enterprise features this quarter. We're seeing strong demand from larger customers.",
        confidence: 0.94,
      },
      {
        id: "1-7",
        tStart: 58,
        tEnd: 68,
        speaker: "Emma Wilson",
        text: "I agree. The enterprise dashboard has been requested by at least five major accounts.",
        confidence: 0.92,
      },
      {
        id: "1-8",
        tStart: 68,
        tEnd: 78,
        speaker: "Emma Wilson",
        text: "I can help create some mockups for the new dashboard. What timeline are we looking at?",
        confidence: 0.92,
      },
      {
        id: "1-9",
        tStart: 78,
        tEnd: 88,
        speaker: "Mike Torres",
        text: "Realistically, we could have the first iteration ready by mid-November if we start next week.",
        confidence: 0.91,
      },
      {
        id: "1-10",
        tStart: 88,
        tEnd: 98,
        speaker: "Mike Torres",
        text: "The API changes could break integrations if customers don't update their code though.",
        confidence: 0.91,
      },
      {
        id: "1-11",
        tStart: 98,
        tEnd: 108,
        speaker: "Mike Torres",
        text: "We need a solid migration plan and clear communication strategy before we roll anything out.",
        confidence: 0.91,
      },
      {
        id: "1-12",
        tStart: 108,
        tEnd: 118,
        speaker: "Sarah Chen",
        text: "Absolutely. Let's make sure we have a deprecation timeline that gives customers enough notice.",
        confidence: 0.93,
      },
      {
        id: "1-13",
        tStart: 118,
        tEnd: 128,
        speaker: "Sarah Chen",
        text: "Let's push the mobile redesign to Q1. It's important but not as critical as the enterprise work.",
        confidence: 0.93,
      },
      {
        id: "1-14",
        tStart: 128,
        tEnd: 138,
        speaker: "Emma Wilson",
        text: "That makes sense. The mobile app usage is still relatively low compared to desktop.",
        confidence: 0.92,
      },
      {
        id: "1-15",
        tStart: 138,
        tEnd: 148,
        speaker: "Mike Torres",
        text: "Given our capacity constraints, should we consider bringing in contractors?",
        confidence: 0.94,
      },
      {
        id: "1-16",
        tStart: 148,
        tEnd: 158,
        speaker: "Mike Torres",
        text: "What's our budget for external help this quarter?",
        confidence: 0.94,
      },
      {
        id: "1-17",
        tStart: 158,
        tEnd: 168,
        speaker: "Sarah Chen",
        text: "We have some budget flexibility. I'll check with finance and get back to you by end of week.",
        confidence: 0.93,
      },
      {
        id: "1-18",
        tStart: 168,
        tEnd: 178,
        speaker: "Sarah Chen",
        text: "Let's wrap up with action items. Mike, can you draft the technical spec by Friday?",
        confidence: 0.95,
      },
      {
        id: "1-19",
        tStart: 178,
        tEnd: 188,
        speaker: "Mike Torres",
        text: "Sure, I'll have the first draft ready for review. Emma, want to sync on the designs?",
        confidence: 0.94,
      },
      {
        id: "1-20",
        tStart: 188,
        tEnd: 198,
        speaker: "Emma Wilson",
        text: "Sounds good! I'll schedule a design review for early next week.",
        confidence: 0.92,
      },
    ],
  },
};
