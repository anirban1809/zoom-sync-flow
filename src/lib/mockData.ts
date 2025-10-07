import { Meeting, Task, Summary, Transcript, TranscriptSegment } from '@/types';

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q4 Product Planning',
    start: new Date(2025, 9, 7, 10, 0),
    end: new Date(2025, 9, 7, 11, 0),
    provider: 'zoom',
    participants: [
      { id: '1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Product Manager' },
      { id: '2', name: 'Mike Torres', email: 'mike@acme.com', role: 'Engineering Lead' },
      { id: '3', name: 'Emma Wilson', email: 'emma@acme.com', role: 'Designer' },
    ],
    tags: ['product', 'planning'],
    status: 'scheduled',
    transcriptId: '1',
    summaryId: '1',
  },
  {
    id: '2',
    title: 'Customer Discovery: Enterprise Segment',
    start: new Date(2025, 9, 7, 14, 0),
    end: new Date(2025, 9, 7, 15, 0),
    provider: 'meet',
    participants: [
      { id: '1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Product Manager' },
      { id: '4', name: 'David Park', email: 'david@client.com', role: 'CTO' },
    ],
    tags: ['sales', 'enterprise'],
    status: 'live',
    transcriptId: '2',
  },
  {
    id: '3',
    title: 'Weekly Standup',
    start: new Date(2025, 9, 6, 9, 0),
    end: new Date(2025, 9, 6, 9, 30),
    provider: 'teams',
    participants: [
      { id: '1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Product Manager' },
      { id: '2', name: 'Mike Torres', email: 'mike@acme.com', role: 'Engineering Lead' },
      { id: '3', name: 'Emma Wilson', email: 'emma@acme.com', role: 'Designer' },
      { id: '5', name: 'Lisa Zhang', email: 'lisa@acme.com', role: 'QA Lead' },
    ],
    tags: ['standup', 'team'],
    status: 'completed',
    transcriptId: '3',
    summaryId: '3',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    meetingId: '1',
    title: 'Review competitive analysis for Q4 roadmap',
    ownerId: '1',
    ownerName: 'Sarah Chen',
    due: new Date(2025, 9, 10),
    status: 'todo',
    externalLinks: [],
    createdAt: new Date(2025, 9, 7),
  },
  {
    id: '2',
    meetingId: '1',
    title: 'Draft technical spec for new API endpoints',
    ownerId: '2',
    ownerName: 'Mike Torres',
    due: new Date(2025, 9, 9),
    status: 'in-progress',
    externalLinks: [
      { provider: 'jira', url: 'https://jira.acme.com/PROJ-123', id: 'PROJ-123' },
    ],
    createdAt: new Date(2025, 9, 7),
  },
  {
    id: '3',
    meetingId: '3',
    title: 'Update design mockups based on feedback',
    ownerId: '3',
    ownerName: 'Emma Wilson',
    due: new Date(2025, 9, 8),
    status: 'done',
    externalLinks: [],
    createdAt: new Date(2025, 9, 6),
  },
];

export const mockSummaries: Record<string, Summary> = {
  '1': {
    id: '1',
    meetingId: '1',
    bullets: [
      {
        text: 'Team aligned on Q4 priorities: focus on enterprise features and API stability',
        evidence: [
          {
            transcriptSegmentId: '1-1',
            timestamp: 180,
            speaker: 'Sarah Chen',
            text: "I think we should prioritize enterprise features this quarter. We're seeing strong demand from larger customers.",
          },
        ],
      },
      {
        text: 'Engineering capacity is constrained due to two team members on leave',
        evidence: [
          {
            transcriptSegmentId: '1-2',
            timestamp: 420,
            speaker: 'Mike Torres',
            text: "We'll be down two engineers for most of the quarter, so we need to be realistic about what we can deliver.",
          },
        ],
      },
    ],
    decisions: [
      {
        text: 'Defer mobile app redesign to Q1 2026',
        owner: 'Sarah Chen',
        evidence: [
          {
            transcriptSegmentId: '1-3',
            timestamp: 540,
            speaker: 'Sarah Chen',
            text: "Let's push the mobile redesign to Q1. It's important but not as critical as the enterprise work.",
          },
        ],
      },
    ],
    risks: [
      {
        text: 'API migration may impact existing customers if not communicated properly',
        severity: 'medium',
        evidence: [
          {
            transcriptSegmentId: '1-4',
            timestamp: 720,
            speaker: 'Mike Torres',
            text: "The API changes could break integrations if customers don't update their code. We need a solid migration plan.",
          },
        ],
      },
    ],
    questions: [
      {
        text: 'Do we have budget for additional contractor support?',
        askedBy: 'Mike Torres',
        evidence: [
          {
            transcriptSegmentId: '1-5',
            timestamp: 900,
            speaker: 'Mike Torres',
            text: "Given our capacity constraints, should we consider bringing in contractors? What's our budget for that?",
          },
        ],
      },
    ],
    sentiment: 'neutral',
    confidence: 0.87,
  },
  '3': {
    id: '3',
    meetingId: '3',
    bullets: [
      {
        text: 'All critical bugs from last sprint have been resolved',
        evidence: [
          {
            transcriptSegmentId: '3-1',
            timestamp: 120,
            speaker: 'Lisa Zhang',
            text: 'Good news - we closed out all the P0 bugs from last week.',
          },
        ],
      },
      {
        text: 'New feature flag system is ready for rollout',
        evidence: [
          {
            transcriptSegmentId: '3-2',
            timestamp: 240,
            speaker: 'Mike Torres',
            text: 'The feature flag system is done and tested. We can start using it this week.',
          },
        ],
      },
    ],
    decisions: [],
    risks: [],
    questions: [],
    sentiment: 'positive',
    confidence: 0.92,
  },
};

export const mockTranscripts: Record<string, Transcript> = {
  '1': {
    id: '1',
    meetingId: '1',
    segments: [
      {
        id: '1-1',
        tStart: 0,
        tEnd: 15,
        speaker: 'Sarah Chen',
        text: "Good morning everyone. Thanks for joining. Today we're going to finalize our Q4 roadmap and make sure we're all aligned on priorities.",
        confidence: 0.95,
      },
      {
        id: '1-2',
        tStart: 16,
        tEnd: 42,
        speaker: 'Mike Torres',
        text: "Sounds good. Before we dive in, I want to flag that we'll be down two engineers for most of the quarter, so we need to be realistic about what we can deliver.",
        confidence: 0.93,
      },
      {
        id: '1-3',
        tStart: 43,
        tEnd: 68,
        speaker: 'Sarah Chen',
        text: "That's a good point. Let's keep that in mind as we prioritize. I think we should focus on enterprise features this quarter. We're seeing strong demand from larger customers.",
        confidence: 0.94,
      },
    ],
  },
};
