import type { GameTeam, GameDetails, GameQuestion } from 'src/types/game';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { GameProgressAction } from 'src/types/game';
import { updateGameProgress } from 'src/actions/game';
import { toast } from 'src/components/snackbar';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';

// ----------------------------------------------------------------------

const QUESTION_SECONDS = 120;
const LETTERS = ['A', 'B', 'C', 'D'];

type Props = {
  open: boolean;
  gameCode: string;
  question: GameQuestion | null;
  answeringTeam: GameTeam | null;
  willFinishGame: boolean;
  onClose: () => void;
  onUpdated: (details: GameDetails) => void;
};

export function QuestionDialog({
  open,
  gameCode,
  question,
  answeringTeam,
  willFinishGame,
  onClose,
  onUpdated,
}: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);

  const questionId = question?.id;

  // Reset local state whenever a new question is shown (including after a swap,
  // which swaps in a different question id for the same cell).
  useEffect(() => {
    setSelectedOptionId(null);
    setAnswered(false);
    setSecondsLeft(QUESTION_SECONDS);
  }, [questionId]);

  useEffect(() => {
    if (!open || answered) return undefined;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [open, answered]);

  const handleSubmit = useCallback(async () => {
    if (!question || !answeringTeam || selectedOptionId == null) return;

    setSubmitting(true);

    try {
      const response = await updateGameProgress(gameCode, {
        action: GameProgressAction.AnswerQuestion,
        teamId: answeringTeam.id,
        questionId: question.id,
        selectedQuestionOptionId: selectedOptionId,
      });

      if (response.data) {
        onUpdated(response.data);
        setAnswered(true);
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to submit the answer.');
    } finally {
      setSubmitting(false);
    }
  }, [gameCode, question, answeringTeam, selectedOptionId, onUpdated]);

  const handleSwap = useCallback(async () => {
    if (!question || !answeringTeam) return;

    setSwapping(true);

    try {
      const response = await updateGameProgress(gameCode, {
        action: GameProgressAction.SwapQuestion,
        teamId: answeringTeam.id,
        questionId: question.id,
      });

      if (response.data) {
        onUpdated(response.data);
        toast.success('Question swapped — one per team');
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to swap the question.');
    } finally {
      setSwapping(false);
    }
  }, [gameCode, question, answeringTeam, onUpdated]);

  // Re-derive the just-submitted answer's correctness from the latest question prop,
  // which is refreshed by the parent from the server response after submission.
  const submittedOption = answered
    ? question?.answers.find((option) => option.id === question.selectedAnswerId)
    : undefined;

  if (!question || !answeringTeam) return null;

  const canSwap = !answered && !answeringTeam.hasUsedSwap;
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const timerLabel = `${mm}:${ss < 10 ? '0' : ''}${ss}`;
  const timerColor = secondsLeft <= 15 ? sjColor.errorText : sjColor.neutral600;
  const lastCorrect = !!submittedOption?.isCorrect;

  return (
    <Dialog
      open={open}
      onClose={answered ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 0, bgcolor: sjColor.bg, position: 'relative', overflow: 'visible' },
        },
      }}
    >
      <BlueprintFrame sx={{ display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          flexWrap="wrap"
          sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: sjColor.divider }}
        >
          <Box
            sx={{
              fontSize: 11,
              px: 1.25,
              py: 0.375,
              bgcolor: sjColor.accent,
              color: sjColor.bg,
            }}
          >
            {question.marks} points
          </Box>
          <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 19, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            {question.subCategoryName}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontFamily: sjFont.mono, fontSize: 15, color: timerColor }}>
            {timerLabel}
          </Typography>
        </Stack>

        <Box sx={{ px: 2.5, py: 2.75 }}>
          <Typography sx={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: sjColor.accent700, mb: 1.25 }}>
            {answeringTeam.name} is answering
          </Typography>
          <Typography sx={{ fontSize: { xs: 22, sm: 26 }, lineHeight: 1.15, mb: 2.5 }}>
            {question.questionText}
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1.25 }}>
            {question.answers.map((option, index) => {
              const chosen = selectedOptionId === option.id;

              let bg: string = 'transparent';
              let fg: string = sjColor.text;
              let border: string = sjColor.divider;
              let mark = '';

              if (answered) {
                if (option.isCorrect) {
                  bg = sjColor.successBg;
                  border = sjColor.successBorder;
                  fg = sjColor.successText;
                  mark = '✓';
                } else if (chosen) {
                  bg = sjColor.errorBg;
                  border = sjColor.errorBorder;
                  fg = sjColor.errorText;
                  mark = '×';
                }
              } else if (chosen) {
                bg = sjColor.accent100;
                border = sjColor.accent;
                fg = sjColor.accent900;
              }

              return (
                <Box
                  key={option.id}
                  component="button"
                  type="button"
                  disabled={answered || submitting}
                  onClick={() => setSelectedOptionId(option.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    textAlign: 'left',
                    p: 1.75,
                    border: '1px solid',
                    borderColor: border,
                    bgcolor: bg,
                    color: fg,
                    cursor: answered ? 'default' : 'pointer',
                    font: 'inherit',
                    fontSize: 15,
                    minHeight: 56,
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 26,
                      height: 26,
                      flex: 'none',
                      border: '1px solid currentColor',
                      fontFamily: sjFont.heading,
                      fontSize: 14,
                    }}
                  >
                    {LETTERS[index]}
                  </Box>
                  <Box component="span" sx={{ flex: 1 }}>
                    {option.answerText}
                  </Box>
                  <Box component="span" sx={{ fontFamily: sjFont.heading, fontSize: 16 }}>
                    {mark}
                  </Box>
                </Box>
              );
            })}
          </Box>

          {answered && (
            <Box
              sx={{
                mt: 2.25,
                px: 2,
                py: 1.75,
                border: '1px solid',
                borderColor: lastCorrect ? sjColor.successBorder : sjColor.errorBorder,
                bgcolor: lastCorrect ? sjColor.successBg : sjColor.errorBg,
                color: lastCorrect ? sjColor.successText : sjColor.errorText,
                fontFamily: sjFont.heading,
                fontWeight: 600,
                fontSize: 21,
                textTransform: 'uppercase',
                letterSpacing: '.04em',
              }}
            >
              {lastCorrect ? `Correct — +${question.marks} points` : 'Incorrect — no points awarded'}
            </Box>
          )}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          flexWrap="wrap"
          sx={{ px: 2.5, py: 1.75, borderTop: '1px solid', borderColor: sjColor.divider }}
        >
          {!answered && (
            <SjButton sjVariant="secondary" disabled={!canSwap || submitting} onClick={handleSwap}>
              {answeringTeam.hasUsedSwap ? 'Swap used' : swapping ? 'Swapping…' : 'Swap question'}
            </SjButton>
          )}

          <Typography sx={{ fontSize: 12, color: sjColor.neutral600 }}>
            {answered ? 'Scores are already saved.' : 'One swap per team, for the whole game.'}
          </Typography>

          <Box sx={{ flex: 1 }} />

          {!answered && (
            <SjButton sjVariant="primary" disabled={selectedOptionId == null || submitting} onClick={handleSubmit} sx={{ px: 3 }}>
              {submitting ? 'Submitting…' : 'Submit answer'}
            </SjButton>
          )}
          {answered && (
            <SjButton sjVariant="primary" onClick={onClose} sx={{ px: 3 }}>
              {willFinishGame ? 'See results' : 'Next turn'}
            </SjButton>
          )}
        </Stack>
      </BlueprintFrame>
    </Dialog>
  );
}
