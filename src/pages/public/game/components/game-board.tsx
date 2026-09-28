import type { GameTeam, GameQuestion } from 'src/types/game';

import { useMemo } from 'react';

import Box from '@mui/material/Box';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { BoardCell } from 'src/pages/public/components/board-cell';
import type { TeamTone } from 'src/pages/public/components/sj-tokens';

// ----------------------------------------------------------------------
// The 4x4 board grid — see project/components/ScreenGameBoard/README.md
// and project/components/BoardCell/README.md.
// ----------------------------------------------------------------------

const MARKS = [10, 20, 30, 40];

type Props = {
  questions: GameQuestion[];
  teams: GameTeam[];
  interactive: boolean;
  onCellClick: (question: GameQuestion) => void;
};

export function GameBoard({ questions, teams, interactive, onCellClick }: Props) {
  const columns = useMemo(() => {
    const seen = new Map<number, string>();
    questions.forEach((question) => {
      if (!seen.has(question.subCategoryId)) seen.set(question.subCategoryId, question.subCategoryName);
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [questions]);

  const toneByTeamId = useMemo(() => {
    const map = new Map<number, TeamTone>();
    teams.forEach((team, index) => map.set(team.id, index === 0 ? 'a' : 'b'));
    return map;
  }, [teams]);

  const cellFor = (subCategoryId: number, marks: number) =>
    questions.find((question) => question.subCategoryId === subCategoryId && question.marks === marks);

  if (columns.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: sj.space3,
        }}
      >
        {Array.from({ length: 16 }).map((_, index) => (
          <BoardCell key={index} mark={0} loading />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gap: sj.space3,
          mb: '8px',
        }}
      >
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              ...sjText.label,
              textAlign: 'center',
              color: sj.inkMuted,
              pb: '8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {column.name}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: sj.space3,
        }}
      >
        {MARKS.map((mark) =>
          columns.map((column) => {
            const question = cellFor(column.id, mark);
            if (!question) return <Box key={`${column.id}-${mark}`} />;

            const solved = question.solvedByTeamId != null;
            const solvedTone = solved ? toneByTeamId.get(question.solvedByTeamId!) ?? null : null;
            const disabled = solved || !interactive;

            return (
              <BoardCell
                key={question.id}
                mark={mark}
                solvedTone={solvedTone}
                disabled={disabled}
                onClick={() => !disabled && onCellClick(question)}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
}
