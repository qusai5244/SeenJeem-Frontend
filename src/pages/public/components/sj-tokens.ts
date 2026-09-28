// ----------------------------------------------------------------------
// SeenJeem design tokens — the "Spotlight" (dark, default) / "Daylight" (light)
// marquee identity, generated from the SeenJeem design system
// (https://claude.ai/artifact/55RJG1pYzV5k1nFHKTjVd7 — project/tokens.json).
//
// Scoped via CSS custom properties on a `.sj-root[data-sj-theme]` wrapper
// (see PublicLayout) rather than the app-wide MUI theme, so it never leaks
// into dashboard/superadmin/auth.
// ----------------------------------------------------------------------

type ColorToken = string | { dark: string; light: string };

const colorTokens: Record<string, ColorToken> = {
  'surface-000': { dark: '#0F1220', light: '#FAF7F0' },
  'surface-100': { dark: '#161B30', light: '#FFFFFF' },
  'surface-200': { dark: '#1F2540', light: '#F2EEE3' },
  'surface-300': { dark: '#2A3152', light: '#E8E2D2' },
  ink: { dark: '#F6F4FF', light: '#1A1B2E' },
  'ink-muted': { dark: '#ACB0D1', light: '#565A78' },
  'ink-faint': { dark: '#6E7396', light: '#8A8DA8' },
  hairline: { dark: '#333A5C', light: '#E1DAC8' },
  'control-border': { dark: '#7079B8', light: '#8B8158' },
  brand: '#FFB627',
  'brand-ink': '#241800',
  'brand-strong': '#E89F12',
  accent: '#5B4FE0',
  'accent-ink': '#FFFFFF',
  'accent-strong': '#4A3FC7',
  link: { dark: '#B9B3FF', light: '#5B52E5' },
  focus: { dark: '#FFCB6B', light: '#B5790A' },
  'team-a': '#FF6B57',
  'team-a-ink': '#3A0D04',
  'team-b': '#2FD9C2',
  'team-b-ink': '#04322C',
  success: '#33D17E',
  'success-ink': '#04321A',
  warning: '#FFA53D',
  'warning-ink': '#341800',
  danger: '#FF5C7A',
  'danger-ink': '#3A0313',
  scrim: { dark: 'rgba(6,7,16,0.72)', light: 'rgba(26,27,46,0.55)' },
};

const shadowTokens: Record<string, { dark: string; light: string }> = {
  'shadow-sm': { dark: '0 1px 2px rgba(4,5,12,0.4)', light: '0 1px 2px rgba(26,27,46,0.08)' },
  'shadow-md': { dark: '0 12px 28px rgba(4,5,12,0.55)', light: '0 12px 28px rgba(26,27,46,0.14)' },
  'shadow-glow-brand': {
    dark: '0 0 0 1px rgba(255,182,39,0.4), 0 0 24px rgba(255,182,39,0.35)',
    light: '0 0 0 1px rgba(255,182,39,0.55), 0 0 16px rgba(255,182,39,0.28)',
  },
  'shadow-glow-team-a': {
    dark: '0 0 0 1px rgba(255,107,87,0.5), 0 0 20px rgba(255,107,87,0.35)',
    light: '0 0 0 1px rgba(255,107,87,0.6), 0 0 14px rgba(255,107,87,0.25)',
  },
  'shadow-glow-team-b': {
    dark: '0 0 0 1px rgba(47,217,194,0.5), 0 0 20px rgba(47,217,194,0.35)',
    light: '0 0 0 1px rgba(47,217,194,0.6), 0 0 14px rgba(47,217,194,0.25)',
  },
};

const staticTokens: Record<string, string> = {
  'space-1': '4px',
  'space-2': '8px',
  'space-3': '12px',
  'space-4': '16px',
  'space-5': '20px',
  'space-6': '24px',
  'space-7': '32px',
  'space-8': '40px',
  'space-9': '48px',
  'space-10': '64px',
  'space-11': '96px',
  'radius-xs': '6px',
  'radius-sm': '10px',
  'radius-md': '14px',
  'radius-lg': '20px',
  'radius-xl': '28px',
  'radius-pill': '999px',
  'opacity-disabled': '0.42',
  'opacity-hover': '0.92',
  'opacity-pressed': '0.84',
};

/** Builds the CSS block that defines every token as a custom property, scoped
 * under `${scopeSelector}[data-sj-theme="dark"|"light"]`, plus the keyframes
 * and reduced-motion overrides shared components rely on. Mount once via a
 * plain `<style>` tag in PublicLayout.
 *
 * IMPORTANT: `scopeSelector` must resolve to an ancestor of *every* DOM node
 * that reads these tokens — including ones MUI portals straight to
 * `document.body` (Dialog, Popover, Menu, Tooltip...), which sit outside any
 * inner wrapper element. `:root` (with the `data-sj-theme` attribute placed
 * on `<html>`) is the only selector that satisfies that for portaled content. */
