// ─── React Query key factories ───────────────────────────────────────────────
// Each domain exposes a hierarchy of keys so invalidation can be broad or narrow.
//
// Usage examples:
//   queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all })        → all gallery queries
//   queryClient.invalidateQueries({ queryKey: galleryQueryKeys.walk(id) })   → single walk gallery
//   useQuery({ queryKey: galleryQueryKeys.global(50), queryFn: ... })

export const galleryQueryKeys = {
  all: ['gallery'] as const,
  global: (limit?: number) => ['gallery', 'global', limit] as const,
  byTag: (tag: string, limit?: number) =>
    ['gallery', 'tag', tag, limit] as const,
  walk: (walkId: string) => ['gallery', 'walk', walkId] as const,
};

export const userQueryKeys = {
  all: ['user'] as const,
  profile: (uid: string) => ['user', 'profile', uid] as const,
  profiles: (uids: string[]) =>
    ['user', 'profiles', [...uids].sort().join(',')] as const,
};

export const walkQueryKeys = {
  all: ['walk'] as const,
  detail: (walkId: string) => ['walk', 'detail', walkId] as const,
};

