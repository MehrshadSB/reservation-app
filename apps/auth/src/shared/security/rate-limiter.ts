type HitWindow = number[];

/**
 * In-memory sliding window. Swap for Redis when Auth is multi-instance.
 */
export class SlidingWindowRateLimiter {
  private readonly hits = new Map<string, HitWindow>();

  allow(key: string, max: number, windowMs: number, now: number): boolean {
    const cutoff = now - windowMs;
    const existing = this.hits.get(key) ?? [];
    const recent = existing.filter((at) => at > cutoff);
    if (recent.length >= max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }

  retryAfterMs(key: string, max: number, windowMs: number, now: number): number {
    const cutoff = now - windowMs;
    const recent = (this.hits.get(key) ?? []).filter((at) => at > cutoff);
    if (recent.length < max) {
      return 0;
    }
    const oldest = recent[0];
    return oldest === undefined ? 0 : oldest + windowMs - now;
  }
}
