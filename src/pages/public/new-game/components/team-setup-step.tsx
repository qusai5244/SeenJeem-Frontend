import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';

// ----------------------------------------------------------------------

export type TeamDraft = {
  name: string;
  players: string[];
};

type Props = {
  unassigned: string[];
  team1: TeamDraft;
  team2: TeamDraft;
  onAddMember: (name: string) => void;
  onAssignMember: (name: string, team: 1 | 2) => void;
  onUnassignMember: (name: string, team: 1 | 2) => void;
  onTeamNameChange: (team: 1 | 2, name: string) => void;
  onShuffleAndSplit: () => void;
  canProceed: boolean;
  onNext: () => void;
};

type Zone = 'unassigned' | 1 | 2;

const inputSx = {
  width: 1,
  minHeight: 44,
  fontFamily: sjFont.body,
  fontSize: 14,
  color: sjColor.text,
  bgcolor: sjColor.surface,
  border: '1px solid',
  borderColor: sjColor.divider,
  borderRadius: 0,
  px: 1.25,
  outline: 'none',
  '&:hover': { borderColor: 'rgba(29,31,32,0.45)' },
  '&:focus-visible': { borderColor: sjColor.accent },
};

export function TeamSetupStep({
  unassigned,
  team1,
  team2,
  onAddMember,
  onAssignMember,
  onUnassignMember,
  onTeamNameChange,
  onShuffleAndSplit,
  canProceed,
  onNext,
}: Props) {
  const [memberName, setMemberName] = useState('');
  const [drag, setDrag] = useState<{ name: string; source: Zone } | null>(null);

  const handleAdd = () => {
    const trimmed = memberName.trim();
    if (!trimmed) return;
    onAddMember(trimmed);
    setMemberName('');
  };

  const moveTo = (name: string, source: Zone, dest: Zone) => {
    if (source === dest) return;
    // Team-to-team drags need an explicit unassign first — assigning alone only
    // guarantees removal from the unassigned pool, not from the other team.
    if (source !== 'unassigned') onUnassignMember(name, source);
    if (dest !== 'unassigned') onAssignMember(name, dest);
  };

  const handleDrop = (dest: Zone) => (event: React.DragEvent) => {
    event.preventDefault();
    if (drag) moveTo(drag.name, drag.source, dest);
    setDrag(null);
  };

  const dragStart = (name: string, source: Zone) => (event: React.DragEvent) => {
    setDrag({ name, source });
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', name);
  };

  let hint = 'Ready.';
  if (!team1.name.trim() || !team2.name.trim()) hint = 'Both teams need a name.';
  else if (team1.name.trim().toLowerCase() === team2.name.trim().toLowerCase())
    hint = 'Team names must be different.';
  else if (!team1.players.length || !team2.players.length) hint = 'Each team needs at least one player.';
  const ready = hint === 'Ready.';

  return (
    <Box component="section">
      <Stack direction="row" spacing={1.75} flexWrap="wrap" alignItems="flex-end" sx={{ mb: 2.75 }}>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Typography component="label" htmlFor="sj-player" sx={{ display: 'block', fontSize: 12, mb: 0.625, color: 'rgba(29,31,32,0.7)' }}>
            Add players
          </Typography>
          <Box
            id="sj-player"
            component="input"
            placeholder="Type a name, press Enter"
            value={memberName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMemberName(event.target.value)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleAdd();
              }
            }}
            sx={inputSx}
          />
        </Box>
        <SjButton sjVariant="secondary" onClick={handleAdd}>
          Add
        </SjButton>
        <SjButton sjVariant="primary" onClick={onShuffleAndSplit} sx={{ px: 2.75 }}>
          Shuffle &amp; split
        </SjButton>
      </Stack>

      <BlueprintFrame
        sx={{ p: 2, mb: 3.25, minHeight: 74 }}
        onDragOver={(event: React.DragEvent) => event.preventDefault()}
        onDrop={handleDrop('unassigned')}
      >
        <Typography sx={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: sjColor.neutral600, mb: 1.25 }}>
          Unassigned · {unassigned.length}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {unassigned.map((name) => (
            <Stack
              key={name}
              direction="row"
              alignItems="center"
              spacing={0.75}
              draggable
              onDragStart={dragStart(name, 'unassigned')}
              sx={{ pl: 1.5, py: 0.75, border: '1px solid', borderColor: sjColor.divider, bgcolor: sjColor.bg, cursor: 'grab', fontSize: 14 }}
            >
              <Typography sx={{ fontSize: 14 }}>{name}</Typography>
              <SjButton
                sjVariant="secondary"
                title="Move to team 1"
                onClick={() => onAssignMember(name, 1)}
                sx={{ minHeight: 'auto', width: 26, height: 26, minWidth: 26, p: 0, fontSize: 12, ml: 0.5 }}
              >
                1
              </SjButton>
              <SjButton
                sjVariant="secondary"
                title="Move to team 2"
                onClick={() => onAssignMember(name, 2)}
                sx={{ minHeight: 'auto', width: 26, height: 26, minWidth: 26, p: 0, fontSize: 12, mr: 0.75 }}
              >
                2
              </SjButton>
            </Stack>
          ))}
          {unassigned.length === 0 && (
            <Typography sx={{ fontSize: 13, color: sjColor.neutral500 }}>
              Everyone is on a team. Drag a chip back here to unassign.
            </Typography>
          )}
        </Stack>
      </BlueprintFrame>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2.5 }}>
        {([1, 2] as const).map((teamNumber) => {
          const team = teamNumber === 1 ? team1 : team2;
          const otherTeam = teamNumber === 1 ? 2 : 1;

          return (
            <BlueprintFrame
              key={teamNumber}
              sx={{ p: 2.25 }}
              onDragOver={(event: React.DragEvent) => event.preventDefault()}
              onDrop={handleDrop(teamNumber)}
            >
              <Box sx={{ mb: 1.75 }}>
                <Typography
                  component="label"
                  htmlFor={`sj-t${teamNumber}`}
                  sx={{ display: 'block', fontSize: 12, mb: 0.625, color: 'rgba(29,31,32,0.7)' }}
                >
                  Team {teamNumber} name
                </Typography>
                <Box
                  id={`sj-t${teamNumber}`}
                  component="input"
                  value={team.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    onTeamNameChange(teamNumber, event.target.value)
                  }
                  sx={{ ...inputSx, fontFamily: sjFont.heading, fontSize: 19, minHeight: 42 }}
                />
              </Box>

              <Stack spacing={1} sx={{ minHeight: 90 }}>
                {team.players.map((name) => (
                  <Stack
                    key={name}
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                    draggable
                    onDragStart={dragStart(name, teamNumber)}
                    sx={{
                      px: 1.25,
                      py: 1,
                      border: '1px solid',
                      borderColor: sjColor.accent300,
                      bgcolor: sjColor.accent100,
                      cursor: 'grab',
                      fontSize: 14,
                    }}
                  >
                    <Typography sx={{ flex: 1, fontSize: 14 }}>{name}</Typography>
                    <SjButton
                      sjVariant="ghost"
                      onClick={() => onAssignMember(name, otherTeam)}
                      sx={{ minHeight: 'auto', fontSize: 11, px: 0.75, py: 0.25 }}
                    >
                      {teamNumber === 1 ? '→ 2' : '1 ←'}
                    </SjButton>
                    <SjButton
                      sjVariant="ghost"
                      title="Unassign"
                      onClick={() => onUnassignMember(name, teamNumber)}
                      sx={{ minHeight: 'auto', fontSize: 14, px: 0.75, py: 0.25 }}
                    >
                      ×
                    </SjButton>
                  </Stack>
                ))}
                {team.players.length === 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      flex: 1,
                      minHeight: 70,
                      border: '1px dashed',
                      borderColor: sjColor.divider,
                      fontSize: 13,
                      color: sjColor.neutral500,
                    }}
                  >
                    Drop players here
                  </Box>
                )}
              </Stack>
            </BlueprintFrame>
          );
        })}
      </Box>

      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" sx={{ mt: 3.25 }}>
        <SjButton sjVariant="primary" disabled={!canProceed} onClick={onNext} sx={{ px: 4 }}>
          Next — category
        </SjButton>
        <Typography sx={{ fontSize: 13, color: ready ? sjColor.accent700 : sjColor.neutral600 }}>
          {ready ? `${team1.players.length} vs ${team2.players.length} players — ready.` : hint}
        </Typography>
      </Stack>
    </Box>
  );
}
