// Gate console (docs/02 §5) — the DOM panel where Marvin docks evidence and makes
// a binding production decision. Opening it releases pointer lock so the buttons
// are clickable; game.ts re-locks on close.

import type { GateDecision } from '../world/types';

export class GateUI {
  private root: HTMLDivElement;
  private evidenceLine: HTMLDivElement;
  private open = false;
  private onDecision: ((d: GateDecision) => void) | null = null;

  constructor(mount: HTMLElement = document.body) {
    this.root = document.createElement('div');
    this.root.className = 'gate hidden';
    this.root.innerHTML = `
      <div class="gate-panel">
        <div class="gate-title">PRODUCTION GATE</div>
        <div class="gate-sub">Enforce a production decision. Evidence backs your call.</div>
        <div class="gate-evidence"></div>
        <div class="gate-buttons">
          <button data-decision="promote">PROMOTE</button>
          <button data-decision="reject">REJECT</button>
          <button data-decision="hold">HOLD</button>
        </div>
        <div class="gate-hint">Promote with zero evidence is a YOLO merge.</div>
      </div>`;
    mount.appendChild(this.root);
    this.evidenceLine = this.root.querySelector('.gate-evidence') as HTMLDivElement;

    this.root.querySelectorAll<HTMLButtonElement>('button[data-decision]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = btn.dataset['decision'] as GateDecision;
        this.onDecision?.(d);
      });
    });
  }

  get isOpen(): boolean {
    return this.open;
  }

  show(evidenceCount: number, required: number, onDecision: (d: GateDecision) => void): void {
    this.onDecision = onDecision;
    this.evidenceLine.textContent = `Evidence docked: ${evidenceCount}  (recommended: ${required})`;
    this.root.classList.remove('hidden');
    this.open = true;
  }

  hide(): void {
    this.root.classList.add('hidden');
    this.open = false;
    this.onDecision = null;
  }
}
