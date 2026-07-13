// Minimal debug HUD for M0: a tiny bitmap font renders fps + coords into the
// framebuffer. The full neon terminal HUD + Trust meter (docs/05, docs/08) lands
// in M1; this is just enough to prove the exit criterion (~60fps).

import { Framebuffer, rgba } from './framebuffer';

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
