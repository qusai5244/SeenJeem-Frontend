import Box from '@mui/material/Box';

import { sj, sjFont } from './sj-tokens';
import { IconX } from './icons';

// ----------------------------------------------------------------------
// PlayerChip — one player, one chip, in the Teams step of New Game.
// See project/components/PlayerChip/README.md.
// ----------------------------------------------------------------------

type Props = {
  name: string;
  tone?: 'a' | 'b' | null;
  draggable?: boolean;
  dragging?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  onRemove?: () => void;
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function PlayerChip({ name, tone = null, draggable, dragging, onDragStart, onDragEnd, onRemove }: Props) {
  const main = tone === 'a' ? sj.teamA : tone === 'b' ? sj.teamB : null;
  const mainInk = tone === 'a' ? sj.teamAInk : tone === 'b' ? sj.teamBInk : null;

  return (
    <Box
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px 6px 6px',
        borderRadius: sj.radiusPill,
        fontFamily: sjFont.body,
        fontSize: 14,
        fontWeight: 600,
        color: sj.ink,
        cursor: draggable ? 'grab' : 'default',
        backgroundColor: main ? `color-mix(in srgb, ${main} 14%, ${sj.surface200})` : sj.surface200,
        boxShadow: main
          ? `inset 0 0 0 1.5px color-mix(in srgb, ${main} 55%, transparent)`
          : `inset 0 0 0 1.5px ${sj.controlBorder}`,
        ...(dragging && { boxShadow: sj.shadowMd, transform: 'rotate(-2deg)' }),
      }}
    >
      <Box
        component="span"
        sx={{
          width: 26,
          height: 26,
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
          backgroundColor: main ?? sj.surface300,
          color: mainInk ?? sj.inkMuted,
        }}
      >
        {initialsOf(name)}
      </Box>
      <Box component="span">{name}</Box>
      {onRemove && (
        <Box
          component="button"
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          sx={{
            width: 18,
            height: 18,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: sj.inkFaint,
            marginLeft: '2px',
            cursor: 'pointer',
            background: 'transparent',
            border: 0,
            padding: 0,
            '&:hover': { backgroundColor: sj.danger, color: sj.dangerInk },
          }}
        >
          <IconX size={11} strokeWidth={2.5} />
        </Box>
      )}
    </Box>
  );
}
