import type { SxProps, Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { sj, sjText } from './sj-tokens';
import { IconCheck } from './icons';

// ----------------------------------------------------------------------
// Card — the category/subcategory selectable card, and a plain content
// card shell (rules steps, question-bank rows). See project/components/Card/README.md.
// ----------------------------------------------------------------------

type SelectableCardProps = {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  size?: 'default' | 'small';
  onClick?: () => void;
};

export function SelectableCard({
  title,
  icon,
  badge,
  selected,
  disabled,
  size = 'default',
  onClick,
}: SelectableCardProps) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'block',
        textAlign: 'left',
        width: 1,
        border: 0,
        margin: 0,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: size === 'small' ? sj.space4 : sj.space5,
        borderRadius: sj.radiusLg,
        backgroundColor: sj.surface200,
        color: sj.ink,
        boxShadow: selected ? `0 0 0 2px ${sj.accent}` : `inset 0 0 0 1.5px ${sj.controlBorder}`,
        opacity: disabled ? sj.opacityDisabled : 1,
        transition: 'box-shadow 0.12s ease, background-color 0.12s ease',
        '&:hover': disabled ? undefined : { backgroundColor: sj.surface300 },
        '&:focus-visible': { outline: `2px solid ${sj.focus}`, outlineOffset: '2px' },
      }}
    >
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: sj.space4,
            right: sj.space4,
            width: 22,
            height: 22,
            borderRadius: '999px',
            backgroundColor: sj.accent,
            color: sj.accentInk,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconCheck size={13} strokeWidth={3.5} />
        </Box>
      )}
      {icon && (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: sj.radiusMd,
            backgroundColor: sj.surface300,
            color: sj.brand,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: sj.space4,
          }}
        >
          {icon}
        </Box>
      )}
      <Box
        component="span"
        sx={{
          ...sjText.displayMd,
          display: 'block',
          fontSize: size === 'small' ? '15px' : '24px',
          lineHeight: size === 'small' ? '19px' : '29px',
          mb: badge ? sj.space3 : 0,
        }}
      >
        {title}
      </Box>
      {badge}
    </Box>
  );
}

export function ContentCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={[
        {
          backgroundColor: sj.surface200,
          borderRadius: sj.radiusLg,
          boxShadow: `inset 0 0 0 1.5px ${sj.controlBorder}`,
          padding: sj.space5,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
