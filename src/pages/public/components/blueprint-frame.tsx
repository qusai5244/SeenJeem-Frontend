import type { SxProps, Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const cornerBase = {
  position: 'absolute' as const,
  width: 11,
  height: 11,
  pointerEvents: 'none' as const,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 5,
    top: 0,
    width: '1px',
    height: '100%',
    bgcolor: 'currentColor',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 5,
    left: 0,
    width: '100%',
    height: '1px',
    bgcolor: 'currentColor',
  },
};

const cornerPositions = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

// Loosely typed on purpose: this wraps Box polymorphically (component="button"
// with disabled/type/onClick, component="section", plain div, ...) and MUI's
// own OverridableComponent typing doesn't propagate through a custom wrapper
// without a lot of generic ceremony for a purely-presentational component.
type Props = {
  component?: React.ElementType;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  cornerColor?: string;
  noBorder?: boolean;
} & Record<string, unknown>;

// The "blueprint" corner-bracket frame used throughout the Industry design
// system — a hairline border with small L-shaped registration marks at each
// corner. Wrap any block-level content in it.
export function BlueprintFrame({ children, cornerColor, noBorder, sx, ...other }: Props) {
  return (
    <Box
      sx={[
        {
          position: 'relative',
          ...(noBorder ? {} : { border: '1px solid', borderColor: 'rgba(29,31,32,0.16)' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {(Object.keys(cornerPositions) as Array<keyof typeof cornerPositions>).map((key) => (
        <Box
          key={key}
          sx={{ ...cornerBase, ...cornerPositions[key], color: cornerColor ?? 'rgba(29,31,32,0.55)' }}
        />
      ))}
      {children}
    </Box>
  );
}
