Recordin.ai - Comprehensive UI Documentation
Project Overview
Recordin.ai is a meeting recording and analytics platform built with React, TypeScript, Tailwind CSS, and shadcn/ui components. The application provides comprehensive meeting management, transcription, AI-powered summaries, task tracking, and automation capabilities.

Application Structure
Layout Architecture
AppShell Component - The main layout wrapper that provides:

Collapsible sidebar navigation
Top navigation bar with search and user controls
Main content area with light background (bg-muted/30)
Color System:

Primary actions and highlights use the theme primary color
Meeting provider indicators: Zoom (blue), Teams (purple), Google Meet (green)
Status colors: Active/Success (green), Warning (yellow/orange), Error/Destructive (red)
Navigation Structure
Sidebar (AppSidebar)
Main Navigation:

Home - Dashboard overview
Meetings - All meetings list
Calendars - Calendar management
Tasks - Task tracking
Notes - Note management
Templates - Meeting templates (placeholder)
Workflow Navigation:

Search - Universal search
Automations - Workflow automation
Integrations - Third-party integrations
Insights - Analytics and reporting
Settings Navigation:

Accounts - Account/customer management
Admin - User and workspace settings
Billing - Subscription and payments
Compliance - Security and audit logs
Data Management - Storage and data controls
Visual Features:

Collapsible to icon-only view (56px width)
Active route highlighting with background color
Logo area at top ("R" in primary color circle)
Grouped sections with labels
Top Bar (TopBar)
Left Side:

Sidebar toggle button
Global search bar with Cmd+K shortcut indicator
Placeholder: "Search meetings, tasks, or press Cmd+K"
Right Side:

"New" dropdown button (creates Meeting Note, Task, Template, Automation)
Theme toggle (light/dark mode with animated sun/moon icons)
Notifications bell icon with unread count badge
User profile dropdown showing:
Avatar (Acme Corp)
User name and email
Profile Settings, Workspace Settings, Switch Workspace, Sign Out
Notifications Panel:

Popover that opens from bell icon
Shows unread count badge on bell
Notification types with icons: Success (green check), Info (blue info), Alert (orange warning)
Each notification shows title, message, time ago, and read/unread indicator (blue dot)
"Mark all as read" button at top
"View all notifications" button at bottom
Scrollable list (max 400px height)
Page-by-Page Breakdown

1. Home Page (/)
   Header:

Greeting: "Good morning, Anirban"
Subtitle: "Here's what's happening today"
"New Note" button (primary, with plus icon)
Layout: Grid of cards

Today's Meetings Card:

Shows meetings scheduled for current date
Displays meeting cards with time, participants, status
Empty state: "No meetings scheduled for today" with "Connect Calendar" button
My Action Items Card:

Shows pending tasks count in subtitle
Lists first 5 pending tasks using TaskRow component
Empty state: "All caught up! No pending tasks"
Recent Meetings Card:

Shows last 3 meetings from past 7 days
Uses MeetingCard component without action buttons 2. Meetings Page (/meetings)
Header:

Title: "Meetings"
Subtitle: "All your recorded and scheduled meetings"
Action buttons: "Export" and "Calendar View" (outline style)
Filters:

Search bar: "Search meetings..."
Status dropdown filter: All Status, Scheduled, Live, Completed, Cancelled
Additional filter icon button
Meetings Table: Columns:

Meeting: Title with provider color dot (blue/purple/green)
Date & Time: Calendar icon + date, Clock icon + time (stacked)
Participants: Avatar stack (max 3 shown) + count
Tags: First 2 tags shown as badges + count if more
Status: Badge with color coding (scheduled=default, live=destructive with pulse animation, completed=secondary, cancelled=outline)
Action: "Join" button for scheduled (with video icon), "Live Now" button with pulsing red dot for live meetings
Interactions:

Click row to navigate to meeting detail
Click action buttons without triggering row click
Empty State: "No meetings found" with "Clear Filters" button

3. Meeting Detail Page (/meetings/:id)
   Back Navigation: "Back to Meetings" button with arrow icon

Header Section:

Provider badge with colored dot
"Live" badge if meeting is live (red, pulsing)
Meeting title (large, bold)
Metadata row: Calendar icon + date, Clock icon + time range, Users icon + participant count
Action buttons: Edit, Share, Export (outline), Join Meeting (primary, if scheduled)
Participants Card:

Horizontal scrolling avatars with names and roles
Each participant in rounded border container
Recording Card (if completed):

Native HTML5 audio player with custom accent color
Skip backward/forward 10s buttons below player
Content Tabs:

1. Summary Tab:

Header shows confidence percentage and sentiment badge

Key Points section:

Bulleted list with evidence links
Click to view supporting transcript segments
Decisions section:

Green-tinted background boxes
Shows decision owner
Evidence links
Risks section:

