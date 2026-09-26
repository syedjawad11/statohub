// Adsterra ad registry. Interim monetization while AdSense is unapproved —
// see docs/decisions/0025-adsterra-interim-monetization.md. Pure data: the
// DOM loader lives inline in BaseLayout.astro.

export type AdSize = '728x90' | '468x60' | '320x50' | '300x250' | '160x600' | '160x300';

export const ADSTERRA_INVOKE_BASE = 'https://www.highrevenueformat.com';

// Popunder: one page-level script. Frequency cap is set in the Adsterra dashboard.
// Remove before any AdSense resubmission (popunders violate AdSense policy).
export const ADSTERRA_POPUNDER_SRC =
  'https://pl31528907.profitableratecpmnetwork.com/76/00/f7/7600f7634a85b1fead33695e99dfcd63.js';

export const ADSTERRA_BANNER_KEYS: Record<AdSize, string> = {
  '728x90': '487666a725d5e38fcd0f7400cd6c487c',
  '468x60': 'c94b9ede8c25a4f3419b66e5b82b9732',
  '320x50': 'b2b1c9985209d652a445cda3e49f8006',
  '300x250': 'e625a13a2acd5199dcc7bb5505e66232',
  '160x600': '889ea7acebdd5f1fed958976182d2f28',
  '160x300': '152422c9d2c291d4b94d28e763d0a36b',
};

// Ordered largest-first; the loader picks the first size that fits the slot.
export const AD_SLOTS = {
  leaderboard: ['728x90', '468x60', '320x50'],
  rectangle: ['300x250'],
  skyscraper: ['160x600', '160x300'],
  halfSkyscraper: ['160x300'],
} as const satisfies Record<string, readonly AdSize[]>;

export type AdSlotName = keyof typeof AD_SLOTS;

export function parseAdSize(size: AdSize): { width: number; height: number } {
  const [width, height] = size.split('x').map(Number);
  return { width, height };
}

// Native banner: one per page (the script fills a fixed container id).
export const ADSTERRA_NATIVE = {
  src: 'https://pl31528908.profitableratecpmnetwork.com/1a02ee448a51d8410b6d85cf3712cd46/invoke.js',
  containerId: 'container-1a02ee448a51d8410b6d85cf3712cd46',
} as const;
