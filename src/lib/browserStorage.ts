// Storage is an optional convenience; server-side rate limits remain authoritative.
export function readStorage(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
export function writeStorage(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* Restricted browser storage. */ }
}
