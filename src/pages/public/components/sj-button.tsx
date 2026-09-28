import type { ButtonProps } from '@mui/material/Button';

import { forwardRef } from 'react';

import Button from '@mui/material/Button';

import { sj, sjFont } from './sj-tokens';

// ----------------------------------------------------------------------
// Button — one `brand` Primary per screen, `accent` Secondary for the next
// most important action, Outline for a paired lower-emphasis action, Ghost
// for the lowest-emphasis action, Danger inside a destructive confirmation.
// See project/components/Button/README.md.
// ----------------------------------------------------------------------

type SjVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type SjSize = 'default' | 'large';

type Props = Omit<ButtonProps, 'variant' | 'color' | 'size'> & {
  sjVariant?: SjVariant;
  sjSize?: SjSize;
};

export const SjButton = forwardRef<HTMLButtonElement, Props>(
  ({ sjVariant = 'secondary', sjSize = 'default', sx, ...other }, ref) => (
    <Button
      ref={ref}
      disableElevation
      disableRipple
      sx={[
        {
          fontFamily: sjFont.body,
          fontWeight: 700,
          fontSize: sjSize === 'large' ? 15 : 13,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          borderRadius: sjSize === 'large' ? sj.radiusLg : sj.radiusMd,
          padding: sjSize === 'large' ? `${sj.space4} ${sj.space7}` : `${sj.space3} ${sj.space5}`,
          minWidth: 0,
          minHeight: 'auto',
          lineHeight: 1.2,
          gap: sj.space2,
          transition: 'filter 0.12s ease, transform 0.08s ease, background-color 0.12s ease',
          '&:active': { transform: 'translateY(1px)' },
          '&:focus-visible': { outline: `2px solid ${sj.focus}`, outlineOffset: '2px' },
          ...(sjVariant === 'primary' && {
            backgroundColor: sj.brand,
            color: sj.brandInk,
            '&:hover': { backgroundColor: sj.brand, filter: 'brightness(0.96)' },
            '&:active': { backgroundColor: sj.brandStrong, transform: 'translateY(1px)' },
            '&.Mui-disabled': {
              backgroundColor: sj.brand,
              color: sj.brandInk,
              opacity: sj.opacityDisabled,
            },
          }),
          ...(sjVariant === 'secondary' && {
            backgroundColor: sj.accent,
            color: sj.accentInk,
            '&:hover': { backgroundColor: sj.accent, filter: 'brightness(1.08)' },
            '&:active': { backgroundColor: sj.accentStrong },
            '&.Mui-disabled': {
              backgroundColor: sj.accent,
              color: sj.accentInk,
              opacity: sj.opacityDisabled,
            },
          }),
          ...(sjVariant === 'outline' && {
            backgroundColor: 'transparent',
            color: sj.ink,
            boxShadow: `inset 0 0 0 1.5px ${sj.controlBorder}`,
            '&:hover': { backgroundColor: sj.surface200 },
            '&:active': { backgroundColor: sj.surface300 },
            '&.Mui-disabled': { color: sj.ink, opacity: sj.opacityDisabled },
          }),
          ...(sjVariant === 'ghost' && {
            backgroundColor: 'transparent',
            color: sj.link,
            paddingLeft: sj.space2,
            paddingRight: sj.space2,
            '&:hover': { backgroundColor: sj.surface200 },
            '&.Mui-disabled': { color: sj.link, opacity: sj.opacityDisabled },
          }),
          ...(sjVariant === 'danger' && {
            backgroundColor: sj.danger,
            color: sj.dangerInk,
            '&:hover': { backgroundColor: sj.danger, filter: 'brightness(1.05)' },
            '&.Mui-disabled': {
              backgroundColor: sj.danger,
              color: sj.dangerInk,
              opacity: sj.opacityDisabled,
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  )
);
