# Take-Home Assessment: Maintenance Scheduling & Service Request System

**Candidate:** Tesfalem Hussien
**Time Limit:** 5–6 hours (do not exceed)

---

## Context

Knaq is an IoT equipment monitoring platform. Our mobile app currently allows users to view equipment status, monitor real-time alerts, and see basic analytics. However, we're missing a critical workflow: **when equipment has issues, there's no way to schedule maintenance or create service requests from within the app.**

Currently, when a device triggers an alert or shows degraded performance, users can only snooze alerts or add notes. There's no structured way to:

- Create a service request tied to a specific device
- Schedule preventive or reactive maintenance
- Track the status of ongoing maintenance work
- See a history of past maintenance for a device

Your task is to **build this feature as a standalone React Native app** that demonstrates how you'd approach this problem.

---

## Tech Stack

Build this using:

- **React Native with Expo** (use Expo Router for navigation)
- **TypeScript**
- **Redux Toolkit** for state management
- **Any UI library of your choice** (e.g., React Native Paper, NativeBase, Tamagui, or custom)

Initialize a fresh Expo project — this should be a standalone, runnable app.

---

## What to Build

### 1. Equipment List Screen

A home screen showing a list of monitored equipment. Each item should display:

- Device name and type (e.g., "Elevator 3A - HVAC")
- Current status: `online`, `offline`, or `warning` (color-coded)
- Number of **open service requests** for that device (badge count)
- Last maintenance date (or "No maintenance history")

Tapping a device navigates to its detail screen.

**Include:** Search/filter functionality to narrow the list.

### 2. Device Detail Screen

Shows device information and its maintenance history:

- Device info header (name, type, status, location, last seen)
- **Maintenance timeline**: A chronological list of all service requests for this device (past and current), showing status progression
- A prominent **"Create Service Request"** button

### 3. Create Service Request Screen

A form to create a new service request tied to a device:

- **Priority**: Critical / High / Medium / Low (selectable)
- **Category**: Repair, Preventive Maintenance, Inspection, Replacement (selectable)
- **Title**: Short description (text input, required)
- **Description**: Detailed description (multiline text input, required)
- **Preferred Schedule**: Date and time picker for when the maintenance should occur
- **Form validation**: Show inline errors for missing required fields
- On submit: Save to state and navigate back to the device detail screen, where the new request should appear in the timeline

### 4. Service Request Detail Screen

Tapping a service request from the timeline opens a detail view:

- All fields from creation
- Current **status**: `open` → `in_progress` → `completed` or `cancelled`
- **Status update action**: A button/dropdown to advance the status (e.g., "Mark In Progress", "Mark Completed")
- **Notes section**: Ability to add timestamped notes to the request
- Status changes and notes should appear in a simple activity log on this screen

### 5. Summary Dashboard (Tab)

A separate tab showing an overview of all service requests across all devices:

- Counts by status (open, in progress, completed, cancelled)
- Counts by priority
- List of **overdue requests** (where the scheduled date has passed but status is not `completed` or `cancelled`)

---

## State Management

Use Redux Toolkit for state management. In your `SOLUTION.md`, explain:

- How you structured your state
- How you handle async operations (simulated API calls with mock delays)
- How you derive computed/filtered data efficiently

---

## Evaluation Criteria

| Criteria                        | Weight | What We Look For                                                                                                               |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Architecture & Code Quality** | 30%    | Clean project structure. Proper TypeScript (interfaces, enums, no `any`). Separation of concerns. Consistent patterns.         |
| **State Management**            | 30%    | Well-structured Redux state. Proper use of slices, thunks, and selectors. Efficient derived data. Proper async handling.       |
| **UI/UX & Product Thinking**    | 25%    | Intuitive flows. Proper loading/empty/error states. Form validation. The app should feel like a real product, not a prototype. |
| **Navigation & Data Flow**      | 15%    | Correct Expo Router setup. Data flows cleanly between screens without excessive prop drilling.                                 |

---

## Nice to Have (Not Required)

- **Unit tests** — tests for core state logic and/or a UI component will stand out
- Animated status transitions or micro-interactions
- Optimistic updates (UI updates immediately, then syncs)
- Pull-to-refresh on list screens
- Light/dark theme support
- Custom hooks that encapsulate business logic (e.g., `useDeviceRequests`, `useOverdueRequests`)
- Accessibility labels and roles

---

## Submission

1. Push to a **GitHub repository** (public or private — if private, add us as collaborators)
2. Share the repo link with us
3. Include a `SOLUTION.md` at the project root with:

- Your architectural decisions and reasoning
- Trade-offs you made given the time constraint
- What you'd improve or add with more time
- Any additional libraries you installed and why
- If and how you used AI tools (e.g., Copilot, ChatGPT, Claude) during the assessment — be honest, we value transparency
- Verify the app runs cleanly:
  ```bash
  npm install
  npx expo start
  ```

---

## Tips

- **Commit early and often** — we review commit history to understand how you think and build incrementally.
- **Quality over quantity** — if you're running low on time, it's better to have 3 polished screens than 5 half-finished ones.
- **No backend needed** — all data lives locally with mock async calls.
- **Document assumptions** — if anything is ambiguous, note it in `SOLUTION.md` and make a reasonable choice.

Good luck!
