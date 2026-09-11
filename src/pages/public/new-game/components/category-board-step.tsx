import type { Category } from 'src/types/game';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';

// ----------------------------------------------------------------------

type Props = {
  categories: Category[];
  loading: boolean;
  selectedCategoryId: number | null;
  selectedSubCategoryIds: number[];
  onSelectCategory: (categoryId: number) => void;
  onToggleSubCategory: (subCategoryId: number) => void;
  creating: boolean;
  canCreate: boolean;
  onBack: () => void;
  onCreate: () => void;
};

export function CategoryBoardStep({
  categories,
  loading,
  selectedCategoryId,
  selectedSubCategoryIds,
  onSelectCategory,
  onToggleSubCategory,
  creating,
  canCreate,
  onBack,
  onCreate,
}: Props) {
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

  const step2Hint =
    selectedCategoryId == null
      ? 'Pick a category first.'
      : selectedSubCategoryIds.length === 4
        ? 'Board ready — 16 questions.'
        : 'Choose exactly 4 subcategories.';

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 7.5, color: sjColor.neutral600, fontSize: 14 }}>
        <Box
          sx={{
            width: 18,
            height: 18,
            border: '2px solid',
            borderColor: sjColor.accent300,
            borderTopColor: sjColor.accent,
            borderRadius: '50%',
            animation: 'sj-spin .8s linear infinite',
          }}
        />
        Loading categories…
      </Stack>
    );
  }

  return (
    <Box component="section">
      <Typography sx={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: '.06em', m: 0, mb: 0.5 }}>
        Choose a category
      </Typography>
      <Typography sx={{ m: 0, mb: 2, fontSize: 14, color: sjColor.neutral600 }}>
        Greyed categories don&apos;t have enough available questions right now.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.75, mb: 4.5 }}>
        {categories.map((category) => {
          const availableCount = category.subCategories.filter((sub) => sub.isAvailable).length;
          const disabled = availableCount < 4;
          const selected = category.id === selectedCategoryId;

          return (
            <BlueprintFrame
              key={category.id}
              component="button"
              onClick={() => !disabled && onSelectCategory(category.id)}
              cornerColor={selected ? sjColor.bg : undefined}
              sx={{
                textAlign: 'left',
                p: 2,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                bgcolor: selected ? sjColor.accent : 'transparent',
                color: selected ? sjColor.bg : sjColor.text,
                borderColor: selected ? sjColor.accent : sjColor.divider,
                fontFamily: sjFont.body,
              }}
              disabled={disabled}
            >
              <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 21, textTransform: 'uppercase', lineHeight: 1.1 }}>
                {category.name}
              </Typography>
              <Typography sx={{ fontSize: 12, mt: 0.75, opacity: 0.75 }}>
                {disabled ? 'Not enough subcategories yet' : `${availableCount} subcategories available`}
              </Typography>
            </BlueprintFrame>
          );
        })}
      </Box>

      {selectedCategory && (
        <Box sx={{ mb: 3.75 }}>
          <Stack direction="row" alignItems="baseline" spacing={1.5} flexWrap="wrap" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: '.06em', m: 0 }}>
              Pick 4 subcategories
            </Typography>
            <Box
              sx={{
                fontSize: 11,
                px: 1.25,
                py: 0.375,
                bgcolor: selectedSubCategoryIds.length === 4 ? sjColor.successBg : sjColor.surface,
                color: selectedSubCategoryIds.length === 4 ? sjColor.successText : sjColor.text,
              }}
            >
              {selectedSubCategoryIds.length} of 4 chosen
            </Box>
          </Stack>
          <Typography sx={{ m: 0, mb: 2, fontSize: 14, color: sjColor.neutral600 }}>
            Each one becomes a column on the board: 10, 20, 30 and 40 points.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 1.75 }}>
            {selectedCategory.subCategories.map((sub) => {
              const checked = selectedSubCategoryIds.includes(sub.id);
              const full = selectedSubCategoryIds.length >= 4 && !checked;
              const disabled = !sub.isAvailable || full;

              return (
                <BlueprintFrame
                  key={sub.id}
                  component="button"
                  onClick={() => !disabled && onToggleSubCategory(sub.id)}
                  cornerColor={checked ? sjColor.accent900 : undefined}
                  sx={{
                    textAlign: 'left',
                    p: 1.75,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: !sub.isAvailable ? 0.4 : full ? 0.55 : 1,
                    bgcolor: checked ? sjColor.accent100 : 'transparent',
                    color: checked ? sjColor.accent900 : sjColor.text,
                    borderColor: checked ? sjColor.accent : sjColor.divider,
                    fontFamily: sjFont.body,
                  }}
                  disabled={disabled}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        border: '1px solid currentColor',
                        opacity: checked ? 1 : 0.25,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 18, textTransform: 'uppercase' }}>
                      {sub.name}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 12, mt: 0.75, opacity: 0.7 }}>
                    {sub.isAvailable
                      ? checked
                        ? `Column ${selectedSubCategoryIds.indexOf(sub.id) + 1}`
                        : 'Questions ready'
                      : 'Unavailable'}
                  </Typography>
                </BlueprintFrame>
              );
            })}
          </Box>
        </Box>
      )}

      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
        <SjButton sjVariant="secondary" onClick={onBack} sx={{ px: 2.75 }}>
          Back
        </SjButton>
        <SjButton sjVariant="primary" disabled={!canCreate || creating} onClick={onCreate} sx={{ px: 4 }}>
          {creating ? 'Creating…' : 'Create game'}
        </SjButton>
        <Typography sx={{ fontSize: 13, color: sjColor.neutral600 }}>{step2Hint}</Typography>
      </Stack>
    </Box>
  );
}
