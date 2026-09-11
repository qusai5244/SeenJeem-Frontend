import type { TeamDraft } from './components/team-setup-step';

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createGame, getCategories } from 'src/actions/game';
import type { Category } from 'src/types/game';
import { toast } from 'src/components/snackbar';

import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';

import { TeamSetupStep } from './components/team-setup-step';
import { CategoryBoardStep } from './components/category-board-step';

// ----------------------------------------------------------------------

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function StepBadge({ n, label, active }: { n: number; label: string; active: boolean }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 30,
          height: 30,
          fontFamily: sjFont.heading,
          fontWeight: 600,
          fontSize: 15,
          bgcolor: active ? sjColor.accent : 'transparent',
          color: active ? sjColor.bg : sjColor.accent800,
          border: '1px solid',
          borderColor: sjColor.accent,
        }}
      >
        {n}
      </Box>
      <Typography
        sx={{
          fontFamily: sjFont.heading,
          fontWeight: 600,
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: '.04em',
          color: active ? sjColor.text : sjColor.neutral600,
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function NewGamePage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — team setup
  const [unassigned, setUnassigned] = useState<string[]>([]);
  const [team1, setTeam1] = useState<TeamDraft>({ name: 'Team 1', players: [] });
  const [team2, setTeam2] = useState<TeamDraft>({ name: 'Team 2', players: [] });

  // Step 2 — category & board
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<number[]>([]);

  const [creating, setCreating] = useState(false);

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

  const handleAddMember = useCallback((name: string) => {
    setUnassigned((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const handleAssignMember = useCallback((name: string, team: 1 | 2) => {
    setUnassigned((prev) => prev.filter((member) => member !== name));
    const setTeam = team === 1 ? setTeam1 : setTeam2;
    setTeam((prev) => (prev.players.includes(name) ? prev : { ...prev, players: [...prev.players, name] }));
  }, []);

  const handleUnassignMember = useCallback((name: string, team: 1 | 2) => {
    const setTeam = team === 1 ? setTeam1 : setTeam2;
    setTeam((prev) => ({ ...prev, players: prev.players.filter((member) => member !== name) }));
    setUnassigned((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const handleTeamNameChange = useCallback((team: 1 | 2, name: string) => {
    const setTeam = team === 1 ? setTeam1 : setTeam2;
    setTeam((prev) => ({ ...prev, name }));
  }, []);

  const handleShuffleAndSplit = useCallback(() => {
    const everyone = shuffle([...unassigned, ...team1.players, ...team2.players]);
    const half = Math.ceil(everyone.length / 2);

    setUnassigned([]);
    setTeam1((prev) => ({ ...prev, players: everyone.slice(0, half) }));
    setTeam2((prev) => ({ ...prev, players: everyone.slice(half) }));
    toast.success('Teams shuffled');
  }, [unassigned, team1.players, team2.players]);

  const team1Name = team1.name.trim();
  const team2Name = team2.name.trim();

  const canProceedStep1 =
    !!team1Name &&
    !!team2Name &&
    team1Name.toLowerCase() !== team2Name.toLowerCase() &&
    team1.players.length >= 1 &&
    team2.players.length >= 1;

  const handleSelectCategory = useCallback((categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryIds([]);
  }, []);

  const handleToggleSubCategory = useCallback((subCategoryId: number) => {
    setSelectedSubCategoryIds((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : prev.length < 4
          ? [...prev, subCategoryId]
          : prev
    );
  }, []);

  const canCreateGame = !!selectedCategoryId && selectedSubCategoryIds.length === 4;

  const handleCreateGame = useCallback(async () => {
    if (!selectedCategoryId || !canCreateGame) return;

    setCreating(true);

    try {
      const response = await createGame({
        teamInput: {
          teams: [
            { name: team1Name, players: team1.players },
            { name: team2Name, players: team2.players },
          ],
        },
        categoryId: selectedCategoryId,
        subCategoryIds: selectedSubCategoryIds,
      });

      if (response.data) {
        toast.success(`Game created — code ${response.data.code}`);
        router.push(paths.public.game(response.data.code));
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to create the game.');
    } finally {
      setCreating(false);
    }
  }, [
    selectedCategoryId,
    canCreateGame,
    team1Name,
    team2Name,
    team1.players,
    team2.players,
    selectedSubCategoryIds,
    router,
  ]);

  return (
    <>
      <Helmet>
        <title>New Game — SeenJeem</title>
      </Helmet>

      <Box sx={{ maxWidth: 1120, mx: 'auto', width: 1, px: 3, py: 3.5, pb: 13.75 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" sx={{ mb: 3.25 }}>
          <StepBadge n={1} label="Teams" active={step === 1} />
          <Box sx={{ flex: 1, minWidth: 24, height: '1px', bgcolor: sjColor.divider }} />
          <StepBadge n={2} label="Category & board" active={step === 2} />
        </Stack>

        {step === 1 && (
          <TeamSetupStep
            unassigned={unassigned}
            team1={team1}
            team2={team2}
            onAddMember={handleAddMember}
            onAssignMember={handleAssignMember}
            onUnassignMember={handleUnassignMember}
            onTeamNameChange={handleTeamNameChange}
            onShuffleAndSplit={handleShuffleAndSplit}
            canProceed={canProceedStep1}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <CategoryBoardStep
            categories={categories}
            loading={categoriesLoading}
            selectedCategoryId={selectedCategoryId}
            selectedSubCategoryIds={selectedSubCategoryIds}
            onSelectCategory={handleSelectCategory}
            onToggleSubCategory={handleToggleSubCategory}
            creating={creating}
            canCreate={canCreateGame}
            onBack={() => setStep(1)}
            onCreate={handleCreateGame}
          />
        )}
      </Box>
    </>
  );
}
