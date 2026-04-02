# ReliOps — Maintenance Scheduling & Service Request System

A mobile app built with **React Native + Expo** that allows IoT equipment operators to schedule maintenance, create service requests, track their status, and monitor overdue work — all from their phone.

---

## Screenshots

| Equipment List | Device Detail | Create Service Request | Dashboard |
|:---:|:---:|:---:|:---:|
| ![Equipment List](assets/screenshots/equipment-list.png) | ![Device Detail](assets/screenshots/device-detail.png) | ![Create Request](assets/screenshots/create-request.png) | ![Dashboard](assets/screenshots/dashboard.png) |

---

---

## Features

### Equipment List
- View all monitored devices with color-coded status badges — `ONLINE` (green), `OFFLINE` (red), `WARNING` (amber)
- Blue badge showing number of open service requests per device
- Last maintenance date displayed on each card (or "No maintenance history")
- Live search bar to filter by device name, type, or location
- Pull-to-refresh

### Device Detail
- Full device info header — name, type, location, last seen timestamp
- Complete maintenance timeline sorted by most recent first
- Each timeline item shows status, priority, and scheduled date
- Tap any item to open its full detail view
- Prominent **"Create Service Request"** button

### Create Service Request
- Select **Priority**: Critical / High / Medium / Low
- Select **Category**: Repair / Preventive Maintenance / Inspection / Replacement
- Fill in **Title** and **Description** (both required)
- Set a **Preferred Schedule** date
- Inline validation errors for all required fields
- On submit, navigates back and the new request appears instantly in the timeline

### Service Request Detail
- View all fields from creation
- **Update Status** button to advance through: `Open → In Progress → Completed / Cancelled`
- **Add Note** section with timestamped notes
- Full **Activity Log** showing all status changes and notes in reverse chronological order

### Dashboard (Tab 2)
- Counts by status: Open, In Progress, Completed, Cancelled
- Counts by priority: Critical, High, Medium, Low
- **Overdue Requests** list — any active request whose scheduled date has passed

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile framework |
| Expo Router | File-based navigation (tabs + stack) |
| TypeScript | Full type safety across the codebase |
| Redux Toolkit | Global state management |
| React Native Paper | Material Design 3 UI components |

---

## Project Structure

```
app/
  (tabs)/
    index.tsx          # Equipment List screen
    dashboard.tsx      # Summary Dashboard screen
  device/
    [id].tsx           # Device Detail screen
  service-request/
    create.tsx         # Create Service Request form
    [id].tsx           # Service Request Detail screen
  _layout.tsx          # Root layout (Redux + Paper providers)

store/
  index.ts             # Redux store configuration
  slices/
    devicesSlice.ts         # Device state + async fetch + search
    serviceRequestsSlice.ts # Requests state + CRUD + status + notes
  selectors/
    deviceSelectors.ts           # Filtered devices, badge counts
    serviceRequestSelectors.ts   # Counts, overdue, by-id lookups

types/
  index.ts             # All TypeScript interfaces and enums

data/
  mockData.ts          # Seed data — 5 devices, 7 service requests

hooks/
  index.ts             # Typed useAppDispatch and useAppSelector
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Run the app

```bash
npm install
npx expo start
```

Then scan the QR code with your phone camera (iOS) or the Expo Go app (Android).

---

## State Management

Two Redux slices manage all app state:

**`devicesSlice`**
- Stores the device list, loading/error state, and search query
- `fetchDevices` thunk simulates a 600ms API call using mock data
- `setSearchQuery` action triggers filtered device list via selector

**`serviceRequestsSlice`**
- Stores all service requests in a flat normalized array
- `fetchServiceRequests` thunk simulates a 600ms load
- `createServiceRequest` thunk simulates a 400ms POST
- `updateStatus` and `addNote` reducers update state and append to activity log

All derived data (filtered lists, badge counts, overdue requests, dashboard counts) is computed with memoized `createSelector` selectors — never stored redundantly in state.

---

## Key Design Decisions

- **Flat request array** — all service requests live in one Redux slice, filtered by `deviceId` on the fly using selectors. Simple and avoids nested state updates.
- **Mock async delays** — `createAsyncThunk` with `setTimeout` simulates real API latency, making loading states meaningful and testable.
- **File-based routing** — Expo Router maps files to routes automatically. Dynamic routes (`[id].tsx`) handle device and request detail screens cleanly.
- **No prop drilling** — all screens read directly from Redux via typed selectors. No context or prop chains needed.
