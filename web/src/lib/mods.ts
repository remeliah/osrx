export const MOD_BITS: Record<string, number> = {
  NF: 1 << 0,
  EZ: 1 << 1,
  NV: 1 << 2, // No Video (deprecated)
  HD: 1 << 3,
  HR: 1 << 4,
  SD: 1 << 5,
  DT: 1 << 6,
  RX: 1 << 7,
  HT: 1 << 8,
  NC: 1 << 9,
  FL: 1 << 10,
  AT: 1 << 11, // Autoplay
  SO: 1 << 12,
  AP: 1 << 13,
  PF: 1 << 14,
  K4: 1 << 15,
  K5: 1 << 16,
  K6: 1 << 17,
  K7: 1 << 18,
  K8: 1 << 19,
  FI: 1 << 20,
  RD: 1 << 21,
  CN: 1 << 22,
  TD: 1 << 23,
  K9: 1 << 24,
  K1: 1 << 26,
  K3: 1 << 27,
  K2: 1 << 28,
  V2: 1 << 29,
  MR: 1 << 30,
};

export type Ruleset = 'osu' | 'taiko' | 'catch' | 'mania';

export interface LazerMod {
  acronym: string;
  name: string;
  modes: Ruleset[];
  category: 'reduction' | 'increase' | 'automation' | 'conversion' | 'fun';
}

const ALL: Ruleset[] = ['osu', 'taiko', 'catch', 'mania'];

