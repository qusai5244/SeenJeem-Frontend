import { useState } from 'react';

import Box from '@mui/material/Box';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { PlayerChip } from 'src/pages/public/components/player-chip';
import { IconPlus, IconShuffle } from 'src/pages/public/components/icons';

// ----------------------------------------------------------------------
// ScreenNewGameTeams — step 1 of the wizard.
// See project/components/ScreenNewGameTeams/README.md.
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
  bgcolor: sj.surface200,
  boxShadow: `inset 0 0 0 1.5px ${sj.controlBorder}`,
  borderRadius: sj.radiusSm,
  border: 0,
  px: '14px',
  py: '11px',
  fontFamily: 'inherit',
  fontSize: 14,
  color: sj.ink,
  outline: 'none',
  '&::placeholder': { color: sj.inkFaint },
  '&:focus-visible': { boxShadow: `inset 0 0 0 1.5px ${sj.focus}` },
};

const labelSx = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: sj.inkMuted, mb: '6px' };

function TeamColumn({
  title,
  tone,
  team,
  otherLabel,
  onNameChange,
  onDragOver,
  onDrop,
  children,
}: {
  title: string;
  tone: 'a' | 'b';
  team: TeamDraft;
  otherLabel: string;
  onNameChange: (name: string) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  children: React.ReactNode;
}) {
  const main = tone === 'a' ? sj.teamA : sj.teamB;

  return (
    <Box
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{ bgcolor: sj.surface100, borderRadius: sj.radiusLg, p: sj.space4, minHeight: 180, display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: sj.space4, gap: sj.space2 }}>
        <Box
          component="input"
          aria-label={`${title} name`}
          value={team.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
          sx={{
            background: 'transparent',
            border: 0,
            fontFamily: sjText.displayMd.fontFamily,
            fontSize: 16,
            fontWeight: 700,
            color: main,
            width: 1,
            minWidth: 0,
            p: 0,
            outline: 'none',
          }}
        />
        <Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: sj.inkFaint, flexShrink: 0 }}>
          {team.players.length}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignContent: 'flex-start' }}>
        {team.players.length === 0 ? (
          <Box
            sx={{
              width: 1,
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              borderRadius: sj.radiusMd,
              border: `1.5px dashed ${sj.hairline}`,
              color: sj.inkFaint,
              fontSize: 12,
              px: sj.space2,
            }}
          >
            Drag players here, or use {otherLabel}.
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}

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

  const team1Name = team1.name.trim();
  const team2Name = team2.name.trim();

  let helper = `${team1.players.length} vs ${team2.players.length} players — ready.`;
  if (!team1Name || !team2Name) helper = 'Give both teams a name to continue.';
  else if (team1Name.toLowerCase() === team2Name.toLowerCase()) helper = 'Team names must be different.';
  else if (!team1.players.length) helper = `Add at least one player to ${team1Name || 'Team 1'}.`;
  else if (!team2.players.length) helper = `Add at least one player to ${team2Name || 'Team 2'}.`;

  return (
    <Box component="section">
      <Box component="h1" sx={{ ...sjText.displayLg, m: 0, mb: sj.space2 }}>
        Build your teams
      </Box>
      <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, mb: sj.space6 }}>
        Add everyone playing, then split into two teams.
      </Box>

      <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mb: sj.space6 }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Box
            component="input"
            placeholder="Player name"
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
        <SjButton sjVariant="secondary" onClick={handleAdd} startIcon={<IconPlus size={14} strokeWidth={2.5} />}>
          Add
        </SjButton>
        <SjButton sjVariant="outline" onClick={onShuffleAndSplit} startIcon={<IconShuffle size={14} strokeWidth={2.5} />}>
          Shuffle &amp; split
        </SjButton>
      </Box>

      <Box
        onDragOver={(event: React.DragEvent) => event.preventDefault()}
        onDrop={handleDrop('unassigned')}
        sx={{ bgcolor: sj.surface100, borderRadius: sj.radiusLg, p: sj.space4, mb: sj.space4 }}
      >
        <Box sx={labelSx}>Unassigned · {unassigned.length}</Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {unassigned.map((name) => (
            <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlayerChip name={name} draggable onDragStart={dragStart(name, 'unassigned')} />
              <SjButton sjVariant="ghost" onClick={() => onAssignMember(name, 1)} sx={{ fontSize: 10, px: '6px', py: '4px' }}>
                → 1
              </SjButton>
              <SjButton sjVariant="ghost" onClick={() => onAssignMember(name, 2)} sx={{ fontSize: 10, px: '6px', py: '4px' }}>
                → 2
              </SjButton>
            </Box>
          ))}
          {unassigned.length === 0 && (
            <Box sx={{ fontSize: 13, color: sj.inkFaint }}>Everyone is on a team.</Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: sj.space4, mb: sj.space5 }}>
        <TeamColumn
          title="Team 1 name"
          tone="a"
          team={team1}
          otherLabel="Shuffle & split"
          onNameChange={(name) => onTeamNameChange(1, name)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop(1)}
        >
          {team1.players.map((name) => (
            <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PlayerChip
                name={name}
                tone="a"
                draggable
                onDragStart={dragStart(name, 1)}
                onRemove={() => onUnassignMember(name, 1)}
              />
            </Box>
          ))}
        </TeamColumn>

        <TeamColumn
          title="Team 2 name"
          tone="b"
          team={team2}
          otherLabel="Shuffle & split"
          onNameChange={(name) => onTeamNameChange(2, name)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop(2)}
        >
          {team2.players.map((name) => (
            <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PlayerChip
                name={name}
                tone="b"
                draggable
                onDragStart={dragStart(name, 2)}
                onRemove={() => onUnassignMember(name, 2)}
              />
            </Box>
          ))}
        </TeamColumn>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: sj.space4, flexWrap: 'wrap' }}>
        <Box sx={{ fontSize: 12, color: canProceed ? sj.success : sj.danger }}>{helper}</Box>
        <SjButton sjVariant="primary" disabled={!canProceed} onClick={onNext}>
          Continue
        </SjButton>
      </Box>
    </Box>
  );
}
