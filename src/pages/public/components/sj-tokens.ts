// ----------------------------------------------------------------------
// "Industry" design tokens — a blueprint/wireframe visual language for the
// public SeenJeem pages only. Scoped via sx/inline styles rather than the
// app-wide MUI theme, so it never leaks into dashboard/superadmin/auth.
// ----------------------------------------------------------------------

export const sjColor = {
  bg: '#f2f2f3',
  surface: '#e9e9ea',
  text: '#1d1f20',
  divider: 'rgba(29,31,32,0.16)',
  dividerDashed: 'rgba(29,31,32,0.24)',

  accent: '#5980a6',
  accent2: '#728fab',

  accent100: '#eef6ff',
  accent300: '#b5d9fd',
  accent400: '#94bce3',
  accent600: '#597ea3',
  accent700: '#416180',
  accent800: '#2c455d',
  accent900: '#1d2d3d',

  neutral500: '#98989b',
  neutral600: '#7a7a7d',
  neutral700: '#5d5d60',

  successBg: '#e6f2e8',
  successBorder: '#5d8f68',
  successText: '#254c2f',

  errorBg: '#fbecec',
  errorBorder: '#b06a6a',
  errorText: '#7d2727',
} as const;

export const sjFont = {
  heading: `'Barlow Condensed', system-ui, sans-serif`,
  body: `'Barlow', system-ui, sans-serif`,
  mono: `ui-monospace, Menlo, monospace`,
} as const;

// Font only — text-transform is applied per-element to match the source design
// (not every heading-font element is uppercase, e.g. button labels aren't).
export const sjHeadingSx = {
  fontFamily: sjFont.heading,
  fontWeight: 600,
};
