import type { ButtonProps } from '@mui/material/Button';

import { forwardRef } from 'react';

import Button from '@mui/material/Button';

import { sjColor, sjFont } from './sj-tokens';

// ----------------------------------------------------------------------

type SjVariant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<ButtonProps, 'variant' | 'color'> & {
  sjVariant?: SjVariant;
};

// Buttons from the Industry design system: square corners, Barlow Condensed
// label, three flat variants (solid accent / hairline outline / text-only).
export const SjButton = forwardRef<HTMLButtonElement, Props>(
  ({ sjVariant = 'secondary', sx, ...other }, ref) => (
    <Button
      ref={ref}
      disableElevation
      sx={[
        {
          fontFamily: sjFont.heading,
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 0,
          minHeight: 44,
          ...(sjVariant === 'primary' && {
            bgcolor: sjColor.accent,
            color: sjColor.bg,
            border: `1px solid ${sjColor.accent}`,
            '&:hover': { bgcolor: sjColor.accent600 },
            '&:active': { bgcolor: sjColor.accent700 },
            '&.Mui-disabled': { opacity: 0.45, color: sjColor.bg, bgcolor: sjColor.accent },
          }),
          ...(sjVariant === 'secondary' && {
            color: sjColor.text,
            border: '1px solid',
            borderColor: sjColor.divider,
            '&:hover': { bgcolor: 'rgba(29,31,32,0.07)', borderColor: sjColor.divider },
            '&:active': { bgcolor: 'rgba(29,31,32,0.14)' },
            '&.Mui-disabled': { opacity: 0.45, color: sjColor.text },
          }),
          ...(sjVariant === 'ghost' && {
            color: sjColor.accent,
            border: '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(89,128,166,0.1)' },
            '&:active': { bgcolor: 'rgba(89,128,166,0.18)' },
            '&.Mui-disabled': { opacity: 0.45, color: sjColor.accent },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  )
);
