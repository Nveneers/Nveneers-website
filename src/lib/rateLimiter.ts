// In-memory sliding-window rate limiter.
// State is per-serverless-function-instance (resets on cold start), which is
// acceptable for a small site with no Redis available.

const WINDOW_MS = 60_000; // 1 minute

// Map<ip, timestamps[]> — timestamps are ms since epoch
const log = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  limit: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  // Prune stale entries and get current window timestamps
  const prev = (log.get(ip) ?? []).filter((t) => t > cutoff);

  if (prev.length >= limit) {
    // Oldest timestamp in the window tells us when the first slot frees up
    const retryAfterMs = prev[0] + WINDOW_MS - now;
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  prev.push(now);
  log.set(ip, prev);
  return { allowed: true, retryAfterSeconds: 0 };
}
