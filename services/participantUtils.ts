export function getValidParticipantUids(uids: string[]): string[] {
  return uids.filter((uid) => uid?.trim().length > 0);
}