Orange-tinted background boxes
Severity badge (high/medium/low)
Evidence links
Open Questions section:

Blue-tinted background boxes
Shows who asked the question
Evidence links 2. Transcript Tab:

Timestamp column (MM:SS format)
Speaker name
Transcript text
Empty state if not available 3. Action Items Tab:

Count in tab label
List of tasks using TaskRow component
Empty state with "Create Task" button
Modals:

Share Modal:

Share link input (read-only)
Copy button with visual feedback
Share via email section
Access permissions selector
Export Modal:

Format selection (Full transcript, Summary only, Audio + transcript, PDF report, JSON data)
Email delivery option
Export button 4. Calendars Page (/calendars)
Tabs:

Connected Calendars Tab:

Header with "Connect Calendar" button
Each calendar card shows:
Provider name with icon
Connected status badge (green)
Email address
Last sync time
Meeting count this month
Health score progress bar
Auto-join toggle switch
"Sync Now" and "Disconnect" buttons
Auto-Join Rules Tab:

Header with "Create Rule" button
Each rule card displays:
Rule name with lightning icon
Active/Disabled badge
"When" conditions
"Then" actions
Match count
Enable/disable toggle
Edit and delete buttons
Meeting Providers Tab:

Grid of available providers (Zoom, Google Meet, Teams)
Each shows icon, name, connection status
"Connect" or "Manage" button
Calendar Detail View:

Accessed by clicking on a calendar
Mini calendar selector on left
Legend showing event colors
Day/Week/Month view tabs
Time-based grid layout with color-coded events
Click events to navigate to meeting details 5. Tasks Page (/tasks)
Header:

Title: "Tasks & Follow-ups"
Subtitle: "Track action items from all your meetings"
"New Task" button (primary)
Filters:

Search bar
Status dropdown (All Status, To Do, In Progress, Done, Cancelled)
Tabs with counts:

My Tasks (active tasks only)
Completed (done tasks)
All Tasks (everything)
Task Display:

Uses TaskRow component
Checkbox for status toggle
Task title with strikethrough if complete
Owner name with user icon
Due date with calendar icon
Status indicator dot (colored)
External link button if applicable
Hover effect on row
Empty States:

"No active tasks. Great work!"
"No completed tasks yet" 6. Notes Page (/notes)
Header:

Title: "Notes"
Subtitle: "Create and manage your meeting notes"
"New Note" button
Search: Full-width search bar

Note Creation (when clicked "New Note"):

Card with title input field
Large textarea for content (6 rows)
"Save Note" and "Cancel" buttons
Note List:

Each note in a card
Displays: Title, last updated date, content preview
Edit and delete icon buttons in header
Edit mode shows same fields as creation
Empty State:

When searching: "No notes found matching your search"
When no notes: "No notes yet. Create your first note!" 7. Search Page (/search)
Search Bar:

Large, prominent search input in card
Placeholder: "Search meetings, accounts, tasks..."
"Filters" button
Tabs:

All Results
Meetings (with count)
Accounts (with count)
Tasks (with count)
All Results Tab:

Sections for each result type
Section headers with icons (Calendar, Users, FileText)
Separators between sections
Result Cards (clickable):

Meetings:

Title, date (calendar icon), attendees count (users icon), duration (clock icon)
Tags as badges
Accounts:

Company name, industry, meeting count, last contact time
Tasks:

Task title, account, due date
Priority badge (high=destructive, medium/low=secondary) 8. Automations Page (/automations)
Header:

Title: "Automations"
Subtitle: "Automate workflows and tasks based on meeting insights"
"Create Automation" button
Stats Cards Row:

Active Automations (count / total)
Total Runs (count, "This month")
Time Saved (hours estimate, "This month")
Your Automations Table:

Columns:

Name: Title with lightning icon, description below
Trigger: Play icon + trigger event
Actions: Multiple badges for each action
Status: Toggle switch + badge (Active/Disabled)
Runs: Count number
Last Run: Clock icon + time ago
Actions: Edit and delete buttons
Automation Templates Table:

Columns:

Name: Template name
Category: Badge (Sales, Customer Success, Reporting)
Description: Brief explanation
Action: "Use Template" button
Create Automation Modal:

Automation Name input
Description textarea
Trigger Event dropdown
Actions multi-select with removable badges
Cancel and Create buttons
Create disabled until required fields filled 9. Integrations Page (/integrations)
Stats Cards:

Connected Apps (count)
Active Syncs (count)
Records Synced (count, "This month")
Tabs:

Connected Tab:

Each integration card shows:
Large emoji icon
Name with connected badge (green checkmark)
Category badge
Description
Last sync time
Record/channel count
Settings button (gear icon)
"Sync Now" and "Disconnect" buttons
Available Tab:

