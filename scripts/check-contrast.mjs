import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const MIN_CONTRAST = 4.5;

const checks = [
  { theme: 'light', text: '--ink-3', background: '--paper' },
  { theme: 'light', text: '--ink-3', background: '--card' },
  { theme: 'dark', text: '--ink-3', background: '--card' },
  { theme: 'light', text: '--brass', background: '--paper' },
  { theme: 'light', text: '--brass', background: '--card' },
];

function blockFor(theme) {
  const selector = theme === 'dark' ? 'html.dark' : ':root';
  const escapedSelector = selector.replace('.', '\\.');
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm'));
  if (!match) throw new Error(`Could not find ${selector} token block in src/styles/global.css`);
  return match[1];
}

function tokensFor(theme) {
  const tokens = new Map();
  for (const match of blockFor(theme).matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens.set(match[1], match[2].toUpperCase());
  }
  return tokens;
}

function srgbChannelToLinear(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return 0.2126 * srgbChannelToLinear(r) + 0.7152 * srgbChannelToLinear(g) + 0.0722 * srgbChannelToLinear(b);
}

function contrastRatio(foreground, background) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

const byTheme = {
  light: tokensFor('light'),
  dark: tokensFor('dark'),
};

const failures = [];

for (const check of checks) {
  const tokens = byTheme[check.theme];
  const textHex = tokens.get(check.text);
  const backgroundHex = tokens.get(check.background);
  if (!textHex || !backgroundHex) {
    failures.push(`${check.theme} ${check.text} on ${check.background}: missing token value`);
    continue;
  }

  const ratio = contrastRatio(textHex, backgroundHex);
  const line = `${check.theme} ${check.text} ${textHex} on ${check.background} ${backgroundHex}: ${ratio.toFixed(2)}:1`;
  if (ratio < MIN_CONTRAST) {
    failures.push(`${line} FAILS WCAG AA normal text minimum ${MIN_CONTRAST}:1`);
  } else {
    console.log(`${line} passes`);
  }
}

if (failures.length > 0) {
  console.error('Contrast check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
