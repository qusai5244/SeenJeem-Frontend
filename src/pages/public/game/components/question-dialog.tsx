import type { GameTeam, GameDetails, GameQuestion } from 'src/types/game';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { QuestionType, GameProgressAction, isVisualQuestionType, MIN_OPTIONS_FOR_REMOVE_TWO } from 'src/types/game';
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

type OptionState = 'default' | 'picked' | 'correct' | 'wrong';

// A square tile for image / colour questions. The letter badge doubles as the
// option's accessible name, since the content itself carries no text.
function VisualOption({
  kind,
  value,
  letter,
  state,
  removed,
  disabled,
  onSelect,
}: {
  kind: 'image' | 'color';
  value: string;
  letter: string;
  state: OptionState;
  removed: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [value]);

  const ring =
    state === 'correct'
      ? `0 0 0 3px ${sj.success}`
      : state === 'wrong'
        ? `0 0 0 3px ${sj.danger}`
        : state === 'picked'
          ? `0 0 0 3px ${sj.accent}`
          : `inset 0 0 0 1.5px ${sj.controlBorder}`;

  const badgeBg = state === 'correct' ? sj.success : state === 'wrong' ? sj.danger : state === 'picked' ? sj.accent : sj.surface100;
  const badgeInk =
    state === 'correct' ? sj.successInk : state === 'wrong' ? sj.dangerInk : state === 'picked' ? sj.accentInk : sj.ink;

  return (
    <Box
      component="button"
      type="button"
      aria-label={removed ? `Option ${letter} removed` : `Option ${letter}`}
      aria-pressed={state === 'picked'}
      disabled={disabled}
      onClick={onSelect}
      sx={{
        ...(removed && { opacity: 0.25, filter: 'grayscale(1)' }),
        position: 'relative',
        aspectRatio: '4 / 3',
        p: 0,
        border: 0,
        borderRadius: sj.radiusMd,
        overflow: 'hidden',
        cursor: disabled ? 'default' : 'pointer',
        bgcolor: kind === 'color' ? value : sj.surface200,
        boxShadow: ring,
        transition: 'box-shadow 120ms ease, transform 120ms ease',
        '&:not(:disabled):hover': { transform: 'translateY(-1px)' },
        '&:focus-visible': { outline: `2px solid ${sj.focus}`, outlineOffset: '3px' },
      }}
    >
      {kind === 'image' &&
        (imageFailed ? (
          <Box sx={{ ...sjText.bodySm, color: sj.inkFaint, px: 1 }}>Image unavailable</Box>
        ) : (
          <Box
            component="img"
            src={value}
            alt=""
            loading="eager"
            draggable={false}
            onError={() => setImageFailed(true)}
            sx={{ display: 'block', width: 1, height: 1, objectFit: 'cover' }}
          />
        ))}

      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          minWidth: 24,
          height: 24,
          px: '6px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          fontSize: 11,
          fontWeight: 800,
          bgcolor: badgeBg,
          color: badgeInk,
          boxShadow: sj.shadowSm,
        }}
      >
        {letter}
        {state === 'correct' && <IconCheck size={12} strokeWidth={3} />}
        {state === 'wrong' && <IconX size={12} strokeWidth={3} />}
      </Box>
    </Box>
  );
}

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
  const [removing, setRemoving] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const questionId = question?.id;
  const removedAnswerIds = question?.removedAnswerIds;

  // Reset local state whenever a new question is shown (including after a
  // swap, which swaps in a different question id for the same cell).
  useEffect(() => {
    setSelectedOptionId(null);
    setAnswered(false);
    setSecondsLeft(QUESTION_SECONDS);
  }, [questionId]);

  // Drop a pick that was just removed, so Submit can't send a hidden option.
  useEffect(() => {
    if (removedAnswerIds?.length) {
      setSelectedOptionId((prev) => (prev != null && removedAnswerIds.includes(prev) ? null : prev));
    }
  }, [removedAnswerIds]);

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

  const handleRemoveTwo = useCallback(async () => {
    if (!question || !answeringTeam) return;

    setConfirmRemoveOpen(false);
    setRemoving(true);

    try {
      const response = await updateGameProgress(gameCode, {
        action: GameProgressAction.RemoveTwoOptions,
        teamId: answeringTeam.id,
        questionId: question.id,
      });

      if (response.data) onUpdated(response.data);
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to remove two answers.');
    } finally {
      setRemoving(false);
    }
  }, [gameCode, question, answeringTeam, onUpdated]);

  // Re-derive the just-submitted answer's correctness from the latest question
  // prop, refreshed by the parent from the server response after submission.
  const submittedOption = answered ? question?.answers.find((option) => option.id === question.selectedAnswerId) : undefined;

  if (!question || !answeringTeam) return null;

  const visual = isVisualQuestionType(question.questionType);
  const canSwap = !answered && !answeringTeam.hasUsedSwap;
  const removedIds = new Set(question.removedAnswerIds ?? []);
  const removeTwoApplies = question.answers.length >= MIN_OPTIONS_FOR_REMOVE_TWO;
  const canRemoveTwo = !answered && removeTwoApplies && !answeringTeam.hasUsedRemoveTwo && removedIds.size === 0;
  const busy = submitting || swapping || removing;
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
                    {visual
                      ? `The answer was ${LETTERS[question.answers.findIndex((option) => option.isCorrect)] ?? '—'}.`
                      : `The answer was ${question.answers.find((option) => option.isCorrect)?.answerText}.`}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Box
            sx={
              visual
                ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }
                : { display: 'flex', flexDirection: 'column', gap: '8px' }
            }
          >
            {question.answers.map((option, index) => {
              const chosen = selectedOptionId === option.id;
              const removed = removedIds.has(option.id);
              let state: OptionState = 'default';
              if (answered) {
                if (option.isCorrect) state = 'correct';
                else if (chosen) state = 'wrong';
              } else if (chosen) state = 'picked';

              if (visual) {
                return (
                  <VisualOption
                    key={option.id}
                    kind={question.questionType === QuestionType.ColorChoice ? 'color' : 'image'}
                    value={option.answerText}
                    letter={LETTERS[index]}
                    state={state}
                    removed={removed}
                    disabled={answered || busy || removed}
                    onSelect={() => setSelectedOptionId(option.id)}
                  />
                );
              }

              return (
                <Box
                  key={option.id}
                  component="button"
                  type="button"
                  disabled={answered || busy || removed}
                  aria-label={removed ? `Option ${LETTERS[index]} removed` : undefined}
                  onClick={() => setSelectedOptionId(option.id)}
                  sx={{
                    ...(removed && { opacity: 0.35, textDecoration: 'line-through' }),
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
                    cursor: answered || removed ? 'default' : 'pointer',
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: sj.space4, mt: sj.space5 }}>
              <CountdownTimer secondsLeft={secondsLeft} totalSeconds={QUESTION_SECONDS} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '8px' }}>
                {removeTwoApplies && (
                  <SjButton sjVariant="outline" disabled={!canRemoveTwo || busy} onClick={() => setConfirmRemoveOpen(true)}>
                    {removedIds.size > 0
                      ? '2 removed'
                      : answeringTeam.hasUsedRemoveTwo
                        ? 'Remove 2 used'
                        : removing
                          ? 'Removing…'
                          : 'Remove 2'}
                  </SjButton>
                )}
                <SjButton sjVariant="outline" disabled={!canSwap || busy} onClick={() => setConfirmSwapOpen(true)}>
                  {answeringTeam.hasUsedSwap ? 'Swap used' : swapping ? 'Swapping…' : 'Swap'}
                </SjButton>
                <SjButton sjVariant="primary" disabled={selectedOptionId == null || busy} onClick={handleSubmit}>
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

      <ConfirmDialog
        open={confirmRemoveOpen}
        tone="warning"
        title={`Use ${answeringTeam.name}'s remove-two?`}
        description={`Each team can remove two wrong answers once per game. If you swap this question afterwards, the removal is lost.`}
        confirmLabel="Remove 2"
        onCancel={() => setConfirmRemoveOpen(false)}
        onConfirm={handleRemoveTwo}
      />
    </>
  );
}
