import type { GameTeam, GameQuestion } from 'src/types/game';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';

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
      if (!seen.has(question.subCategoryId)) {
        seen.set(question.subCategoryId, question.subCategoryName);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [questions]);

  const teamById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);

  const cellFor = (subCategoryId: number, marks: number) =>
    questions.find((question) => question.subCategoryId === subCategoryId && question.marks === marks);

  return (
    <Box sx={{ bgcolor: sjColor.accent900, p: { xs: 1.75, sm: 3.25 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gap: { xs: 1.25, sm: 2 },
        }}
      >
        {columns.map((column) => {
          const rows = MARKS.map((mark) => cellFor(column.id, mark));

          return (
            <Box key={column.id} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.25, sm: 2 } }}>
              <Typography
                sx={{
                  textAlign: 'center',
                  fontFamily: sjFont.heading,
                  fontWeight: 600,
                  fontSize: { xs: 15, sm: 19 },
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  color: '#f2f2f3',
                  pb: 1.25,
                  borderBottom: '1px solid rgba(242,242,243,.3)',
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                {column.name}
              </Typography>

              {rows.map((question, rowIndex) => {
                const mark = MARKS[rowIndex];

                if (!question) {
                  return (
                    <Box
                      key={mark}
                      sx={{ minHeight: { xs: 76, sm: 104 }, bgcolor: 'rgba(242,242,243,0.02)' }}
                    />
                  );
                }

                const solved = question.solvedByTeamId != null;
                const solvedByTeam = solved ? teamById.get(question.solvedByTeamId!) : undefined;
                const disabled = solved || !interactive;

                return (
                  <BlueprintFrame
                    key={question.id}
                    component="button"
                    disabled={disabled}
                    onClick={() => !disabled && onCellClick(question)}
                    cornerColor={solved ? 'rgba(242,242,243,0.2)' : 'rgba(242,242,243,0.55)'}
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      minHeight: { xs: 76, sm: 104 },
                      p: 1,
                      borderColor: solved ? 'rgba(242,242,243,0.16)' : 'rgba(242,242,243,0.42)',
                      bgcolor: solved ? 'rgba(242,242,243,0.07)' : 'rgba(242,242,243,0.02)',
                      color: solved ? 'rgba(242,242,243,0.45)' : '#f2f2f3',
                      cursor: disabled ? 'default' : 'pointer',
                      fontFamily: sjFont.heading,
                      transition: (theme) => theme.transitions.create(['background']),
                    }}
                  >
                    {!solved && (
                      <Typography
                        sx={{ fontSize: { xs: 26, sm: 36 }, fontWeight: 600, lineHeight: 1, letterSpacing: '.02em' }}
                      >
                        {mark}
                      </Typography>
                    )}
                    {solved && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          bottom: 7,
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          fontFamily: sjFont.body,
                          fontSize: 11,
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          opacity: 0.85,
                        }}
                      >
                        {solvedByTeam?.name}
                      </Typography>
                    )}
                  </BlueprintFrame>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
