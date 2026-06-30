# Testing Instructions

## Goal

Use Mock Service Worker (MSW) for all API mocking during tests.

Do not mock TanStack Query hooks or API hooks with `vi.mock()` unless explicitly required by a test.

Tests should use realistic API responses through MSW so components are tested as close to production as possible.

---

## Required Setup

Install and configure:

- msw
- @mswjs/data (optional, if useful)
- msw/node

Create a reusable MSW server for Vitest.

Example structure:

```
src/
    test/
        msw/
            server.ts
            handlers.ts
            factories.ts
```

---

## Vitest

Configure Vitest so that:

- MSW server starts before all tests
- handlers are reset after every test
- server closes after all tests

Never require individual tests to start or stop the server.

---

## API Mocking

Mock HTTP requests instead of React hooks.

Intercept every backend endpoint used by the application.

Example:

- GET /api/trainroutes
- GET /api/trainstops
- GET /api/trainstations
- POST ...
- PUT ...
- PATCH ...
- DELETE ...

Return realistic JSON matching the production API.

---

## Test Data

Store reusable test data separately.

Example:

```
src/test/msw/factories.ts
src/test/msw/data/
```

The test data should

- resemble production data
- contain multiple entities
- contain edge cases
- be strongly typed
- be reusable across tests

Prefer factory functions over inline objects.

Example:

```
createTrainroute()
createTrainstation()
createVeloroute()
```

Tests may override only the data they need.

---

## TanStack Query

Never mock TanStack Query.

Allow queries to execute normally.

MSW must provide the responses.

The QueryClient should be created by the shared test utilities.

Use a fresh QueryClient for every test.

Disable retries in tests.

---

## React Testing Library

Render components using the shared render helper.

Example:

```
renderWithProviders(<Component />)
```

The helper should include

- QueryClientProvider
- Router
- Theme providers
- any additional providers required by the application

---

## Individual Tests

Tests should not contain API mocking unless they intentionally override a handler.

Example:

```
server.use(
    http.get("/api/trainroutes", () => {
        return HttpResponse.json([...]);
    }),
);
```

Only override handlers for the specific scenario being tested.

---

## Assertions

Test behaviour instead of implementation.

Prefer assertions based on:

- rendered UI
- loading states
- success states
- error states
- user interaction

Avoid testing internal implementation details.

---

## Network Safety

Configure MSW so that every unexpected network request fails the test.

Unhandled requests must never silently succeed.

---

## File Organization

Recommended structure:

```
src/
    test/
        render.tsx
        queryClient.ts
        msw/
            server.ts
            handlers.ts
            factories.ts
            data/
```

---

## Existing Project Conventions

Respect all existing project conventions.

Do not replace existing testing utilities unless necessary.

Reuse existing providers and helper functions whenever possible.

Maintain strict TypeScript typing.

Avoid duplication.

Keep handlers modular and easy to extend as new API endpoints are added.
