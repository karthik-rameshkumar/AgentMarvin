// Episode 1 — "Lost Sessions" (docs/06). M1 runs the whole episode as one
// connected map, so the campaign layer is light: it holds the end-of-slice reveal
// text that maps the fiction to real Entire (docs/07). Level geometry + ghost logs
// live in public/maps/episode1-lost-sessions.json.

/** The final-reveal mapping shown when the Gate closes (docs/07). */
export const REVEAL_LINES: string[] = [
  'Session Replayer   →   Sessions',
  'Context Scanner    →   Context',
  'Evidence + Gate    →   production decisions',
  '',
  'You were learning Entire the whole time.',
];