export const LAZER_MODS: LazerMod[] = [
  { acronym: 'EZ', name: 'Easy', modes: ALL, category: 'reduction' },
  { acronym: 'NF', name: 'No Fail', modes: ALL, category: 'reduction' },
  { acronym: 'HT', name: 'Half Time', modes: ALL, category: 'reduction' },
  { acronym: 'DC', name: 'Daycore', modes: ALL, category: 'reduction' },
  { acronym: 'NR', name: 'No Release', modes: ['mania'], category: 'reduction' },

  { acronym: 'HR', name: 'Hard Rock', modes: ALL, category: 'increase' },
  { acronym: 'SD', name: 'Sudden Death', modes: ALL, category: 'increase' },
  { acronym: 'PF', name: 'Perfect', modes: ALL, category: 'increase' },
  { acronym: 'DT', name: 'Double Time', modes: ALL, category: 'increase' },
  { acronym: 'NC', name: 'Nightcore', modes: ALL, category: 'increase' },
  { acronym: 'FI', name: 'Fade In', modes: ['mania'], category: 'increase' },
  { acronym: 'HD', name: 'Hidden', modes: ALL, category: 'increase' },
  { acronym: 'CO', name: 'Cover', modes: ['mania'], category: 'increase' },
  { acronym: 'FL', name: 'Flashlight', modes: ALL, category: 'increase' },
  { acronym: 'BL', name: 'Blinds', modes: ['osu'], category: 'increase' },
  { acronym: 'ST', name: 'Strict Tracking', modes: ['osu'], category: 'increase' },
  { acronym: 'AC', name: 'Accuracy Challenge', modes: ALL, category: 'increase' },

  { acronym: 'AT', name: 'Autoplay', modes: ALL, category: 'automation' },
  { acronym: 'CN', name: 'Cinema', modes: ALL, category: 'automation' },
  { acronym: 'RX', name: 'Relax', modes: ['osu', 'taiko', 'catch'], category: 'automation' },
  { acronym: 'AP', name: 'Autopilot', modes: ['osu'], category: 'automation' },
  { acronym: 'SO', name: 'Spun Out', modes: ['osu'], category: 'automation' },

  { acronym: 'TP', name: 'Target Practice', modes: ['osu'], category: 'conversion' },
  { acronym: 'DA', name: 'Difficulty Adjust', modes: ALL, category: 'conversion' },
  { acronym: 'CL', name: 'Classic', modes: ['osu', 'taiko'], category: 'conversion' },
  { acronym: 'RD', name: 'Random', modes: ['osu', 'mania'], category: 'conversion' },
  { acronym: 'MR', name: 'Mirror', modes: ALL, category: 'conversion' },
  { acronym: 'AL', name: 'Alternate', modes: ['osu'], category: 'conversion' },
  { acronym: 'SW', name: 'Swap', modes: ['taiko'], category: 'conversion' },
  { acronym: 'SG', name: 'Single Tap', modes: ['osu', 'taiko'], category: 'conversion' },
  { acronym: 'IN', name: 'Invert', modes: ['mania'], category: 'conversion' },
  { acronym: 'CS', name: 'Constant Speed', modes: ['taiko', 'mania'], category: 'conversion' },
  { acronym: 'HO', name: 'Hold Off', modes: ['mania'], category: 'conversion' },
  { acronym: '1K', name: '1K', modes: ['mania'], category: 'conversion' },
  { acronym: '2K', name: '2K', modes: ['mania'], category: 'conversion' },
  { acronym: '3K', name: '3K', modes: ['mania'], category: 'conversion' },
  { acronym: '4K', name: '4K', modes: ['mania'], category: 'conversion' },
  { acronym: '5K', name: '5K', modes: ['mania'], category: 'conversion' },
  { acronym: '6K', name: '6K', modes: ['mania'], category: 'conversion' },
  { acronym: '7K', name: '7K', modes: ['mania'], category: 'conversion' },
  { acronym: '8K', name: '8K', modes: ['mania'], category: 'conversion' },
  { acronym: '9K', name: '9K', modes: ['mania'], category: 'conversion' },
  { acronym: '10K', name: '10K', modes: ['mania'], category: 'conversion' },

  { acronym: 'TR', name: 'Transform', modes: ['osu'], category: 'fun' },
  { acronym: 'WG', name: 'Wiggle', modes: ['osu'], category: 'fun' },
  { acronym: 'SI', name: 'Spin In', modes: ['osu'], category: 'fun' },
  { acronym: 'GR', name: 'Grow', modes: ['osu'], category: 'fun' },
  { acronym: 'DF', name: 'Deflate', modes: ['osu'], category: 'fun' },
  { acronym: 'WU', name: 'Wind Up', modes: ALL, category: 'fun' },
  { acronym: 'WD', name: 'Wind Down', modes: ALL, category: 'fun' },
  { acronym: 'TC', name: 'Traceable', modes: ['osu', 'taiko'], category: 'fun' },
  { acronym: 'BR', name: 'Barrel Roll', modes: ['osu'], category: 'fun' },
  { acronym: 'AD', name: 'Approach Different', modes: ['osu'], category: 'fun' },
  { acronym: 'FF', name: 'Floating Fruits', modes: ['catch'], category: 'fun' },
  { acronym: 'MU', name: 'Muted', modes: ALL, category: 'fun' },
  { acronym: 'NS', name: 'No Scope', modes: ['osu', 'catch'], category: 'fun' },
  { acronym: 'MG', name: 'Magnetised', modes: ['osu'], category: 'fun' },
  { acronym: 'RP', name: 'Repel', modes: ['osu'], category: 'fun' },
  { acronym: 'AS', name: 'Adaptive Speed', modes: ['osu', 'taiko'], category: 'fun' },
  { acronym: 'FR', name: 'Freeze Frame', modes: ['osu'], category: 'fun' },
  { acronym: 'BU', name: 'Bubbles', modes: ['osu'], category: 'fun' },
  { acronym: 'SY', name: 'Synesthesia', modes: ['osu'], category: 'fun' },
  { acronym: 'DP', name: 'Depth', modes: ['osu'], category: 'fun' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  reduction: 'Difficulty Reduction',
  increase: 'Difficulty Increase',
  automation: 'Automation',
  conversion: 'Conversion',
  fun: 'Fun',
};

export interface ModGroup {
  label: string;
  mods: string[];
}

export const MOD_GROUPS: ModGroup[] = [
  { label: 'Difficulty Reduction', mods: ['EZ', 'HT', 'NF'] },
  { label: 'Difficulty Increase', mods: ['HR', 'HD', 'FL', 'DT', 'NC', 'SD', 'PF', 'FI'] },
  { label: 'Automation', mods: ['AT', 'CN', 'RX', 'AP', 'SO'] },
  { label: 'mania keys', mods: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9'] },
  { label: 'Other', mods: ['MR', 'RD', 'TD', 'NV', 'V2'] },
];

export const MOD_LABELS: Record<string, string> = {
  NF: 'NF',
  EZ: 'EZ',
  NV: 'NV',
  HD: 'HD',
  HR: 'HR',
  SD: 'SD',
  DT: 'DT',
  RX: 'RX',
  HT: 'HT',
  NC: 'NC',
  FL: 'FL',
  AT: 'AT',
  SO: 'SO',
  AP: 'AP',
  PF: 'PF',
  K4: '4K',
  K5: '5K',
  K6: '6K',
  K7: '7K',
  K8: '8K',
  FI: 'FI',
  RD: 'RD',
  CN: 'CN',
  TD: 'TD',
  K9: '9K',
  K1: '1K',
  K3: '3K',
  K2: '2K',
  V2: 'V2',
  MR: 'MR',
};

const MOD_ICON_MAP: Record<string, string> = {
  NF: 'no-fail',
  EZ: 'easy',
  HD: 'hidden',
  HR: 'hard-rock',
  SD: 'sudden-death',
  DT: 'double-time',
  RX: 'relax',
  HT: 'half-time',
  NC: 'nightcore',
  FL: 'flashlight',
  AT: 'autoplay',
  SO: 'spun-out',
  AP: 'autopilot',
  PF: 'perfect',
  FI: 'fade-in',
  RD: 'random',
  CN: 'cinema',
  MR: 'mirror',
  K1: 'one-key',
  K2: 'two-keys',
  K3: 'three-keys',
  K4: 'four-keys',
  K5: 'five-keys',
  K6: 'six-keys',
  K7: 'seven-keys',
  K8: 'eight-keys',
  K9: 'nine-keys',
  K10: 'ten-keys',
  TR: 'transform',
  WG: 'wiggle',
  SI: 'spin-in',
  GR: 'grow',
  DF: 'deflate',
  WU: 'wind-up',
  WD: 'wind-down',
  TC: 'traceable',
  BR: 'barrel-roll',
  AD: 'approach-different',
  FF: 'floating-fruits',
  MU: 'muted',
  NS: 'no-scope',
  MG: 'magnetised',
  RP: 'repel',
  AS: 'adaptive-speed',
  FR: 'freeze-frame',
  BU: 'bubbles',
  SY: 'synesthesia',
  DP: 'depth',
  BM: 'bloom',
  SR: 'simplified-rhythm',
  TP: 'target-practice',
  DA: 'difficulty-adjust',
  CL: 'classic',
  AL: 'alternate',
  SW: 'swap',
  SG: 'single-tap',
  IN: 'invert',
  CS: 'constant-speed',
  HO: 'hold-off',
  CO: 'cover',
  AC: 'accuracy-challenge',
  BL: 'blinds',
  ST: 'strict-tracking',
  NR: 'no-release',
  '1K': 'one-key',
  '2K': 'two-keys',
  '3K': 'three-keys',
  '4K': 'four-keys',
  '5K': 'five-keys',
  '6K': 'six-keys',
  '7K': 'seven-keys',
  '8K': 'eight-keys',
  '9K': 'nine-keys',
  '10K': 'ten-keys',
  DC: 'daycore',
};

export function modIcon(acronym: string): string | null {
  const slug = MOD_ICON_MAP[acronym];
  return slug ? `/mods/mod-${slug}.svg` : null;
}

export function hasMod(mods: number, name: string): boolean {
  return (mods & (MOD_BITS[name] ?? 0)) !== 0;
}

export function toggleMod(mods: number, name: string): number {
  return mods ^ (MOD_BITS[name] ?? 0);
}

export function modsString(mods: number): string {
  if (mods === 0) return 'NM';
  return Object.entries(MOD_BITS)
    .filter(([, bit]) => (mods & bit) !== 0)
    .map(([name]) => name)
    .join('');
}

export function lazerModsForMode(mode: number): LazerMod[] {
  const r = (['osu', 'taiko', 'catch', 'mania'] as Ruleset[])[mode] ?? 'osu';
  return LAZER_MODS.filter((m) => m.modes.length === 4 || m.modes.includes(r));
}
