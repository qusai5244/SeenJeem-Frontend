import type { Category } from 'src/types/game';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';

import { QuestionType } from 'src/types/game';
import { addQuestion, getCategories } from 'src/actions/game';
import { toast } from 'src/components/snackbar';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { ContentCard } from 'src/pages/public/components/sj-card';
import { FullScreenLoading } from 'src/pages/public/components/feedback-states';
import { IconPlus, IconAlertCircle } from 'src/pages/public/components/icons';

// ----------------------------------------------------------------------
// ScreenAddQuestion — a single contribution form.
// See project/components/ScreenAddQuestion/README.md.
// ----------------------------------------------------------------------
// Mirrors backend/Helpers/Constants.cs QuestionMarks — the board only ever
// uses these four values, so submissions outside this set are rejected.
const MARKS = [10, 20, 30, 40];
const MAX_OPTIONS = 6;

type OptionDraft = { answer: string; isCorrect: boolean };

const emptyMultipleChoiceOptions = (): OptionDraft[] => [
  { answer: '', isCorrect: false },
  { answer: '', isCorrect: false },
  { answer: '', isCorrect: false },
  { answer: '', isCorrect: false },
];

const trueFalseOptions = (): OptionDraft[] => [
  { answer: 'True', isCorrect: false },
  { answer: 'False', isCorrect: false },
];

const controlSx = {
  width: 1,
  bgcolor: sj.surface200,
  borderRadius: sj.radiusSm,
  border: 0,
  px: '14px',
  py: '11px',
  fontFamily: 'inherit',
  fontSize: 14,
  color: sj.ink,
  outline: 'none',
  '&::placeholder': { color: sj.inkFaint },
};

function fieldBoxShadow(hasError: boolean) {
  return `inset 0 0 0 1.5px ${hasError ? sj.danger : sj.controlBorder}`;
}

function FieldError({ message }: { message: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '6px', fontSize: 12, color: sj.danger }}>
      <IconAlertCircle size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} />
      {message}
    </Box>
  );
}

function Field({
  id,
  label,
  error,
  fieldRef,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  fieldRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <Box ref={fieldRef}>
      <Box component="label" htmlFor={id} sx={{ ...sjText.label, display: 'block', color: sj.inkMuted, fontSize: 11, mb: '6px' }}>
        {label}
      </Box>
      {children}
      {error && <FieldError message={error} />}
    </Box>
  );
}

