import type { Category } from 'src/types/game';

import Box from '@mui/material/Box';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { AvailabilityBadge } from 'src/pages/public/components/badge';
import { SelectableCard } from 'src/pages/public/components/sj-card';
import { FullScreenLoading } from 'src/pages/public/components/feedback-states';
import { IconLock } from 'src/pages/public/components/icons';

// ----------------------------------------------------------------------
// ScreenNewGameCategoryBoard — step 2 of the wizard.
// See project/components/ScreenNewGameCategoryBoard/README.md.
// ----------------------------------------------------------------------

type Props = {
  categories: Category[];
  loading: boolean;
  selectedCategoryId: number | null;
  selectedSubCategoryIds: number[];
  onSelectCategory: (categoryId: number) => void;
  onClearCategory: () => void;
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
  onClearCategory,
  onToggleSubCategory,
  creating,
  canCreate,
  onBack,
  onCreate,
}: Props) {
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

  if (loading) return <FullScreenLoading />;

  return (
    <Box component="section">
      <Box component="h1" sx={{ ...sjText.displayLg, m: 0, mb: sj.space2 }}>
        Pick your board
      </Box>
      <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, mb: sj.space6 }}>
        Choose a category, then exactly four subcategories to build the 4×4 board.
      </Box>

      {!selectedCategory && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: sj.space4 }}>
          {categories.map((category) => {
            const availableCount = category.subCategories.filter((sub) => sub.isAvailable).length;
            const ready = availableCount >= 4;

            return (
              <SelectableCard
                key={category.id}
                title={category.name}
                icon={<IconLock size={20} />}
                disabled={!ready}
                onClick={() => onSelectCategory(category.id)}
                badge={<AvailabilityBadge ready={ready} label={`${availableCount} of 4 ready`} />}
              />
            );
          })}
        </Box>
      )}

      {selectedCategory && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              bgcolor: sj.surface100,
              borderRadius: sj.radiusLg,
              px: sj.space5,
              py: sj.space4,
              mb: sj.space6,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: sj.radiusSm,
                bgcolor: sj.surface300,
                color: sj.brand,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconLock size={17} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ ...sjText.displayMd, fontSize: 15 }}>{selectedCategory.name}</Box>
              <Box sx={{ fontSize: 12, color: sj.inkMuted }}>
                {selectedCategory.subCategories.filter((sub) => sub.isAvailable).length} subcategories ready
              </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
            <SjButton sjVariant="ghost" onClick={onClearCategory}>
              Change
            </SjButton>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: sj.space4, mb: sj.space6 }}>
            {selectedCategory.subCategories.map((sub) => {
              const checked = selectedSubCategoryIds.includes(sub.id);
              const full = selectedSubCategoryIds.length >= 4 && !checked;
              const disabled = !sub.isAvailable || full;

              return (
                <SelectableCard
                  key={sub.id}
                  size="small"
                  title={sub.name}
                  selected={checked}
                  disabled={disabled}
                  onClick={() => onToggleSubCategory(sub.id)}
                  badge={
                    <Box sx={{ fontSize: 11, color: sj.inkMuted }}>
                      {!sub.isAvailable ? 'Unavailable' : checked ? `Column ${selectedSubCategoryIds.indexOf(sub.id) + 1}` : 'Ready'}
                    </Box>
                  }
                />
              );
            })}
          </Box>
        </>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: sj.space4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: sj.space4 }}>
          <SjButton sjVariant="outline" onClick={onBack}>
            Back
          </SjButton>
          {selectedCategory && (
            <Box sx={{ fontSize: 13, fontWeight: 700, color: selectedSubCategoryIds.length === 4 ? sj.success : sj.inkMuted }}>
              {selectedSubCategoryIds.length} of 4 selected
            </Box>
          )}
        </Box>
        <SjButton sjVariant="primary" sjSize="large" disabled={!canCreate || creating} onClick={onCreate}>
          {creating ? 'Building your board…' : 'Create game'}
        </SjButton>
      </Box>
    </Box>
  );
}