export function sjGlobalCss(scopeSelector = ':root'): string {
  const dark: string[] = [];
  const light: string[] = [];

  Object.entries(colorTokens).forEach(([name, value]) => {
    if (typeof value === 'string') {
      dark.push(`--${name}: ${value};`);
      light.push(`--${name}: ${value};`);
    } else {
      dark.push(`--${name}: ${value.dark};`);
      light.push(`--${name}: ${value.light};`);
    }
  });

  Object.entries(shadowTokens).forEach(([name, value]) => {
    dark.push(`--${name}: ${value.dark};`);
    light.push(`--${name}: ${value.light};`);
  });

  const staticCss = Object.entries(staticTokens)
    .map(([name, value]) => `--${name}: ${value};`)
    .join('\n');

  return `
${scopeSelector} {
  ${staticCss}
  color-scheme: light dark;
}
${scopeSelector}[data-sj-theme="dark"] { ${dark.join('\n  ')} color-scheme: dark; }
${scopeSelector}[data-sj-theme="light"] { ${light.join('\n  ')} color-scheme: light; }

@keyframes sj-spin { to { transform: rotate(360deg); } }
@keyframes sj-pulse-bg { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
@keyframes sj-warn-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes sj-blink { 50% { opacity: 0.3; } }
@keyframes sj-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes sj-confetti-fall {
  0% { opacity: 0; transform: translateY(-14px) rotate(0deg); }
  12% { opacity: 1; }
  100% { opacity: 0; transform: translateY(70px) rotate(55deg); }
}

@media (prefers-reduced-motion: reduce) {
  ${scopeSelector} *, ${scopeSelector} *::before, ${scopeSelector} *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 120ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}

/** Convenience `var(--token)` refs — use anywhere a CSS var string is valid
 * (sx color/background/boxShadow/padding values, plain style props). */
export const sj = {
  surface0: 'var(--surface-000)',
  surface100: 'var(--surface-100)',
  surface200: 'var(--surface-200)',
  surface300: 'var(--surface-300)',
  ink: 'var(--ink)',
  inkMuted: 'var(--ink-muted)',
  inkFaint: 'var(--ink-faint)',
  hairline: 'var(--hairline)',
  controlBorder: 'var(--control-border)',
  brand: 'var(--brand)',
  brandInk: 'var(--brand-ink)',
  brandStrong: 'var(--brand-strong)',
  accent: 'var(--accent)',
  accentInk: 'var(--accent-ink)',
  accentStrong: 'var(--accent-strong)',
  link: 'var(--link)',
  focus: 'var(--focus)',
  teamA: 'var(--team-a)',
  teamAInk: 'var(--team-a-ink)',
  teamB: 'var(--team-b)',
  teamBInk: 'var(--team-b-ink)',
  success: 'var(--success)',
  successInk: 'var(--success-ink)',
  warning: 'var(--warning)',
  warningInk: 'var(--warning-ink)',
  danger: 'var(--danger)',
  dangerInk: 'var(--danger-ink)',
  scrim: 'var(--scrim)',

  space1: 'var(--space-1)',
  space2: 'var(--space-2)',
  space3: 'var(--space-3)',
  space4: 'var(--space-4)',
  space5: 'var(--space-5)',
  space6: 'var(--space-6)',
  space7: 'var(--space-7)',
  space8: 'var(--space-8)',
  space9: 'var(--space-9)',
  space10: 'var(--space-10)',
  space11: 'var(--space-11)',

  radiusXs: 'var(--radius-xs)',
  radiusSm: 'var(--radius-sm)',
  radiusMd: 'var(--radius-md)',
  radiusLg: 'var(--radius-lg)',
  radiusXl: 'var(--radius-xl)',
  radiusPill: 'var(--radius-pill)',

  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowGlowBrand: 'var(--shadow-glow-brand)',
  shadowGlowTeamA: 'var(--shadow-glow-team-a)',
  shadowGlowTeamB: 'var(--shadow-glow-team-b)',

  opacityHover: 'var(--opacity-hover)',
  opacityPressed: 'var(--opacity-pressed)',
  opacityDisabled: 'var(--opacity-disabled)',
} as const;

export const sjFont = {
  display: `'Space Grotesk', 'Segoe UI', system-ui, sans-serif`,
  body: `'Manrope', 'Segoe UI', system-ui, sans-serif`,
} as const;

export const sjText = {
  displayXl: { fontFamily: sjFont.display, fontSize: '42px', lineHeight: '44px', fontWeight: 700 },
  displayLg: { fontFamily: sjFont.display, fontSize: '36px', lineHeight: '40px', fontWeight: 700 },
  displayMd: { fontFamily: sjFont.display, fontSize: '24px', lineHeight: '29px', fontWeight: 700 },
  scoreLg: { fontFamily: sjFont.display, fontSize: '34px', lineHeight: '34px', fontWeight: 700 },
  pointValue: { fontFamily: sjFont.display, fontSize: '22px', lineHeight: '22px', fontWeight: 700 },
  bodyLg: { fontFamily: sjFont.body, fontSize: '17px', lineHeight: '26px', fontWeight: 500 },
  body: { fontFamily: sjFont.body, fontSize: '15px', lineHeight: '23px', fontWeight: 400 },
  bodySm: { fontFamily: sjFont.body, fontSize: '13px', lineHeight: '19px', fontWeight: 500 },
  label: {
    fontFamily: sjFont.body,
    fontSize: '13px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  },
  caption: { fontFamily: sjFont.body, fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
} as const;

export type TeamTone = 'a' | 'b';

export function teamToneVars(tone: TeamTone) {
  return tone === 'a'
    ? { main: sj.teamA, ink: sj.teamAInk, glow: sj.shadowGlowTeamA }
    : { main: sj.teamB, ink: sj.teamBInk, glow: sj.shadowGlowTeamB };
}
