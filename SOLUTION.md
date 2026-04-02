# SOLUTION.md

## Architectural Decisions

### State Structure
Redux Toolkit manages two slices:

- **`devices`** — holds the device list, loading/error state, and a `searchQuery` string for filtering.
- **`serviceRequests`** — holds all service requests across all devices. Requests are normalized in a flat array and filtered/derived using memoized selectors.

Selectors (`reselect` via RTK's `createSelector`) handle all derived data:
- `selectFilteredDevices` — filters devices by search query
- `selectOpenRequestCountByDevice` — badge counts per device
- `selectRequestsByDevice(id)` — timeline for a specific device
- `selectCountsByStatus/Priority` — dashboard summary counts
- `selectOverdueRequests` — requests past their scheduled date that aren't done/cancelled

### Async Operations
Both `fetchDevices` and `fetchServiceRequests` are `createAsyncThunk` calls that simulate a 600ms API delay using `setTimeout`. `createServiceRequest` uses a 400ms delay to simulate a POST. Loading states are tracked in each slice and shown in the UI via `ActivityIndicator`.

### Navigation
Expo Router with file-based routing:
- `app/(tabs)/index.tsx` — Equipment List (Tab 1)
- `app/(tabs)/dashboard.tsx` — Dashboard (Tab 2)
- `app/device/[id].tsx` — Device Detail (stack)
- `app/service-request/create.tsx` — Create form (stack)
- `app/service-request/[id].tsx` — Request Detail (stack)

Redux `<Provider>` and `<PaperProvider>` wrap the entire app in `app/_layout.tsx`.

## Trade-offs

- **Date input as text field** — A proper date picker (e.g., `@react-native-community/datetimepicker`) requires native modules and additional setup. Used a text input with `YYYY-MM-DD` format validation to keep setup clean within the time constraint.
- **No persistence** — State resets on reload. A production app would use `redux-persist` or a local database.
- **Flat request array** — All requests live in one array filtered by `deviceId`. At scale, a normalized map (`Record<id, Request>`) would be more efficient.

## What I'd Improve With More Time
- Animated status transitions between timeline states
- Proper native date/time picker
- `redux-persist` for state persistence across restarts
- Unit tests for slices and selectors
- Pull-to-refresh with real API integration
- Light/dark theme support via React Native Paper theming
- Accessibility labels and roles on all interactive elements

## Libraries Used
- **`@reduxjs/toolkit`** — Reduces Redux boilerplate, includes `createAsyncThunk` and `createSelector`
- **`react-redux`** — React bindings for Redux
- **`react-native-paper`** — Material Design 3 UI components (Cards, Chips, Buttons, TextInputs, SegmentedButtons)
- **`expo-router`** — File-based routing for Expo, provides type-safe navigation

## AI Tool Usage
GitHub Copilot was used for autocomplete suggestions during development. All architectural decisions, data modeling, component structure, and implementation logic were written and reviewed by me.
