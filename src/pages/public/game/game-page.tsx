import type { GameTeam, GameDetails, GameQuestion } from 'src/types/game';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { GameStatus } from 'src/types/game';
import { completeGame, getGameDetails } from 'src/actions/game';

import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';
import { SjButton } from 'src/pages/public/components/sj-button';

import { GameBoard } from './components/game-board';
import { ResultsView } from './components/results-view';
import { QuestionDialog } from './components/question-dialog';

// ----------------------------------------------------------------------

const POLL_INTERVAL_MS = 5000;

type CellKey = { subCategoryId: number; marks: number };

function TeamHeaderCard({ team, isCurrentTurn }: { team: GameTeam; isCurrentTurn: boolean }) {
  return (
    <BlueprintFrame
      sx={{
        p: 2,
        flex: 1,
        borderColor: isCurrentTurn ? sjColor.accent : sjColor.divider,
        bgcolor: isCurrentTurn ? sjColor.accent100 : 'transparent',
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 24, textTransform: 'uppercase', lineHeight: 1.1 }}>
              {team.name}
            </Typography>
            {isCurrentTurn && (
              <Box sx={{ fontSize: 11, px: 1.25, py: 0.375, bgcolor: sjColor.accent, color: sjColor.bg }}>
                Current turn
              </Box>
            )}
          </Stack>
          <Typography sx={{ fontSize: 13, color: sjColor.neutral600, mt: 0.5 }}>
            {team.players.join(' · ') || 'No players'}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box
              component="span"
              sx={{
                fontSize: 11,
                px: 1.25,
                py: 0.375,
                border: '1px solid',
                borderColor: sjColor.divider,
                color: team.hasUsedSwap ? sjColor.neutral600 : sjColor.accent700,
              }}
            >
              {team.hasUsedSwap ? 'Swap used' : 'Swap available'}
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 44, lineHeight: 0.9 }}>
            {team.score}
          </Typography>
          <Typography sx={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: sjColor.neutral600 }}>
            points
          </Typography>
        </Box>
      </Stack>
    </BlueprintFrame>
  );
}

