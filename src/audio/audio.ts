// Synthesized audio (docs/08) — no asset files. A tiny Web Audio synth produces
// retro SFX (footstep, door, pickup) and a low ambient drone. The AudioContext is
// created lazily on the first user gesture (pointer lock) to satisfy browser
// autoplay policy. Structured so docs/05's Trust-reactive mixing can hook in later.

export class Audio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  /** Call from a user gesture. Idempotent. */
  resume(): void {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    this.master = master;

    this.startDrone();
  }

  /** Low ambient two-oscillator drone; a bed the Trust mix can detune later. */
  private startDrone(): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    // Local gain node; a future Trust-reactive mix (docs/05) can detune/duck this.
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    gain.connect(this.master);

    for (const freq of [55, 82.4]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain).connect(osc.frequency);
      osc.connect(gain);
      osc.start();
      lfo.start();
    }
  }

  /** Short percussive/tonal blip used by the SFX helpers. */
  private blip(
    type: OscillatorType,
    freq: number,
    dur: number,
    vol: number,
    sweepTo?: number,
  ): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (sweepTo !== undefined) osc.frequency.exponentialRampToValueAtTime(sweepTo, now + dur);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + dur);
  }

  footstep(): void {
    this.blip('square', 90, 0.06, 0.12, 60);
  }

  door(): void {
    this.blip('sawtooth', 140, 0.28, 0.16, 70);
  }

  pickup(): void {
    this.blip('triangle', 520, 0.12, 0.18, 880);
  }

  /** Context Scanner primary sweep. */
  scan(): void {
    this.blip('sawtooth', 300, 0.14, 0.1, 520);
  }

  /** Context Scanner alt-fire precise ping. */
  ping(): void {
    this.blip('sine', 880, 0.1, 0.14, 1320);
  }

  /** Session Replayer — ethereal shimmer as a ghost spawns. */
  ghost(): void {
    this.blip('triangle', 220, 0.5, 0.12, 440);
  }

  /** Evidence token gained. */
  evidence(): void {
    this.blip('triangle', 660, 0.16, 0.16, 990);
  }

  /** Gate decision committed (thunky, ceremonial). */
  gate(): void {
    this.blip('square', 120, 0.4, 0.2, 80);
  }
}
