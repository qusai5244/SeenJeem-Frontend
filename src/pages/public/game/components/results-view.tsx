import type { GameTeam, GameQuestion } from 'src/types/game';

import Box from '@mui/material/Box';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { TeamHeaderCard } from 'src/pages/public/components/team-header-card';
import type { TeamTone } from 'src/pages/public/components/sj-tokens';

// ----------------------------------------------------------------------
// ScreenResults — replaces the board the instant the 16th cell is answered.
// See project/components/ScreenResults/README.md.
// ----------------------------------------------------------------------

const CONFETTI = [
  { x: 6, color: 'brand', delay: 0 },
  { x: 86, color: 'teamA', delay: 0.08 },
  { x: 18, color: 'accent', delay: 0.16 },
  { x: 78, color: 'success', delay: 0.05 },
  { x: 94, color: 'teamA', delay: 0.22 },
  { x: 30, color: 'brand', delay: 0.12 },
  { x: 56, color: 'teamA', delay: 0.02 },
  { x: 12, color: 'accent', delay: 0.28 },
  { x: 68, color: 'brand', delay: 0.18 },
  { x: 40, color: 'success', delay: 0.24 },
] as const;

function Confetti() {
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {CONFETTI.map((piece, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: '8%',
            left: `${piece.x}%`,
            width: 8,
            height: 8,
            borderRadius: '2px',
            bgcolor: sj[piece.color as keyof typeof sj],
            opacity: 0,
            animation: `sj-confetti-fall 900ms ease-out ${piece.delay}s 1 both`,
          }}
        />
      ))}
    </Box>
  );
}

type Props = {
  teams: GameTeam[];
  questions: GameQuestion[];
  onNewGame: () => void;
  onGoHome: () => void;
};

export function ResultsView({ teams, questions, onNewGame, onGoHome }: Props) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const tie = sorted.length > 1 && sorted[0].score === sorted[1].score;
  const winner = !tie ? sorted[0] : null;
  const winnerTone: TeamTone | null = winner ? (teams[0]?.id === winner.id ? 'a' : 'b') : null;

  const title = tie ? "It's a tie!" : `${winner?.name} wins!`;
  const subtitle =
    sorted.length > 1
      ? tie
        ? `Both teams finished on ${sorted[0].score} points.`
        : `${sorted[0].score} to ${sorted[1].score} — great game.`
      : '';

  return (
    <Box sx={{ position: 'relative', textAlign: 'center', overflow: 'hidden', borderRadius: sj.radiusXl, bgcolor: sj.surface100, px: { xs: 3, sm: sj.space6 }, py: { xs: sj.space7, sm: sj.space8 } }}>
      {winnerTone && <Confetti />}

      <Box
        sx={{
          ...sjText.displayXl,
          position: 'relative',
          color: winnerTone ? sj[winnerTone === 'a' ? 'teamA' : 'teamB'] : sj.ink,
          mb: sj.space2,
        }}
      >
        {title}
      </Box>
      <Box sx={{ ...sjText.bodySm, position: 'relative', color: sj.inkMuted, mb: sj.space7 }}>{subtitle}</Box>

      <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: sj.space4, mb: sj.space6, textAlign: 'left' }}>
        {sorted.map((team, index) => {
          const tone: TeamTone = teams[0]?.id === team.id ? 'a' : 'b';
          const tilesTaken = questions.filter((question) => question.solvedByTeamId === team.id).length;
          return (
            <Box key={team.id}>
              <TeamHeaderCard name={team.name} players={team.players} score={team.score} tone={tone} showSwapBadge={false} compact />
              <Box sx={{ ...sjText.caption, color: sj.inkFaint, textAlign: 'center', mt: '8px' }}>
                {tilesTaken} tile{tilesTaken === 1 ? '' : 's'} taken
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ position: 'relative', display: 'flex', gap: sj.space3, justifyContent: 'center', flexWrap: 'wrap' }}>
        <SjButton sjVariant="outline" onClick={onNewGame}>
          New game
        </SjButton>
        <SjButton sjVariant="ghost" onClick={onGoHome}>
          Home
        </SjButton>
      </Box>
    </Box>
  );
}