export default function GamePage() {
  const router = useRouter();
  const { gameCode } = useParams<{ gameCode: string }>();

  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [dialogCell, setDialogCell] = useState<CellKey | null>(null);

  const completingRef = useRef(false);

  const fetchDetails = useCallback(async () => {
    if (!gameCode) return;

    try {
      const response = await getGameDetails(gameCode);
      if (response.data) setGameDetails(response.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Poll so a second device following the same game code stays in sync.
  useEffect(() => {
    if (!gameDetails || gameDetails.gameStatus !== GameStatus.Confirmed) return undefined;

    const interval = setInterval(fetchDetails, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameDetails, fetchDetails]);

  // Once every cell is terminal, ask the server to independently verify and complete the game.
  useEffect(() => {
    if (!gameDetails || !gameCode) return;
    if (gameDetails.gameStatus !== GameStatus.Confirmed) return;
    if (gameDetails.questions.length === 0) return;
    if (!gameDetails.questions.every((question) => question.solvedByTeamId != null)) return;
    if (completingRef.current) return;

    completingRef.current = true;

    completeGame(gameCode)
      .then(() => fetchDetails())
      .catch(() => {
        completingRef.current = false;
      });
  }, [gameDetails, gameCode, fetchDetails]);

  const dialogQuestion: GameQuestion | null = useMemo(() => {
    if (!dialogCell || !gameDetails) return null;
    return (
      gameDetails.questions.find(
        (question) =>
          question.subCategoryId === dialogCell.subCategoryId && question.marks === dialogCell.marks
      ) ?? null
    );
  }, [dialogCell, gameDetails]);

  const answeringTeam = useMemo(() => {
    if (!gameDetails?.currentTurnTeamId) return null;
    return gameDetails.teams.find((team) => team.id === gameDetails.currentTurnTeamId) ?? null;
  }, [gameDetails]);

  const willFinishGame = useMemo(() => {
    if (!gameDetails || !dialogQuestion) return false;
    return gameDetails.questions
      .filter((question) => question.id !== dialogQuestion.id)
      .every((question) => question.solvedByTeamId != null);
  }, [gameDetails, dialogQuestion]);

  const handleCellClick = useCallback(
    (question: GameQuestion) => {
      if (!gameDetails || gameDetails.gameStatus !== GameStatus.Confirmed) return;
      if (question.solvedByTeamId != null) return;
      if (!answeringTeam) return;

      setDialogCell({ subCategoryId: question.subCategoryId, marks: question.marks });
    },
    [gameDetails, answeringTeam]
  );

  if (loading) {
    return (
      <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <Box
          sx={{
            width: 22,
            height: 22,
            border: '2px solid',
            borderColor: sjColor.accent300,
            borderTopColor: sjColor.accent,
            borderRadius: '50%',
            animation: 'sj-spin .8s linear infinite',
          }}
        />
      </Stack>
    );
  }

  if (notFound || !gameDetails) {
    return (
      <Box sx={{ maxWidth: 620, mx: 'auto', px: 3, py: { xs: 6, sm: 12 }, textAlign: 'center', flex: 1 }}>
        <BlueprintFrame sx={{ p: { xs: 4, sm: 5.5 } }}>
          <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 76, lineHeight: 1, color: sjColor.accent400 }}>
            404
          </Typography>
          <Typography sx={{ fontSize: 30, textTransform: 'uppercase', mt: 1.5, mb: 1 }}>
            No game with that code
          </Typography>
          <Typography sx={{ mx: 'auto', mb: 3.25, maxWidth: '40ch', color: sjColor.neutral700 }}>
            {`It may have been completed, or the code "${gameCode}" was mistyped.`}
          </Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
            <SjButton sjVariant="primary" onClick={() => router.push(paths.public.root)}>
              Try another code
            </SjButton>
            <SjButton sjVariant="secondary" onClick={() => router.push(paths.public.newGame)}>
              New game
            </SjButton>
          </Stack>
        </BlueprintFrame>
      </Box>
    );
  }

  const solvedCount = gameDetails.questions.filter((question) => question.solvedByTeamId != null).length;

  return (
    <>
      <Helmet>
        <title>Game {gameCode} — SeenJeem</title>
      </Helmet>

      <Box sx={{ maxWidth: 1220, mx: 'auto', width: 1, px: 3, py: { xs: 2.75, sm: 4 }, pb: 8.75 }}>
        {gameDetails.gameStatus === GameStatus.Completed ? (
          <ResultsView
            gameCode={gameCode ?? ''}
            teams={gameDetails.teams}
            questions={gameDetails.questions}
            onNewGame={() => router.push(paths.public.newGame)}
            onGoHome={() => router.push(paths.public.root)}
          />
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, mb: 2.5 }}>
              {gameDetails.teams.map((team) => (
                <TeamHeaderCard
                  key={team.id}
                  team={team}
                  isCurrentTurn={team.id === gameDetails.currentTurnTeamId}
                />
              ))}
            </Box>

            <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1.5} flexWrap="wrap" sx={{ mb: 1.25 }}>
              <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 20, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                Board
              </Typography>
              <Typography sx={{ fontSize: 13, color: sjColor.neutral600 }}>
                {solvedCount} of {gameDetails.questions.length} answered
              </Typography>
            </Stack>

            <GameBoard
              questions={gameDetails.questions}
              teams={gameDetails.teams}
              interactive={!!answeringTeam}
              onCellClick={handleCellClick}
            />

            <Stack direction="row" alignItems="center" spacing={1.75} flexWrap="wrap" sx={{ mt: 2, fontSize: 13, color: sjColor.neutral600 }}>
              <Typography sx={{ fontSize: 13, color: 'inherit' }}>
                {answeringTeam ? `${answeringTeam.name} picks the next tile.` : 'Waiting for a turn.'}
              </Typography>
            </Stack>
          </>
        )}
      </Box>

      <QuestionDialog
        open={!!dialogQuestion}
        gameCode={gameCode ?? ''}
        question={dialogQuestion}
        answeringTeam={answeringTeam}
        willFinishGame={willFinishGame}
        onClose={() => setDialogCell(null)}
        onUpdated={setGameDetails}
      />
    </>
  );
}
