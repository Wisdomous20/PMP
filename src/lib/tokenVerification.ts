const tokenStore = new Map<string, { token: string; expires: Date }>();

export function setToken(attendeeId: string, token: string, expires: Date) {
  tokenStore.set(attendeeId, { token, expires });
}

export function getTokenData(attendeeId: string) {
  return tokenStore.get(attendeeId);
}

export function deleteToken(attendeeId: string) {
  tokenStore.delete(attendeeId);
}