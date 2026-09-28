import Box from '@mui/material/Box';

import { sj, sjFont } from './sj-tokens';
import { IconCheck } from './icons';

// ----------------------------------------------------------------------
// Badge — swap, turn, availability and count badges.
// See project/components/Badge/README.md.
// ----------------------------------------------------------------------

const badgeBaseSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '5px 10px',
  borderRadius: sj.radiusXs,
  fontFamily: sjFont.body,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  whiteSpace: 'nowrap' as const,
};

export function SwapBadge({ used }: { used: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        ...badgeBaseSx,
        ...(used
          ? { backgroundColor: sj.warning, color: sj.warningInk }
          : { backgroundColor: 'transparent', boxShadow: `inset 0 0 0 1.5px ${sj.accent}`, color: sj.link }),
      }}
    >
      {used ? 'Swap used' : 'Swap available'}
    </Box>
  );
}

export function TurnPill({ teamName, tone }: { teamName: string; tone: 'a' | 'b' }) {
  const main = tone === 'a' ? sj.teamA : sj.teamB;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '6px 12px 6px 8px',
        borderRadius: sj.radiusPill,
        fontFamily: sjFont.body,
        fontSize: 12,
        fontWeight: 700,
        color: sj.ink,
        backgroundColor: `color-mix(in srgb, ${main} 16%, ${sj.surface200})`,
      }}
    >
      <Box component="span" sx={{ width: 9, height: 9, borderRadius: '999px', backgroundColor: main, flexShrink: 0 }} />
      {teamName}&rsquo;s turn
    </Box>
  );
}

export function AvailabilityBadge({ ready, label }: { ready: boolean; label?: string }) {
  if (ready) {
    return (
      <Box component="span" sx={{ ...badgeBaseSx, backgroundColor: sj.success, color: sj.successInk }}>
        <IconCheck size={12} strokeWidth={3} />
        Ready
      </Box>
    );
  }
  return (
    <Box
      component="span"
      sx={{ ...badgeBaseSx, backgroundColor: sj.surface200, color: sj.inkMuted, boxShadow: `inset 0 0 0 1px ${sj.hairline}` }}
    >
      {label}
    </Box>
  );
}

export function CountBadge({ children }: { children: React.ReactNode }) {
  return (
    <Box component="span" sx={{ ...badgeBaseSx, backgroundColor: sj.accent, color: sj.accentInk }}>
      {children}
    </Box>
  );
}
