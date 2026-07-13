// HUD. Two parts:
//  1. `drawDebug` — the M0 bitmap fps/coords readout drawn into the framebuffer,
//     kept for the headless render tool and a dev overlay.
//  2. `Hud` — the M1 neon-terminal DOM overlay (docs/08): Trust meter, evidence,
//     weapon, narration toasts, crosshair, and the win/reveal card. DOM is used
//     for text-heavy, easily-glitched, interactive chrome layered over the canvas.

import { Framebuffer, rgba } from './framebuffer';
import type { TrustTier } from '../mechanics/trust';

// 3x5 pixel glyphs, encoded row-major as bit strings (LSB = leftmost pixel).
// Only the characters we need for a debug line.
const GLYPHS: Record<string, number[]> = {
  '0': [0b111, 0b101, 0b101, 0b101, 0b111],
  '1': [0b010, 0b110, 0b010, 0b010, 0b111],
  '2': [0b111, 0b001, 0b111, 0b100, 0b111],
  '3': [0b111, 0b001, 0b111, 0b001, 0b111],
  '4': [0b101, 0b101, 0b111, 0b001, 0b001],
  '5': [0b111, 0b100, 0b111, 0b001, 0b111],
  '6': [0b111, 0b100, 0b111, 0b101, 0b111],
  '7': [0b111, 0b001, 0b010, 0b010, 0b010],
  '8': [0b111, 0b101, 0b111, 0b101, 0b111],
  '9': [0b111, 0b101, 0b111, 0b001, 0b111],
  '.': [0b000, 0b000, 0b000, 0b000, 0b010],
  ':': [0b000, 0b010, 0b000, 0b010, 0b000],
  ' ': [0b000, 0b000, 0b000, 0b000, 0b000],
  F: [0b111, 0b100, 0b111, 0b100, 0b100],
  P: [0b111, 0b101, 0b111, 0b100, 0b100],
  S: [0b111, 0b100, 0b111, 0b001, 0b111],
  X: [0b101, 0b101, 0b010, 0b101, 0b101],
  Y: [0b101, 0b101, 0b010, 0b010, 0b010],
};

function drawGlyph(fb: Framebuffer, ch: string, x: number, y: number, color: number): void {
  const g = GLYPHS[ch.toUpperCase()] ?? GLYPHS[' ']!;
  for (let row = 0; row < 5; row++) {
    const bits = g[row]!;
    for (let col = 0; col < 3; col++) {
      if (bits & (1 << col)) fb.setPixel(x + col, y + row, color);
    }
  }
}

export function drawText(fb: Framebuffer, text: string, x: number, y: number, color: number): void {
  let cx = x;
  for (const ch of text) {
    drawGlyph(fb, ch, cx, y, color);
    cx += 4; // 3px glyph + 1px space
  }
}

export function drawDebug(fb: Framebuffer, fps: number, px: number, py: number): void {
  const green = rgba(124, 255, 178); // neon accent (docs/08)
  drawText(fb, `FPS:${fps.toFixed(0)}`, 3, 3, green);
  drawText(fb, `X:${px.toFixed(1)} Y:${py.toFixed(1)}`, 3, 10, green);
}

// ---------------------------------------------------------------------------
// Neon terminal DOM HUD (M1)
// ---------------------------------------------------------------------------

function el(tag: string, className: string, parent: HTMLElement): HTMLDivElement {
  const e = document.createElement(tag) as HTMLDivElement;
  e.className = className;
  parent.appendChild(e);
  return e;
}

export class Hud {
  readonly root: HTMLDivElement;
  private trustFill: HTMLDivElement;
  private trustLabel: HTMLDivElement;
  private evidenceEl: HTMLDivElement;
  private weaponEl: HTMLDivElement;
  private toastWrap: HTMLDivElement;
  private reveal: HTMLDivElement;

  constructor(mount: HTMLElement = document.body) {
    this.root = el('div', 'hud', mount);

    const trustBox = el('div', 'hud-trust', this.root);
    this.trustLabel = el('div', 'hud-trust-label', trustBox);
    this.trustLabel.textContent = 'TRUST 100%';
    const bar = el('div', 'hud-trust-bar', trustBox);
    this.trustFill = el('div', 'hud-trust-fill', bar);

    const bottom = el('div', 'hud-bottom', this.root);
    this.weaponEl = el('div', 'hud-weapon', bottom);
    this.evidenceEl = el('div', 'hud-evidence', bottom);

    el('div', 'hud-crosshair', this.root);

    this.toastWrap = el('div', 'hud-toasts', this.root);

    this.reveal = el('div', 'hud-reveal hidden', this.root);

    this.setWeapon('Context Scanner');
    this.setEvidence(0);
  }

  setTrust(value: number, tier: TrustTier): void {
    const pct = Math.round(value);
    this.trustLabel.textContent = `TRUST ${pct}%`;
    this.trustFill.style.width = `${pct}%`;
    this.root.dataset['tier'] = tier;
  }

  setEvidence(n: number): void {
    this.evidenceEl.textContent = `EVIDENCE ${n}`;
  }

  setWeapon(name: string): void {
    this.weaponEl.textContent = name;
  }

  /** Distortion glitch on the whole HUD (docs/05 T1). */
  setGlitch(on: boolean): void {
    this.root.classList.toggle('glitch', on);
  }

  /** Transient narration line in dev-humor voice; confirms, never gates (docs/07). */
  toast(text: string): void {
    const t = el('div', 'hud-toast', this.toastWrap);
    t.textContent = text;
    // Force reflow then fade in/out via CSS classes.
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 600);
    }, 3200);
  }

  /** The end-of-slice reveal card mapping the fiction to real Entire (docs/07). */
  showReveal(title: string, lines: string[]): void {
    this.reveal.innerHTML = '';
    const h = el('div', 'hud-reveal-title', this.reveal);
    h.textContent = title;
    for (const line of lines) {
      const p = el('div', 'hud-reveal-line', this.reveal);
      p.textContent = line;
    }
    this.reveal.classList.remove('hidden');
  }

  hideReveal(): void {
    this.reveal.classList.add('hidden');
  }
}
