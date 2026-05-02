# Notification System — Design Decisions

## Data Handling & Design Decisions

### API Boundary & Data Modeling

The API returns notification objects with timestamps as strings. Instead of using this format directly across the application, I introduced a clear boundary between the API layer and the domain layer:

* **RawNotification** represents the API response shape
* **Notification** represents the internal application model with a `Date` object for timestamps

The transformation is handled inside the service layer. This ensures:

* type safety across the application
* no repeated parsing logic in UI components
* a clean separation between external data and internal representation

---

### API Service Robustness

The `fetchNotifications` service is designed to handle real-world inconsistencies:

* Differentiates between **network errors** and **HTTP errors**
* Validates response shape (ensures array before processing)
* Gracefully handles unexpected API responses
* Converts timestamp strings into `Date` objects during parsing

---

### Timestamp Handling Strategy

Instead of repeatedly parsing timestamps across the application, all conversions happen once in the service layer.

Additionally:

* Invalid timestamps are safely handled by falling back to `Date(0)`
* Sorting uses `Date.getTime()` to avoid repeated conversions and improve performance

---

### Fallback Strategy (Resilience)

The API currently returns a `401` in some cases. To avoid blocking development and to ensure UI stability:

* The hook falls back to **mock data** when:

  * API request fails
  * response is empty or invalid

This ensures:

* UI remains testable
* features like filtering and pagination can still be validated

---

### Hook-Level Abstraction

The `useNotifications` hook acts as the central orchestration layer:

* Calls the API service
* Applies fallback logic
* Manages loading and error states
* Exposes processed data to the UI

This keeps UI components focused purely on rendering logic.

---

### Mock Data Consistency

Mock data is aligned with the domain model:

* Uses `Date` objects instead of strings
* Matches the same structure as processed API data

This ensures consistent behavior regardless of data source.

---

### Overall Approach

The system is designed with a clear data flow:

```
API → Service (parse & normalize) → Hook (state & fallback) → UI (render)
```

This separation improves:

* maintainability
* testability
* scalability for future extensions (e.g., real-time updates)

---

## Architecture

```
src/
├── types/notification.ts            # RawNotification + Notification + filter types
├── services/notificationService.ts  # Fetch, parse, normalize API data
├── utils/
│   ├── sortNotifications.ts         # Sort by type priority + timestamp
│   └── formatTimestamp.ts           # Date → human-readable string
├── mocks/notifications.ts           # Fallback mock data (Date objects)
├── hooks/useNotifications.ts        # State orchestration + API integration
├── components/NotificationCard.tsx  # Reusable card (memoized)
└── pages/NotificationsPage.tsx      # Page with filter + pagination
```

---

## Trade-offs

- Chose fallback to mock data instead of failing UI to ensure development continuity
- Performed timestamp parsing at the service layer to avoid repeated computation in components
- Did not introduce global state management (Redux/Zustand) to keep scope minimal and focused

---

## Alternative Approaches Considered

### Server-Side Sorting

Sorting could have been delegated to the backend via query parameters.
However, client-side sorting was chosen because:

* the dataset is small
* reduces dependency on API flexibility
* allows consistent behavior even with mock fallback data

---

### Global State Management (Redux/Zustand)

A global store could have been introduced for notification state.
This was avoided because:

* the scope is limited to a single feature
* React hooks provide sufficient state handling
* avoids unnecessary complexity and boilerplate

---

### Real-Time Updates (WebSockets / Polling)

Real-time notification updates were considered.
Not implemented because:

* not part of the current requirements
* would introduce additional complexity (connection handling, reconnection logic)

---

### Strict Failure Mode (No Fallback Data)

Instead of falling back to mock data, the UI could fail completely on API errors.
Fallback was preferred to:

* allow uninterrupted UI testing
* ensure consistent UX during API instability
* improve development workflow
