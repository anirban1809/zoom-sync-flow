export interface Meeting {
  id: string;
  title: string;
  start: Date;
  end: Date;
  provider: 'zoom' | 'teams' | 'meet';
  participants: Participant[];
  tags: string[];
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  transcriptId?: string;
  summaryId?: string;
  recordingUrl?: string;
  audioUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface Summary {
  id: string;
  meetingId: string;
  bullets: SummaryBullet[];
  decisions: Decision[];
  risks: Risk[];
  questions: Question[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface SummaryBullet {
  text: string;
  evidence: Evidence[];
}

export interface Decision {
  text: string;
  owner?: string;
  evidence: Evidence[];
}

export interface Risk {
  text: string;
  severity: 'low' | 'medium' | 'high';
  evidence: Evidence[];
}

export interface Question {
  text: string;
  askedBy?: string;
  evidence: Evidence[];
}

export interface Evidence {
  transcriptSegmentId: string;
  timestamp: number;
  speaker: string;
  text: string;
}

export interface Task {
  id: string;
  meetingId: string;
  title: string;
  ownerId?: string;
  ownerName?: string;
  due?: Date;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  externalLinks: ExternalLink[];
  createdAt: Date;
}

export interface ExternalLink {
  provider: 'jira' | 'hubspot' | 'zendesk' | 'servicenow' | 'notion';
  url: string;
  id: string;
}

export interface TranscriptSegment {
  id: string;
  tStart: number;
  tEnd: number;
  speaker: string;
  text: string;
  confidence: number;
}

export interface Transcript {
  id: string;
  meetingId: string;
  segments: TranscriptSegment[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  blocks: TemplateBlock[];
  rules: AssignmentRule[];
}

export interface TemplateBlock {
  type: 'summary' | 'decisions' | 'risks' | 'next-steps' | 'custom';
  title: string;
  prompt?: string;
}

export interface AssignmentRule {
  condition: string;
  value: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  lastRun?: Date;
  runCount: number;
}

export interface AutomationTrigger {
  type: 'meeting-end' | 'keyword' | 'sentiment' | 'manual';
  config: Record<string, any>;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater-than' | 'less-than';
  value: any;
}

export interface AutomationAction {
  type: 'create-jira' | 'send-slack' | 'update-crm' | 'create-zendesk';
  config: Record<string, any>;
}

export interface Integration {
  id: string;
  provider: 'zoom' | 'teams' | 'meet' | 'slack' | 'jira' | 'zendesk' | 'hubspot' | 'servicenow' | 'notion' | 'gdrive' | 'onedrive';
  status: 'connected' | 'error' | 'disconnected';
  scopes: string[];
  connectedAt?: Date;
  lastHealth?: Date;
}

export interface Account {
  id: string;
  name: string;
  domain: string;
  owners: string[];
  health: 'healthy' | 'at-risk' | 'critical';
  sentimentTrend: SentimentDataPoint[];
  meetingCount: number;
  lastMeetingDate?: Date;
}

export interface SentimentDataPoint {
  date: Date;
  sentiment: number;
}
