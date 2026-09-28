import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { sj, sjFont, sjText, teamToneVars } from './sj-tokens';
import { SwapBadge } from './badge';
import type { TeamTone } from './sj-tokens';

// ----------------------------------------------------------------------
// TeamHeaderCard — the scoreboard for one team on the Game Board screen.
// See project/components/TeamHeaderCard/README.md.
// ----------------------------------------------------------------------

type Props = {
  name: string;
  players: string[];
  score: number;
  tone: TeamTone;
  isCurrentTurn?: boolean;
  swapUsed?: boolean;
  showSwapBadge?: boolean;
  compact?: boolean;
};

export function TeamHeaderCard({
  name,
  players,
  score,
  tone,
  isCurrentTurn = false,
  swapUsed = false,
  showSwapBadge = true,
  compact = false,
}: Props) {
  const { main, glow } = teamToneVars(tone);

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: sj.radiusLg,
        backgroundColor: sj.surface100,
        overflow: 'hidden',
        boxShadow: isCurrentTurn ? glow : sj.shadowSm,
        outline: isCurrentTurn ? `2px solid ${main}` : 'none',
        outlineOffset: 0,
      }}
    >
      <Box sx={{ height: 4, backgroundColor: main }} />
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ gap: sj.space3, padding: compact ? sj.space4 : sj.space5 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              fontFamily: sjFont.body,
              fontWeight: 800,
              fontSize: compact ? 13 : 16,
              mb: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Box>
          <Box
            sx={{
              fontFamily: sjFont.body,
              fontSize: compact ? 11 : 12,
              color: sj.inkMuted,
            }}
          >
            {players.length ? players.join(', ') : 'No players'}
          </Box>
        </Box>
        <Box sx={{ ...sjText.scoreLg, fontSize: compact ? '24px' : '34px', lineHeight: 1, color: main, flexShrink: 0 }}>
          {score}
        </Box>
      </Stack>
      {showSwapBadge && (
        <Box sx={{ position: 'absolute', top: sj.space3, right: sj.space3 }}>
          <SwapBadge used={swapUsed} />
        </Box>
      )}
    </Box>
  );
}
