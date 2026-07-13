// Keyboard + mouse input for AgentMarvin M0.
// Movement is Pointer-Lock mouse-look + WASD/arrows. Bindings are a map so they
// can be remapped later (docs/08 accessibility: remappable controls).

export type Action = 'forward' | 'back' | 'left' | 'right' | 'interact';

const DEFAULT_BINDINGS: Record<string, Action> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  KeyE: 'interact',
};

export class Input {
  private held = new Set<Action>();
  private bindings: Record<string, Action>;
  private pressedThisFrame = new Set<Action>();
  /** Accumulated mouse-X delta (radians of yaw) since the last consume. */
  private mouseDx = 0;
  private locked = false;

  /** Mouse sensitivity: radians of yaw per pixel of movement. */
  sensitivity = 0.0022;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    bindings: Record<string, Action> = DEFAULT_BINDINGS,
  ) {
    this.bindings = bindings;
  }

  /** Callback fired the first time the pointer is locked (used to unblock audio). */
  onFirstLock: (() => void) | null = null;
  private hasLockedOnce = false;

  attach(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.canvas.addEventListener('click', this.requestLock);
    document.addEventListener('pointerlockchange', this.onLockChange);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  detach(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeEventListener('click', this.requestLock);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  isDown(action: Action): boolean {
    return this.held.has(action);
  }

  /** True once per press; consumed on read (edge trigger, e.g. door interact). */
  wasPressed(action: Action): boolean {
    if (this.pressedThisFrame.has(action)) {
      this.pressedThisFrame.delete(action);
      return true;
    }
    return false;
  }

  get isLocked(): boolean {
    return this.locked;
  }

  /** Consume and return accumulated mouse yaw delta since last call. */
  consumeMouseDx(): number {
    const dx = this.mouseDx;
    this.mouseDx = 0;
    return dx;
  }

  private requestLock = (): void => {
    void this.canvas.requestPointerLock();
  };

  private onLockChange = (): void => {
    this.locked = document.pointerLockElement === this.canvas;
    if (this.locked && !this.hasLockedOnce) {
      this.hasLockedOnce = true;
      this.onFirstLock?.();
    }
    if (!this.locked) {
      // Dropping lock releases all keys so we don't get stuck moving.
      this.held.clear();
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked) return;
    this.mouseDx += e.movementX * this.sensitivity;
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const action = this.bindings[e.code];
    if (!action) return;
    if (!this.held.has(action)) this.pressedThisFrame.add(action);
    this.held.add(action);
    e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    const action = this.bindings[e.code];
    if (!action) return;
    this.held.delete(action);
    e.preventDefault();
  };
}
