import type { GameDetails, GameQuestion } from 'src/types/game';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { GameStatus } from 'src/types/game';
import { completeGame, getGameDetails } from 'src/actions/game';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { TeamHeaderCard } from 'src/pages/public/components/team-header-card';
import { FullScreenLoading, ErrorBanner } from 'src/pages/public/components/feedback-states';
import type { TeamTone } from 'src/pages/public/components/sj-tokens';

import { GameBoard } from './components/game-board';
import { ResultsView } from './components/results-view';
import { QuestionDialog } from './components/question-dialog';

// ----------------------------------------------------------------------
// ScreenGameBoard — the shared display.
// See project/components/ScreenGameBoard/README.md.
// ----------------------------------------------------------------------

const POLL_INTERVAL_MS = 5000;

type CellKey = { subCategoryId: number; marks: number };

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
        (question) => question.subCategoryId === dialogCell.subCategoryId && question.marks === dialogCell.marks
      ) ?? null
    );
  }, [dialogCell, gameDetails]);

  const answeringTeam = useMemo(() => {
    if (!gameDetails?.currentTurnTeamId) return null;
    return gameDetails.teams.find((team) => team.id === gameDetails.currentTurnTeamId) ?? null;
  }, [gameDetails]);

  const answeringTeamTone: TeamTone = useMemo(() => {
    if (!gameDetails || !answeringTeam) return 'a';
    return gameDetails.teams[0]?.id === answeringTeam.id ? 'a' : 'b';
  }, [gameDetails, answeringTeam]);

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

  if (loading) return <FullScreenLoading />;

  if (notFound || !gameDetails) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', px: 3, py: { xs: 6, sm: 10 }, textAlign: 'center', flex: 1 }}>
        <ErrorBanner message={`No game found with code "${gameCode}".`} />
        <Box sx={{ display: 'flex', gap: sj.space3, justifyContent: 'center', flexWrap: 'wrap', mt: sj.space5 }}>
          <SjButton sjVariant="primary" onClick={() => router.push(paths.public.root)}>
            Try another code
          </SjButton>
          <SjButton sjVariant="outline" onClick={() => router.push(paths.public.newGame)}>
            New game
          </SjButton>
        </Box>
      </Box>
    );
  }

  const solvedCount = gameDetails.questions.filter((question) => question.solvedByTeamId != null).length;

  return (
    <>
      <Helmet>
        <title>Game {gameCode} — SeenJeem</title>
      </Helmet>

      <Box sx={{ maxWidth: 900, mx: 'auto', width: 1, px: { xs: 2.5, sm: 4 }, py: { xs: sj.space5, sm: sj.space7 } }}>
        {gameDetails.gameStatus === GameStatus.Completed ? (
          <ResultsView
            teams={gameDetails.teams}
            questions={gameDetails.questions}
            onNewGame={() => router.push(paths.public.newGame)}
            onGoHome={() => router.push(paths.public.root)}
          />
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: sj.space5, mb: sj.space5 }}>
              {gameDetails.teams.map((team, index) => (
                <TeamHeaderCard
                  key={team.id}
                  name={team.name}
                  players={team.players}
                  score={team.score}
                  tone={index === 0 ? 'a' : 'b'}
                  isCurrentTurn={team.id === gameDetails.currentTurnTeamId}
                  swapUsed={team.hasUsedSwap}
                />
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', mb: sj.space6 }}>
              <Box sx={{ ...sjText.caption, color: sj.inkFaint, textTransform: 'uppercase', letterSpacing: '0.06em', mb: '4px' }}>
                Game code <Box component="span" sx={{ color: sj.inkMuted, fontWeight: 700 }}>{gameCode}</Box>
              </Box>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: sj.brand }}>
                {solvedCount} of {gameDetails.questions.length} solved
              </Box>
            </Box>

            <Box sx={{ px: { xs: 0, md: sj.space10 } }}>
              <GameBoard
                questions={gameDetails.questions}
                teams={gameDetails.teams}
                interactive={!!answeringTeam}
                onCellClick={handleCellClick}
              />
            </Box>
          </>
        )}
      </Box>

      <QuestionDialog
        open={!!dialogQuestion}
        gameCode={gameCode ?? ''}
        question={dialogQuestion}
        answeringTeam={answeringTeam}
        answeringTeamTone={answeringTeamTone}
        willFinishGame={willFinishGame}
        onClose={() => setDialogCell(null)}
        onUpdated={setGameDetails}
      />
    </>
  );
}
