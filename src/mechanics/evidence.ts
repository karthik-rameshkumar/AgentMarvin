// Evidence tokens (docs/02) — gathered from Sessions/Scanner and docked at a Gate.
// Tokens are keyed by source so the same discovery can't be double-counted.

export class Evidence {
  private sources = new Set<string>();

  /** Record a piece of evidence from `source`. Returns true if it was new. */
  add(source: string): boolean {
    if (this.sources.has(source)) return false;
    this.sources.add(source);
    return true;
  }

  get count(): number {
    return this.sources.size;
  }

  has(n: number): boolean {
    return this.sources.size >= n;
  }

  /** Consume `n` tokens (e.g. docked at a Gate). Returns false if insufficient. */
  spend(n: number): boolean {
    if (this.sources.size < n) return false;
    const it = this.sources.values();
    for (let i = 0; i < n; i++) {
      const next = it.next();
      if (!next.done) this.sources.delete(next.value);
    }
    return true;
  }

  list(): string[] {
    return [...this.sources];
  }
}
