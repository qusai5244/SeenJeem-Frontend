import Box from '@mui/material/Box';

import { sj, sjText, teamToneVars } from './sj-tokens';
import { IconCheck } from './icons';
import type { TeamTone } from './sj-tokens';

// ----------------------------------------------------------------------
// BoardCell — the 16 marquee tiles of the board.
// See project/components/BoardCell/README.md.
// ----------------------------------------------------------------------

type Props = {
  mark: number;
  solvedTone?: TeamTone | null;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function BoardCell({ mark, solvedTone = null, loading, disabled, onClick }: Props) {
  if (loading) {
    return (
      <Box
        sx={{
          aspectRatio: '1',
          width: 1,
          borderRadius: sj.radiusXl,
          background: `linear-gradient(90deg, ${sj.surface200} 25%, ${sj.surface300} 37%, ${sj.surface200} 63%)`,
          backgroundSize: '400% 100%',
          animation: 'sj-pulse-bg 1.6s ease infinite',
        }}
      />
    );
  }

  if (solvedTone) {
    const { main, ink } = teamToneVars(solvedTone);
    return (
      <Box
        sx={{
          aspectRatio: '1',
          width: 1,
          borderRadius: sj.radiusXl,
          backgroundColor: main,
          color: ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconCheck size={28} strokeWidth={3} />
      </Box>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      sx={{
        aspectRatio: '1',
        width: 1,
        border: 0,
        borderRadius: sj.radiusXl,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: sj.surface200,
        boxShadow: `inset 0 0 0 1.5px ${sj.controlBorder}`,
        color: sj.brand,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 60ms ease-out, background-color 120ms ease, box-shadow 120ms ease',
        ...sjText.pointValue,
        '&:hover': disabled ? undefined : { backgroundColor: sj.surface300 },
        '&:active': disabled
          ? undefined
          : { transform: 'scale(0.97)', backgroundColor: sj.surface300, boxShadow: `inset 0 0 0 2px ${sj.brand}` },
        '&:focus-visible': { outline: `2px solid ${sj.focus}`, outlineOffset: '2px' },
      }}
    >
      {mark}
    </Box>
  );
}
