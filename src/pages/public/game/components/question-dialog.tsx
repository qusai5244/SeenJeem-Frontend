import type { GameTeam, GameDetails, GameQuestion } from 'src/types/game';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { GameProgressAction } from 'src/types/game';
import { updateGameProgress } from 'src/actions/game';
import { toast } from 'src/components/snackbar';

import { sj, sjText, teamToneVars } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { SjDialog, ConfirmDialog } from 'src/pages/public/components/sj-dialog';
import { CountdownTimer } from 'src/pages/public/components/countdown-timer';
import { IconCheck, IconX } from 'src/pages/public/components/icons';
import type { TeamTone } from 'src/pages/public/components/sj-tokens';

// ----------------------------------------------------------------------
// ScreenQuestionDialog — opens over the board, never closes on scrim tap
// while a question is live. See project/components/ScreenQuestionDialog/README.md.
// ----------------------------------------------------------------------

const QUESTION_SECONDS = 120;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

type Props = {
  open: boolean;
  gameCode: string;
  question: GameQuestion | null;
  answeringTeam: GameTeam | null;
  answeringTeamTone: TeamTone;
  willFinishGame: boolean;
  onClose: () => void;
  onUpdated: (details: GameDetails) => void;
};

export function QuestionDialog({
  open,
  gameCode,
  question,
  answeringTeam,
  answeringTeamTone,
  willFinishGame,
  onClose,
  onUpdated,
}: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [confirmSwapOpen, setConfirmSwapOpen] = useState(false);

  const questionId = question?.id;

  // Reset local state whenever a new question is shown (including after a
  // swap, which swaps in a different question id for the same cell).
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

    setConfirmSwapOpen(false);
    setSwapping(true);

    try {
      const response = await updateGameProgress(gameCode, {
        action: GameProgressAction.SwapQuestion,
        teamId: answeringTeam.id,
        questionId: question.id,
      });

      if (response.data) onUpdated(response.data);
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to swap the question.');
    } finally {
      setSwapping(false);
    }
  }, [gameCode, question, answeringTeam, onUpdated]);

  // Re-derive the just-submitted answer's correctness from the latest question
  // prop, refreshed by the parent from the server response after submission.
  const submittedOption = answered ? question?.answers.find((option) => option.id === question.selectedAnswerId) : undefined;

  if (!question || !answeringTeam) return null;

  const canSwap = !answered && !answeringTeam.hasUsedSwap;
  const timedOut = !answered && secondsLeft <= 0;
  const lastCorrect = !!submittedOption?.isCorrect;
  const { main: teamColor } = teamToneVars(answeringTeamTone);

  return (
    <>
      <SjDialog open={open} onClose={onClose} maxWidth="sm" fullWidth preventScrimClose={!answered}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: sj.space6 }}>
          {!answered && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: sj.space4, gap: sj.space3 }}>
                <Box sx={{ ...sjText.label, color: sj.inkFaint }}>{question.subCategoryName}</Box>
                <Box sx={{ ...sjText.displayMd, fontSize: 15, color: sj.brand, flexShrink: 0 }}>{question.marks} pts</Box>
              </Box>

              <Box sx={{ ...sjText.label, color: teamColor, mb: sj.space2 }}>{answeringTeam.name} is answering</Box>
              <Box sx={{ ...sjText.bodyLg, mb: sj.space5 }}>{question.questionText}</Box>
            </>
          )}

          {answered && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: sj.space3, mb: sj.space4 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '999px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: lastCorrect ? sj.success : sj.danger,
                  color: lastCorrect ? sj.successInk : sj.dangerInk,
                }}
              >
                {lastCorrect ? <IconCheck size={18} strokeWidth={3} /> : <IconX size={18} strokeWidth={3} />}
              </Box>
              <Box>
                <Box sx={{ ...sjText.displayMd, fontSize: 17 }}>
                  {timedOut ? "Time's up!" : lastCorrect ? `Correct! ${answeringTeam.name} +${question.marks}` : 'Not quite'}
                </Box>
                {!lastCorrect && (
                  <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, mt: '2px' }}>
                    The answer was {question.answers.find((option) => option.isCorrect)?.answerText}.
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {question.answers.map((option, index) => {
              const chosen = selectedOptionId === option.id;
              let state: 'default' | 'picked' | 'correct' | 'wrong' = 'default';
              if (answered) {
                if (option.isCorrect) state = 'correct';
                else if (chosen) state = 'wrong';
              } else if (chosen) state = 'picked';

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
                    gap: '10px',
                    textAlign: 'left',
                    border: 0,
                    borderRadius: sj.radiusMd,
                    px: '14px',
                    py: '12px',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    color: sj.ink,
                    cursor: answered ? 'default' : 'pointer',
                    bgcolor: state === 'correct' ? sj.success : state === 'wrong' ? sj.danger : sj.surface200,
                    ...(state === 'correct' && { color: sj.successInk }),
                    ...(state === 'wrong' && { color: sj.dangerInk }),
                    boxShadow:
                      state === 'default'
                        ? `inset 0 0 0 1.5px ${sj.controlBorder}`
                        : state === 'picked'
                          ? `inset 0 0 0 2px ${sj.accent}`
                          : 'none',
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                      bgcolor: state === 'correct' ? sj.successInk : state === 'wrong' ? sj.dangerInk : sj.surface300,
                      color: state === 'correct' ? sj.success : state === 'wrong' ? sj.danger : sj.inkMuted,
                    }}
                  >
                    {LETTERS[index]}
                  </Box>
                  <Box component="span" sx={{ flex: 1 }}>
                    {option.answerText}
                  </Box>
                  {state === 'correct' && <IconCheck size={16} strokeWidth={3} />}
                  {state === 'wrong' && <IconX size={16} strokeWidth={3} />}
                </Box>
              );
            })}
          </Box>

          {answered && (
            <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, textAlign: 'center', mt: sj.space4 }}>
              Next up: <Box component="span" sx={{ color: sj.ink, fontWeight: 700 }}>{willFinishGame ? 'the final results' : "the other team's turn"}</Box>
            </Box>
          )}

          {!answered ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: sj.space4, mt: sj.space5 }}>
              <CountdownTimer secondsLeft={secondsLeft} totalSeconds={QUESTION_SECONDS} />
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <SjButton sjVariant="outline" disabled={!canSwap || submitting || swapping} onClick={() => setConfirmSwapOpen(true)}>
                  {answeringTeam.hasUsedSwap ? 'Swap used' : swapping ? 'Swapping…' : 'Swap'}
                </SjButton>
                <SjButton sjVariant="primary" disabled={selectedOptionId == null || submitting} onClick={handleSubmit}>
                  {submitting ? 'Submitting…' : 'Submit'}
                </SjButton>
              </Box>
            </Box>
          ) : (
            <SjButton sjVariant="primary" fullWidth onClick={onClose} sx={{ mt: sj.space5 }}>
              Continue
            </SjButton>
          )}
        </Box>
      </SjDialog>

      <ConfirmDialog
        open={confirmSwapOpen}
        tone="warning"
        title={`Use ${answeringTeam.name}'s swap?`}
        description="Each team gets one swap for the whole game. This trades the question, not the turn."
        confirmLabel="Use swap"
        onCancel={() => setConfirmSwapOpen(false)}
        onConfirm={handleSwap}
      />
    </>
  );
}
