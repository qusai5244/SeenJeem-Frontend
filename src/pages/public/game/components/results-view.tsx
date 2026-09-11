import type { GameTeam, GameQuestion } from 'src/types/game';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';

// ----------------------------------------------------------------------

type Props = {
  gameCode: string;
  teams: GameTeam[];
  questions: GameQuestion[];
  onNewGame: () => void;
  onGoHome: () => void;
};

export function ResultsView({ gameCode, teams, questions, onNewGame, onGoHome }: Props) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const tie = sorted.length > 1 && sorted[0].score === sorted[1].score;

  const winnerLine = sorted.length ? (tie ? 'It’s a tie' : `${sorted[0].name} wins`) : '';
  const winnerSub = sorted.length
    ? tie
      ? `Both teams finished on ${sorted[0].score} points.`
      : `${sorted[0].score} – ${sorted[1]?.score ?? 0} across ${questions.length} questions.`
    : '';

  return (
    <Box>
      <Box sx={{ bgcolor: sjColor.accent900, color: '#f2f2f3', p: { xs: 3.25, sm: 6 }, textAlign: 'center', mb: 3.25 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.75, mb: 1.25 }}>
          Game {gameCode} · complete
        </Typography>
        <Typography
          sx={{
            fontFamily: sjFont.heading,
            fontWeight: 600,
            fontSize: { xs: 38, sm: 72 },
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {winnerLine}
        </Typography>
        <Typography sx={{ fontSize: 16, opacity: 0.8, mt: 1.25 }}>{winnerSub}</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2.25 }}>
        {sorted.map((team, index) => {
          const isWinner = index === 0 && !tie;
          const tilesTaken = questions.filter((q) => q.solvedByTeamId === team.id).length;

          return (
            <BlueprintFrame
              key={team.id}
              cornerColor={isWinner ? sjColor.accent : undefined}
              sx={{ p: 2.5, borderColor: isWinner ? sjColor.accent : sjColor.divider }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.25}>
                <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 26, textTransform: 'uppercase' }}>
                  {team.name}
                </Typography>
                <Box sx={{ fontSize: 11, px: 1.25, py: 0.375, bgcolor: sjColor.accent100, color: sjColor.accent900 }}>
                  {tie ? 'Tied' : index === 0 ? 'Winner' : 'Runner-up'}
                </Box>
              </Stack>
              <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 56, lineHeight: 1, my: 1 }}>
                {team.score}
              </Typography>
              <Typography sx={{ fontSize: 13, color: sjColor.neutral600 }}>
                {tilesTaken} tiles taken · {team.players.join(' · ') || 'No players'}
              </Typography>
            </BlueprintFrame>
          );
        })}
      </Box>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 3.75 }}>
        <SjButton sjVariant="primary" size="large" onClick={onNewGame} sx={{ px: 3.75 }}>
          New game
        </SjButton>
        <SjButton sjVariant="secondary" size="large" onClick={onGoHome} sx={{ px: 2.75 }}>
          Back home
        </SjButton>
      </Stack>
    </Box>
  );
}
