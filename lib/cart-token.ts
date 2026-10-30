const GUEST_TOKEN_KEY = "guest_token";

export function getGuestToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_TOKEN_KEY);
}

export function setGuestToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function clearGuestToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_TOKEN_KEY);
}