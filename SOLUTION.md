# SOLUTION.md

## How I approached this

My first instinct was to figure out the data model before touching any UI. Once I knew what a `Device` and a `ServiceRequest` looked like — and how they related to each other — everything else followed pretty naturally. I sketched out the enums and interfaces first, then figured out how to structure state around them.

I went with two Redux slices (`devices` and `serviceRequests`) because they're genuinely independent concerns. Devices don't care about requests at the slice level — the relationship only matters at the selector level, where I compute things like badge counts per device or the maintenance timeline. Keeping slices flat made reducers much simpler to reason about.

---

## State Structure

```
devices:
  items: Device[]
  loading: boolean
  error: string | null
  searchQuery: string

serviceRequests:
  items: ServiceRequest[]
  loading: boolean
  error: string | null
```

All requests live in a single flat array. I didn't nest them under device IDs because that would make cross-device queries (like the dashboard counts and overdue list) more complicated. Instead, selectors do the filtering — `selectRequestsByDevice(id)` filters by `deviceId` on the fly and sorts by `createdAt` descending.

Derived data computed by selectors:
- `selectFilteredDevices` — search filter across name, type, and location
- `selectOpenRequestCountByDevice` — badge counts for the equipment list
- `selectCountsByStatus` / `selectCountsByPriority` — dashboard summary numbers
- `selectOverdueRequests` — active requests where `scheduledDate` is in the past
- `selectRequestById` — used in the detail screen

All selectors use `createSelector` for memoization so they only recompute when their inputs actually change.

---

## Async / Mock API

I used `createAsyncThunk` for both `fetchDevices` and `fetchServiceRequests` with a 600ms simulated delay, and `createServiceRequest` with a 400ms delay to mimic a POST. This makes loading states real and testable rather than instantly resolving.

Each thunk has `pending`, `fulfilled`, and `rejected` handlers in the slice. The UI shows an `ActivityIndicator` on pending and an error message on rejection.

---

## Navigation

Expo Router with file-based routing. The tab bar covers the two main surfaces (Equipment and Dashboard), and the stack handles the drill-down flows:

- Tap a device → `device/[id].tsx`
- Tap "Create Service Request" → `service-request/create.tsx?deviceId=...`
- Tap a timeline item → `service-request/[id].tsx`

Passing `deviceId` as a search param to the create screen felt cleaner than trying to persist it through Redux — it's just URL state at that point.

---

## Trade-offs I made

**Date input as a text field** — I would normally reach for `@react-native-community/datetimepicker` but it needs native build steps and I didn't want to risk breaking the Expo Go setup mid-challenge. The text field with `YYYY-MM-DD` validation gets the job done and the constraint is documented.

**No state persistence** — Everything resets on reload. A real app would use `redux-persist` with AsyncStorage. I left it out intentionally since the brief said "no backend needed" and adding persistence would've taken time away from getting the core flows right.

**Flat request array over normalized map** — At the scale of this app a flat array filtered by selector is fine. At production scale I'd switch to a `Record<string, ServiceRequest>` map with a separate `ids` array for ordering — the RTK `createEntityAdapter` pattern. I kept it simpler here to stay within the time budget.

---

## What I'd add with more time

- A real date picker (native, not a text field)
- `redux-persist` so state survives app restarts
- Unit tests for the slice reducers and selectors — pure functions, easy to test, high value
- Animated transitions when a request status changes in the timeline
- Centralized theme/colors file — right now STATUS_COLOR and PRIORITY_COLOR maps are repeated across a few screens
- Accessibility roles and labels throughout

---

## Libraries

- **`@reduxjs/toolkit`** — I use this on every Redux project. Thunks, immer-backed reducers, and `createSelector` integration in one package.
- **`react-redux`** — Standard React bindings.
- **`react-native-paper`** — Went with this over NativeBase because the v5 API is cleaner and `SegmentedButtons` fit the priority/category selector perfectly.
- **`expo-router`** — File-based routing. Once you get used to the `(tabs)` folder convention it's fast to work with.

---

## AI Tool Usage

I used GitHub Copilot for tab-completion on repetitive patterns — things like `StyleSheet.create` blocks, switch-case exhaustiveness, and slice boilerplate. All architecture decisions, data modelling, selector design, and product thinking were done by me.
