# ADR-001: Adopt React Query for Server-State Management

## Context

The app fetches data from Firestore in two distinct ways:

1. **Real-time subscriptions** (`onSnapshot`) — used for walks and the authenticated user profile.
2. **One-shot reads** (`getDoc` / `getDocs`) — used for photos, gallery data, and public user profiles.

Problems with the current one-shot approach:

- After uploading a photo, the gallery tab still shows stale data until the component fully remounts or a dependency changes.
- Every tab visit triggers a new network request, even if the data hasn't changed.
- There is no shared cache: the same user profiles are re-fetched independently by multiple screens.
- Loading/error state management is duplicated in every screen via manual `useState`.

## Decision

Introduce **`@tanstack/react-query`** for all **one-shot Firestore reads and mutations**.

### Managed by React Query

| Category | Functions | Reason |
|----------|-----------|--------|
| Gallery photos | `getGlobalGallery`, `getGalleryByTag` | Cacheable, filterable, stale-while-revalidate |
| Walk photos | `getWalkGallery` | Cacheable per walk, invalidated after upload |
| User profiles | `getUserProfile`, `getUserProfiles` | Frequently re-read, cacheable by UID |
| Photo mutations | `uploadWalkPhoto` | Mutation → invalidates gallery queries |
| Walk mutations | `joinWalk`, `leaveWalk` | Mutation → handled by subscription already, but can optimistically update query caches |
| Profile mutations | `updateUserProfile`, `createUserProfile` | Mutation → invalidates user profile queries |

### NOT managed by React Query (kept as Firestore subscriptions)

| Category | Functions | Reason |
|----------|-----------|--------|
| Latest walk (home) | `subscribeToLatestWalk` | Real-time updates from Firestore `onSnapshot` |
| Past walks (home) | `subscribeToPastWalks` | Real-time |
| Walk detail | `subscribeToWalkById` | Real-time (join/leave reflected instantly) |
| User's walks (profile) | `subscribeToUserWalks` | Real-time |
| Auth user profile | `subscribeToUserProfile` | Real-time, managed by `AuthProvider` |

### Rationale for the boundary

Firestore `onSnapshot` already provides a "live cache" with automatic updates — wrapping it in React Query would add complexity without benefit. React Query shines for request/response data that is read once and should be cached, deduplicated, and invalidated on mutations.

## Consequences

- Gallery screens show cached data instantly on revisit; background refetch keeps them fresh.
- After `uploadWalkPhoto`, invalidating the relevant query keys forces an immediate refetch.
- Profile data is cached and shared across screens (participant lists, uploader avatars, user pages).
- Consistent loading/error states via `useQuery` reduce boilerplate.
- New dependency: `@tanstack/react-query` (~12 KB gzipped).