Similar card layout
"Popular" badge for common integrations
"Learn More" and "Connect" buttons
Special "Custom Integration" card at bottom (gradient background):
Lightning bolt icon
"View API Docs" and "Connect via Zapier" buttons 10. Insights Page (/insights)
Metrics Cards (4 columns):

Total Meetings (trending up/down indicator)
Avg. Meeting Duration
Active Accounts
Conversion Rate
Each shows percentage change from last month
Tabs:

Overview Tab:

Two cards side-by-side:
Most Discussed Topics (with counts and progress bars)
Common Objections (with counts and progress bars)
Meeting Activity Trend Chart:
Bar chart showing 12 weeks
Gradient bars with hover effect
Week labels below
Accounts Tab:

Top Performing Accounts list
Each card shows:
Rank badge (numbered 1-4)
Company name, meeting count
Pipeline revenue value
Health score with progress bar (out of 100)
Team Performance Tab:

Individual team member cards
Avatar with initials (gradient background)
Name with "Top Performer" badge for #1
Metrics: meeting count, deals closed
Success rate percentage (large, bold) 11. Accounts Page (/accounts)
Split Layout:

Left Sidebar (fixed width 384px):

"Accounts" header with "Add" button
Search bar
"Filters" button
Scrollable account list
Each account card shows:
Building icon + name
Domain name
Sentiment badge (positive/neutral/negative)
Health score progress bar
Meeting count, open tasks count
Active account has ring border
Right Panel (main content):

Selected account details
Large company name with building icon
Domain and ARR
"View in CRM" button
Three metric cards:

Health Score (large percentage with progress bar)
Sentiment (badge with trend icon)
Last Meeting (with calendar icon)
Key Contacts Card:

Avatar + name + role for each contact
"View Meetings" button
Activity Tabs:

Recent Meetings (list with view buttons)
Action Items (tasks with priority badges)
Trends (placeholder for analytics) 12. Admin Page (/admin)
Tabs:

Users & Roles Tab:

Team Members Section:

Table with columns: User (avatar + name/email), Role, Status, Last Active, Actions menu
Status shows active (green check) or invited (clock)
"Invite User" button in header
Role Permissions Section:

Role dropdown selector
List of permissions with toggle switches
Permissions: View meetings, transcripts, exports, share externally, manage integrations, manage users
Workspace Tab:

Recording & Bot Settings:

Auto-join meetings toggle
Record video toggle
Speaker identification toggle
Data Retention:

Transcript retention dropdown (30 days, 90 days, 1 year, Forever)
Recording retention dropdown
PII Redaction:

Toggle switches for: Credit cards, SSN, Email addresses, Phone numbers
Security Tab:

Authentication:

Enforce SSO toggle
Two-factor authentication toggle
Domain restrictions toggle
Sharing & Export:

External sharing toggle
Download permissions toggle
Watermark exports toggle
Audit Log:

Recent events list showing action, user, time, details
FileText icon for each entry 13. Billing Page (/billing)
Header:

Title with credit card icon
"Download All Invoices" button
Current Plan Card (primary border):

Plan name: "Business Plan"
Price: "$299/month • Billed monthly"
Active badge
Next billing date with calendar icon
"Change Plan" and "Cancel Subscription" buttons
Plan features list (2 columns) with green checkmarks:
Unlimited meetings, Advanced AI summaries, All integrations, Custom automations, Priority support, Unlimited storage
Usage Stats (3 cards):

Seats: 4 / 10 with progress bar, "Add more seats" link
Transcription Hours: 82 hours, "Resets Feb 1", Unlimited badge
Storage: 2.4 GB with progress bar, 10 GB available
Payment Method Card:

Credit card icon in bordered box
Card type and last 4 digits
Expiration date
"Default" badge
"Update" button
Invoice History Table: Columns: Invoice, Date, Amount, Status, Action

Status badge with checkmark
"Download" button for each invoice
Upgrade Options (3 cards):

Enterprise (custom pricing, "Contact Sales")
Extra Storage ($10/month per 100 GB, "Add Storage")
Premium Support ("Learn More") 14. Compliance Page (/compliance)
Header:

Shield icon + title
"Export Report" button
Overview Cards (4 columns):

Compliant (98.5%, green check)
Audit Events (1,247 last 30 days)
DLP Matches (23 this month, warning icon)
Data Requests (3 active)
Tabs:

Audit Log Tab:

Search bar and event filter dropdown
Table columns: Action, User, Resource, Timestamp, IP Address
Action shown as badge
DLP Matches Tab:

Table showing: Meeting, Data Type, Severity, Action, Timestamp
Severity badges (high=destructive, medium=secondary)
Action shows lock icon with "Redacted" or "Flagged"
Data Requests Tab:

Table: Request Type, Requestor, Status, Created, Completed, Actions
Type badges (Export=secondary, Erase=destructive)
Status with icons (completed=green check, processing=yellow clock, pending=yellow warning)
Approve/Reject buttons for pending requests
Download button for completed 15. Data Management Page (/data-management)
Storage Card:

Location:

Shows current storage: "Recordin secure cloud"
"Change" button opens modal with dropdown options (Recordin, AWS S3, Azure Blob, Google Cloud)
Additional fields shown if customer storage selected
Usage:

Progress bar: "18.2 GB of 200 GB"
Breakdown: Audio 8.5 GB, Transcripts 2.1 GB, Notes 0.3 GB, Attachments 7.3 GB
"Free up space" button
Data Region:

Dropdown: "Asia South Mumbai"
Info text: "Used for all new meetings. Moving regions does not move existing files"
Export Card:

Quick Export:

Time range dropdown (Last 7/30/90 days)
Format dropdown (Full ZIP, PDF, Markdown, MP3)
"Create export" button
Inline status indicator
Scheduled Export:

Toggle to enable
When enabled: Frequency dropdown, Delivery method dropdown, Save button
Past Exports Table:

Columns: Date, Range, Format, Status, Action
Download and Delete buttons for each
Backups Card:

Toggle to enable backups
When enabled:
Backup frequency dropdown (Daily, Weekly, Monthly)
If Weekly: Day of week dropdown
If Monthly: Day of month dropdown (1-31) with note about months with fewer days
"Save backup settings" button
Security Card:

Encryption:

Shows "Managed by Recordin"
"Advanced" button opens BYOK modal (Key ID input, Validate key button)
Downloads:

Toggle: "Require sign-in for all downloads"
Toggle: "Add password to exported ZIPs"
When password enabled: Password field with "Generate" button
Retention Card:

Dropdowns for each data type:
Audio recordings (30 days, 90 days, 1 year, Keep forever)
Transcripts (90 days, 1 year, 2 years, Keep forever)
Notes and action items (1 year, 2 years, Keep forever)
Next cleanup date shown below each
Toggle: "Delete original audio after transcription"
"Apply changes" button
Delete and Restore Card:

Text: "Deleted items can be restored for 7 days"
"Delete selected meetings" button (opens picker modal)
"Restore deleted items" button (shows restoration list)
Activity Log Card:

Time range dropdown (Last 7/30/90 days)
Search input
Table: Time, Action, By, Details
"Download CSV" button
Reusable Components
MeetingCard
Compact card showing meeting info
Provider color dot indicator
Title, date, time, participant count
Avatar stack (max 3 visible + count)
Tag badges (max 2 visible + count)
Status badge
Optional action buttons (Join/Live Now)
Clickable to navigate to detail
TaskRow
Checkbox for completion toggle
Task title (strikethrough if done)
Owner name with user icon
Due date with calendar icon
Status indicator dot
External link button
Hover effect
Cards & UI Patterns
Consistent card shadows and borders
Hover states on interactive elements
Badge variants: default, secondary, destructive, outline
Button variants: default, outline, ghost, destructive, link
Progress bars for metrics and health scores
Avatar components with fallback initials
Icon usage throughout (lucide-react)
Color & Style Conventions
Status Colors:

Success/Active: Green tint
Warning/Pending: Yellow/Orange tint
Error/Destructive: Red tint
Info: Blue tint
Neutral: Gray (muted)
Interactive States:

Hover: Reduced opacity or background color change
Active/Selected: Ring border (primary color)
Disabled: Muted foreground color
Loading: Pulse animation
Typography:

Page titles: 3xl font size, bold
Card titles: Base or lg font size, semibold
Body text: sm font size
Muted text: text-muted-foreground class
Spacing:

Page padding: p-6 or p-8
Card padding: p-4 or p-6
Section spacing: space-y-4 or space-y-6
Component gaps: gap-2, gap-3, gap-4
Border Radius:

Cards: rounded-lg (8px)
Buttons: rounded-md (6px)
Badges: rounded-full
Inputs: rounded-md
Responsive Behavior
Sidebar collapses to icon-only view (56px)
Grid layouts adapt from 3-4 columns to 1-2 columns on smaller screens
Tables become scrollable on mobile
Action buttons stack vertically on small screens
Mobile-first approach with Tailwind breakpoints (sm, md, lg)
Accessibility Features
Semantic HTML structure
ARIA labels on interactive elements
Keyboard navigation support
Focus indicators
Color contrast compliance
Icon-only buttons include screen reader text
Form labels properly associated
Animation & Interactions
Page transitions: Smooth fade-ins
Loading states: Pulse animations
Live indicators: Pulsing effect
Hover effects: Smooth opacity/background transitions
Dropdown menus: Slide-in animations
Modal overlays: Backdrop blur
Theme transitions: Smooth light/dark mode switch
This documentation provides a complete overview of the Recordin.ai user interface, covering all pages, components, interactions, and visual design patterns implemented in the application.
