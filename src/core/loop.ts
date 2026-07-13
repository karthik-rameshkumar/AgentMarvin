// Fixed-timestep game loop (docs/11-technical-spec.md: sim @60Hz, render decoupled).
// The simulation advances in fixed 1/60s steps for deterministic, framerate-
// independent movement ("Movement First" pillar). Rendering runs once per rAF and
// receives an interpolation alpha for smoothness on high-refresh displays.

export interface LoopCallbacks {
  /** Advance the simulation by a fixed dt (seconds). */
  update(dt: number): void;
  /** Draw a frame. `alpha` in [0,1) interpolates between the last two sim steps. */
  render(alpha: number): void;
  /** Optional per-frame FPS report. */
  onFps?(fps: number): void;
}

export class GameLoop {
  private readonly step = 1 / 60; // fixed sim timestep in seconds
  private readonly maxFrame = 0.25; // clamp to avoid spiral-of-death after tab-out
  private accumulator = 0;
  private lastTime = 0;
  private running = false;
  private rafId = 0;

  // FPS tracking over a rolling ~0.5s window.
  private fpsAccum = 0;
  private fpsFrames = 0;

  constructor(private readonly cb: LoopCallbacks) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private frame = (now: number): void => {
    if (!this.running) return;
    let frameTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (frameTime > this.maxFrame) frameTime = this.maxFrame;

    this.accumulator += frameTime;
    while (this.accumulator >= this.step) {
      this.cb.update(this.step);
      this.accumulator -= this.step;
    }

    const alpha = this.accumulator / this.step;
    this.cb.render(alpha);

    // FPS meter.
    this.fpsAccum += frameTime;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.cb.onFps?.(this.fpsFrames / this.fpsAccum);
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }

    this.rafId = requestAnimationFrame(this.frame);
  };
}
