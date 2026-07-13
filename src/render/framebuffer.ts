// 320x200 software framebuffer, integer-scaled to the canvas (docs/08, docs/11).
// Pixels are packed as 32-bit little-endian ABGR (the memory layout the browser's
// ImageData expects on little-endian machines), so a single set of the underlying
// Uint32Array maps directly to an RGBA pixel.

export const SCREEN_W = 320;
export const SCREEN_H = 200;

/** Pack r,g,b,a (0-255) into the 0xAABBGGRR word ImageData expects. */
export function rgba(r: number, g: number, b: number, a = 255): number {
  return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

/** Scale each channel of a packed color by t in [0,1] (cheap distance shading). */
export function shade(color: number, t: number): number {
  const r = (color & 0xff) * t;
  const g = ((color >> 8) & 0xff) * t;
  const b = ((color >> 16) & 0xff) * t;
  const a = (color >> 24) & 0xff;
  return rgba(r | 0, g | 0, b | 0, a);
}

export class Framebuffer {
  readonly width = SCREEN_W;
  readonly height = SCREEN_H;
  /** Packed ABGR pixels, row-major, length width*height. */
  readonly buf: Uint32Array;
  private readonly imageData: ImageData;
  private readonly u32View: Uint32Array;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    canvas.width = SCREEN_W;
    canvas.height = SCREEN_H;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.imageData = ctx.createImageData(SCREEN_W, SCREEN_H);
    // View the ImageData bytes as 32-bit words so we can blit in one copy.
    this.u32View = new Uint32Array(this.imageData.data.buffer);
    this.buf = new Uint32Array(SCREEN_W * SCREEN_H);
  }

  /** Fill the whole buffer with a packed color. */
  clear(color: number): void {
    this.buf.fill(color);
  }

  /** Fill a vertical span of a column [y0, y1) with a solid color. */
  vspan(x: number, y0: number, y1: number, color: number): void {
    if (x < 0 || x >= SCREEN_W) return;
    const top = Math.max(0, y0 | 0);
    const bottom = Math.min(SCREEN_H, y1 | 0);
    for (let y = top; y < bottom; y++) {
      this.buf[y * SCREEN_W + x] = color;
    }
  }

  setPixel(x: number, y: number, color: number): void {
    if (x < 0 || x >= SCREEN_W || y < 0 || y >= SCREEN_H) return;
    this.buf[y * SCREEN_W + x] = color;
  }

  /** Copy the software buffer to the canvas. Canvas CSS scaling does the upscale. */
  present(): void {
    this.u32View.set(this.buf);
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  /** Size the canvas element on screen to the largest integer multiple that fits. */
  static fitCanvas(canvas: HTMLCanvasElement): void {
    const scaleX = Math.floor(window.innerWidth / SCREEN_W);
    const scaleY = Math.floor(window.innerHeight / SCREEN_H);
    const scale = Math.max(1, Math.min(scaleX, scaleY));
    canvas.style.width = `${SCREEN_W * scale}px`;
    canvas.style.height = `${SCREEN_H * scale}px`;
  }
}