export default function AddQuestionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [subCategoryId, setSubCategoryId] = useState<number | ''>('');
  const [mark, setMark] = useState<number | ''>('');
  const [type, setType] = useState<QuestionType>(QuestionType.MultipleChoice);
  const [title, setTitle] = useState('');
  const [hint, setHint] = useState('');
  const [options, setOptions] = useState<OptionDraft[]>(emptyMultipleChoiceOptions());
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const categoryFieldRef = useRef<HTMLDivElement>(null);
  const subCategoryFieldRef = useRef<HTMLDivElement>(null);
  const markFieldRef = useRef<HTMLDivElement>(null);
  const titleFieldRef = useRef<HTMLDivElement>(null);
  const optionsFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCategories();
        setCategories(response.data ?? []);
      } catch {
        toast.error('Failed to load categories.');
      } finally {
        setCategoriesLoading(false);
      }
    })();
  }, []);

  const selectedCategory = categories.find((category) => category.id === categoryId);

  const handleCategoryChange = useCallback((value: number | '') => {
    setCategoryId(value);
    setSubCategoryId('');
  }, []);

  const handleTypeChange = useCallback((value: QuestionType) => {
    setType(value);
    setOptions(value === QuestionType.TrueFalse ? trueFalseOptions() : emptyMultipleChoiceOptions());
  }, []);

  const handleOptionAnswerChange = useCallback((index: number, answer: string) => {
    setOptions((prev) => prev.map((option, i) => (i === index ? { ...option, answer } : option)));
  }, []);

  const handleOptionCorrectChange = useCallback((index: number) => {
    setOptions((prev) => prev.map((option, i) => ({ ...option, isCorrect: i === index })));
  }, []);

  const handleAddOption = useCallback(() => {
    setOptions((prev) => (prev.length >= MAX_OPTIONS ? prev : [...prev, { answer: '', isCorrect: false }]));
  }, []);

  const handleRemoveOption = useCallback((index: number) => {
    setOptions((prev) => (prev.length <= 2 ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  const filledOptions = useMemo(() => options.filter((option) => option.answer.trim() !== ''), [options]);
  const correctCount = filledOptions.filter((option) => option.isCorrect).length;

  const categoryError = attempted && !categoryId ? 'Pick a category.' : undefined;
  const subCategoryError = attempted && categoryId && !subCategoryId ? 'Pick a subcategory.' : undefined;
  const markError = attempted && !mark ? 'Pick a point value.' : undefined;
  const titleError = attempted && !title.trim() ? 'The question needs a title.' : undefined;
  const optionsError =
    attempted && filledOptions.length < 2
      ? 'Add at least 2 options.'
      : attempted && correctCount === 0
        ? 'Mark one option as correct.'
        : attempted && correctCount > 1
          ? 'Only one option can be correct.'
          : undefined;

  const canSubmit = !!title.trim() && !!subCategoryId && !!mark && filledOptions.length >= 2 && correctCount === 1;

  const resetForm = useCallback(() => {
    setTitle('');
    setHint('');
    setMark('');
    setOptions(type === QuestionType.TrueFalse ? trueFalseOptions() : emptyMultipleChoiceOptions());
    setAttempted(false);
  }, [type]);

  const submit = useCallback(async () => {
    if (!subCategoryId || !mark) return;

    setSubmitting(true);

    try {
      await addQuestion({
        title: title.trim(),
        hint: hint.trim() || undefined,
        mark,
        type,
        questionSubCategoryId: subCategoryId,
        options: filledOptions.map((option) => ({ answer: option.answer.trim(), isCorrect: option.isCorrect })),
      });

      toast.success('Added to the bank — form cleared.');
      resetForm();
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to add the question.');
    } finally {
      setSubmitting(false);
    }
  }, [subCategoryId, mark, title, hint, type, filledOptions, resetForm]);

  const handleSubmitClick = useCallback(() => {
    if (canSubmit) {
      submit();
      return;
    }

    setAttempted(true);

    const firstInvalid = !categoryId
      ? categoryFieldRef
      : !subCategoryId
        ? subCategoryFieldRef
        : !mark
          ? markFieldRef
          : !title.trim()
            ? titleFieldRef
            : optionsFieldRef;

    firstInvalid.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [canSubmit, categoryId, subCategoryId, mark, title, submit]);

  return (
    <>
      <Helmet>
        <title>Add a question — SeenJeem</title>
      </Helmet>

      <Box sx={{ maxWidth: 480, mx: 'auto', width: 1, px: 3, py: { xs: sj.space6, sm: sj.space7 }, pb: { xs: 8, sm: 10 } }}>
        <Box component="h1" sx={{ ...sjText.displayLg, m: 0, mb: sj.space2 }}>
          Add a question
        </Box>
        <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, mb: sj.space6 }}>
          New questions go straight into the shared bank.
        </Box>

        {categoriesLoading ? (
          <FullScreenLoading />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: sj.space5 }}>
            <ContentCard>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', mb: sj.space4 }}>
                <Field id="aq-category" label="Category" error={categoryError} fieldRef={categoryFieldRef}>
                  <Box
                    id="aq-category"
                    component="select"
                    value={categoryId}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      handleCategoryChange(event.target.value ? Number(event.target.value) : '')
                    }
                    sx={{ ...controlSx, boxShadow: fieldBoxShadow(!!categoryError) }}
                  >
                    <option value="">Select…</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Box>
                </Field>

                <Field id="aq-subcategory" label="Subcategory" error={subCategoryError} fieldRef={subCategoryFieldRef}>
                  <Box
                    id="aq-subcategory"
                    component="select"
                    value={subCategoryId}
                    disabled={!selectedCategory}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setSubCategoryId(event.target.value ? Number(event.target.value) : '')
                    }
                    sx={{ ...controlSx, boxShadow: fieldBoxShadow(!!subCategoryError), opacity: selectedCategory ? 1 : 0.5 }}
                  >
                    <option value="">Select…</option>
                    {selectedCategory?.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </Box>
                </Field>

                <Field id="aq-mark" label="Points" error={markError} fieldRef={markFieldRef}>
                  <Box
                    id="aq-mark"
                    component="select"
                    value={mark}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setMark(event.target.value ? Number(event.target.value) : '')
                    }
                    sx={{ ...controlSx, boxShadow: fieldBoxShadow(!!markError) }}
                  >
                    <option value="">Select…</option>
                    {MARKS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Box>
                </Field>
              </Box>

              <Box sx={{ ...sjText.label, color: sj.inkMuted, fontSize: 11, mb: '6px' }}>Format</Box>
              <Box sx={{ display: 'flex', bgcolor: sj.surface200, borderRadius: sj.radiusSm, p: '3px' }}>
                {[QuestionType.MultipleChoice, QuestionType.TrueFalse].map((option) => (
                  <Box
                    key={option}
                    component="button"
                    type="button"
                    onClick={() => handleTypeChange(option)}
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      py: '8px',
                      borderRadius: '8px',
                      border: 0,
                      fontFamily: 'inherit',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: type === option ? sj.accentInk : sj.inkMuted,
                      bgcolor: type === option ? sj.accent : 'transparent',
                    }}
                  >
                    {option === QuestionType.MultipleChoice ? 'Multiple choice' : 'True / False'}
                  </Box>
                ))}
              </Box>
            </ContentCard>

            <ContentCard>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: sj.space4 }}>
                <Field id="aq-title" label="Question" error={titleError} fieldRef={titleFieldRef}>
                  <Box
                    id="aq-title"
                    component="textarea"
                    rows={2}
                    placeholder="What do you want to ask?"
                    value={title}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setTitle(event.target.value)}
                    sx={{ ...controlSx, resize: 'vertical', boxShadow: fieldBoxShadow(!!titleError) }}
                  />
                </Field>
                <Field id="aq-hint" label="Hint (optional)">
                  <Box
                    id="aq-hint"
                    component="textarea"
                    rows={2}
                    placeholder="A nudge in the right direction"
                    value={hint}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setHint(event.target.value)}
                    sx={{ ...controlSx, resize: 'vertical', boxShadow: fieldBoxShadow(false) }}
                  />
                </Field>
              </Box>
            </ContentCard>

            <ContentCard>
              <Box ref={optionsFieldRef} sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: sj.space4, flexWrap: 'wrap', gap: '8px' }}>
                <Box sx={{ ...sjText.label, color: sj.inkMuted, fontSize: 11 }}>Answer options — mark the correct one</Box>
                {type === QuestionType.MultipleChoice && (
                  <SjButton sjVariant="ghost" onClick={handleAddOption} disabled={options.length >= MAX_OPTIONS} startIcon={<IconPlus size={13} strokeWidth={2.5} />}>
                    Add option
                  </SjButton>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {options.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Box
                      component="button"
                      type="button"
                      title="Mark as correct"
                      onClick={() => handleOptionCorrectChange(index)}
                      sx={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: '999px',
                        border: 0,
                        cursor: 'pointer',
                        boxShadow: option.isCorrect ? 'none' : `inset 0 0 0 1.5px ${sj.controlBorder}`,
                        bgcolor: option.isCorrect ? sj.success : 'transparent',
                        position: 'relative',
                        '&::after': option.isCorrect
                          ? { content: '""', position: 'absolute', inset: 5, borderRadius: '999px', bgcolor: sj.successInk }
                          : undefined,
                      }}
                    />
                    {type === QuestionType.TrueFalse ? (
                      <Box sx={{ flex: 1, fontSize: 14 }}>{option.answer}</Box>
                    ) : (
                      <Box
                        component="input"
                        placeholder={`Option ${index + 1}`}
                        value={option.answer}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOptionAnswerChange(index, event.target.value)}
                        sx={{ ...controlSx, flex: 1, boxShadow: fieldBoxShadow(false) }}
                      />
                    )}
                    {type === QuestionType.MultipleChoice && (
                      <SjButton
                        sjVariant="ghost"
                        title="Remove option"
                        disabled={options.length <= 2}
                        onClick={() => handleRemoveOption(index)}
                        sx={{ width: 30, height: 30, px: 0, fontSize: 16 }}
                      >
                        ×
                      </SjButton>
                    )}
                  </Box>
                ))}
              </Box>
              {optionsError && <FieldError message={optionsError} />}
            </ContentCard>

            <SjButton sjVariant="primary" sjSize="large" fullWidth disabled={submitting} onClick={handleSubmitClick}>
              {submitting ? 'Submitting…' : 'Add question'}
            </SjButton>
          </Box>
        )}
      </Box>
    </>
  );
}
