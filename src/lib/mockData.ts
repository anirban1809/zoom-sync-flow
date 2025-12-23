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
        recordingUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
            {
                id: "4",
                name: "David Park",
                email: "david@client.com",
                role: "CTO",
            },
        ],
        tags: ["sales", "enterprise"],
        status: "completed",
        transcriptId: "2",
        summaryId: "2",
        // Audio only - video not available
        audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
            {
                id: "5",
                name: "Lisa Zhang",
                email: "lisa@acme.com",
                role: "QA Lead",
            },
        ],
        tags: ["standup", "team"],
        status: "completed",
        transcriptId: "3",
        summaryId: "3",
        recordingUrl:
            "https://luminote-recs-1.s3.us-east-1.amazonaws.com/The%20World%20Before%20History_%20Civilizations%20We%20Dont%20Talk%20About%20%23shorts.mp4?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIBPFJDXx7XBOO%2BOCRj1V1rOWYQRw8%2Bh03D4t%2Ba0JmKq%2BAiEAq4dgFqC%2FWhFI0JLgPkC1olYe%2BiLwU12abRqBzzyrvbEqzAMIbBACGgw3Nzk4NDQ2NDY2OTgiDEFEXBhYvnWIA3IhCiqpA14hO%2B8vZLGP6oWXA%2FJjQRw8tR2nqandH00bFNF%2BpIxZhovZh6BuHyQQprbW7SPMoZ9uVq%2FzMLGuXBMF6BNU0xnDuOUcb8LlVbT1Hfv%2Bgf0zt7zMR7I9vCZ2lFFc6u4wyp652HwGbDMjPQZngEqfKNDGffWoRu8JnWsup12Tx0e%2B5sw4f6B44aZsnhkCOI3dcgtSVI8HYBXHoNfVtVLHB%2FNJ6BVTDKLjW9604kgc6DlthzGIKSPlTsFFoptiYQr5GNPnqA821UoKQxVlCZYDv35xDsuhLzvKyezPkhSoC2bLKoqEWj1%2FR6Q9Y6tlYiikq5XrJa8qPRxoUX9vKA8aksjIHHansAoM8DLODQ0SJfPN44X2aELkrg5cYHmjmL031ieXY%2FczbW35rdxmu8Itp2IV2mAvKo2SQ1%2BLy9vjFK8LIqXg322Q3pdTeE0rl00Cc5IMOToITGqMcjgXHvUh0y7dUM68bS4pTgI6kS8O7%2FmtQOVsjmqrZuFsSrabZ0Zt6TIBmRN%2FoxOO3SA9c0KJAi003wbuOS3%2B6XZHWKuqcAhfYYBXv%2Bpd5eNjMOCyhsoGOt4CG%2FgJG65TQNwWrujNCj%2F95MHDH8uBkoexEsa6Bu4gomDDlG1Rmq3oGBSbo84MTiPjPCLAGNWZ8xHHhjAwWlwpdLnMQpFKqMLQodgPRfq0Kv%2B8TPb30wVuSmKN7U3OxS%2F45wE9z93GwKLthpH7TmBNwK7e3j0NIn6%2FllkO7dcG91c15OdIkI2NFP0DO5WcazFexuMdvxwbpPLR5NW0upSYqhalstGQkvF%2B5iEzBPmiLAEyBnYKIdpqEMEUXBXUkFncV8k%2Fx0NPIgN4dXuJKgySuPM2t0vHs9RPhfrldQOqAvk%2BIe2n6fHJd14W6wggc%2BfNmiSatd65FDRDcD5L5lVON48Bkc9Yoi2klxzLCj8MNq3M1srP01opqIfZ%2F4uxqhJaZknQaj3Cu24OAD%2B7iFCAUStKSUAlp52QJZFtKpY2M0W6tVpeCdbSR%2Fhho0zGGqd%2F04tu%2BtKetsajd6KMZ50%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA3LES464VOSJSBWCI%2F20251216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251216T184911Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=ced8a80cef3a2aa225f4ab736cf2cd048e0567645d11b3c8f34d70499a430bb3",
    },
    {
        id: "4",
        title: "Design Review Session",
        start: new Date(2025, 9, 20, 9, 0),
        end: new Date(2025, 9, 20, 10, 30),
        provider: "zoom",
        participants: [
            {
                id: "3",
                name: "Emma Wilson",
                email: "emma@acme.com",
                role: "Designer",
            },
            {
                id: "1",
                name: "Sarah Chen",
                email: "sarah@acme.com",
                role: "Product Manager",
            },
        ],
        tags: ["design", "review"],
        status: "completed",
        transcriptId: "1",
        summaryId: "1",
        // Audio only - participant opted out of video recording
        audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
        id: "5",
        title: "Sprint Planning",
        start: new Date(2025, 9, 22, 14, 0),
        end: new Date(2025, 9, 22, 15, 30),
        provider: "teams",
        participants: [
            {
                id: "2",
                name: "Mike Torres",
                email: "mike@acme.com",
                role: "Engineering Lead",
            },
            {
                id: "5",
                name: "Lisa Zhang",
                email: "lisa@acme.com",
                role: "QA Lead",
            },
        ],
        tags: ["sprint", "planning"],
        status: "scheduled",
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
    "2": {
        id: "2",
        meetingId: "2",
        bullets: [
            {
                text: "Enterprise customer expressed strong interest in advanced analytics features",
                evidence: [
                    {
                        transcriptSegmentId: "2-1",
                        timestamp: 120,
                        speaker: "David Park",
                        text: "Our team has been looking for a solution that provides deeper analytics and custom reporting capabilities.",
                    },
                ],
            },
            {
                text: "Security and compliance are top priorities for enterprise adoption",
                evidence: [
                    {
                        transcriptSegmentId: "2-2",
                        timestamp: 300,
                        speaker: "David Park",
                        text: "We need SOC 2 compliance and single sign-on integration before we can move forward.",
                    },
                ],
            },
        ],
        decisions: [
            {
                text: "Schedule follow-up demo with their security team",
                owner: "Sarah Chen",
                evidence: [
                    {
                        transcriptSegmentId: "2-3",
                        timestamp: 480,
                        speaker: "Sarah Chen",
                        text: "I'll coordinate with our security team and set up a dedicated session to walk through our compliance documentation.",
                    },
                ],
            },
        ],
        risks: [
            {
                text: "Timeline may not align with their Q1 deployment goals",
                severity: "medium",
                evidence: [
                    {
                        transcriptSegmentId: "2-4",
                        timestamp: 600,
                        speaker: "David Park",
                        text: "We're hoping to have something in place by early Q1. Is that realistic on your end?",
                    },
                ],
            },
        ],
        questions: [],
        sentiment: "positive",
        confidence: 0.89,
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
    "2": {
        id: "2",
        meetingId: "2",
        segments: [
            {
                id: "2-1",
                tStart: 0,
                tEnd: 10,
                speaker: "Sarah Chen",
                text: "Thanks for taking the time to meet with us today, David. We're excited to learn more about your needs.",
                confidence: 0.94,
            },
            {
                id: "2-2",
                tStart: 10,
                tEnd: 20,
                speaker: "David Park",
                text: "Of course. We've been evaluating several solutions and your platform caught our attention.",
                confidence: 0.93,
            },
            {
                id: "2-3",
                tStart: 20,
                tEnd: 30,
                speaker: "David Park",
                text: "Our team has been looking for a solution that provides deeper analytics and custom reporting capabilities.",
                confidence: 0.92,
            },
            {
                id: "2-4",
                tStart: 30,
                tEnd: 40,
                speaker: "Sarah Chen",
                text: "That's great to hear. Analytics is one of our strongest areas. What specific metrics are you most interested in?",
                confidence: 0.95,
            },
            {
                id: "2-5",
                tStart: 40,
                tEnd: 50,
                speaker: "David Park",
                text: "We need SOC 2 compliance and single sign-on integration before we can move forward.",
                confidence: 0.93,
            },
            {
                id: "2-6",
                tStart: 50,
                tEnd: 60,
                speaker: "Sarah Chen",
                text: "I'll coordinate with our security team and set up a dedicated session to walk through our compliance documentation.",
                confidence: 0.94,
            },
        ],
    },
    "3": {
        id: "3",
        meetingId: "meeting-1",
        segments: [
            {
                id: "meeting-1-1",
                tStart: 0.0,
                tEnd: 11.21,
                speaker: "Speaker 1",
                text: "जब मोहेंजोदारो हड़प्पा flourishing थे जब एकदम टॉप पे थे I am pretty sure at the same time उत्तर प्रदेश में शायद बंगाल में भी शायद नॉर्थ ईस्ट में शायद उसके पार भी ।",
                confidence: 0.78,
            },
            {
                id: "meeting-1-2",
                tStart: 11.76,
                tEnd: 16.01,
                speaker: "Speaker 1",
                text: "ऐसे सिटीज रहे होंगे ना आईटीएस जस्ट थाट एनाउघ डिगिंग हास नोट हैपेंड",
                confidence: 0.63,
            },
            {
                id: "meeting-1-3",
                tStart: 16.01,
                tEnd: 25.84,
                speaker: "Speaker 2",
                text: "एनाउघ डिगिंग नहीं होगा ये एक पॉसिबिलिटी है । दूसरी पॉसिबिलिटी ये भी हो सकती है कि गंगा यमुना को फ्लड आते रहते तो चलो लेके गए यू नौ तो बे ओएफ बंगाल में जाके ढूंढना पड़े ।",
                confidence: 0.81,
            },
            {
                id: "meeting-1-4",
                tStart: 26.079,
                tEnd: 26.76,
                speaker: "Speaker 1",
                text: "बट पर हैप्स ।",
                confidence: 0.43,
            },
            {
                id: "meeting-1-5",
                tStart: 26.76,
                tEnd: 28.909,
                speaker: "Speaker 1",
                text: "That civilization was not limited to that geography,",
                confidence: 0.99,
            },
            {
                id: "meeting-1-6",
                tStart: 29.09,
                tEnd: 41.11,
                speaker: "Speaker 2",
                text: "not at all. Actually, if you take the geographical area, even within India, I mean Pakistan, Baluchistan, or India, so all historical civilization, it is the largest area, OK.",
                confidence: 0.97,
            },
        ],
    },
};
