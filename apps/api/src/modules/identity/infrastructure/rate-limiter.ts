type HitWindow = number[];

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
}
