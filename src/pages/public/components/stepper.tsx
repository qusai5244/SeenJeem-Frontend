import Box from '@mui/material/Box';

import { sj, sjFont } from './sj-tokens';
import { IconCheck } from './icons';

// ----------------------------------------------------------------------
// Stepper — two dots and a label, top of the New Game wizard.
// See project/components/Stepper/README.md.
// ----------------------------------------------------------------------

const STEPS = [
  { n: 1, label: 'Teams' },
  { n: 2, label: 'Category & Board' },
] as const;

export function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 360, width: 1 }}>
      {STEPS.map((s, index) => {
        const state = s.n < step ? 'done' : s.n === step ? 'current' : 'upcoming';
        const isLast = index === STEPS.length - 1;

        return (
          <Box key={s.n} sx={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: sjFont.body,
                  fontSize: 12,
                  fontWeight: 800,
                  flexShrink: 0,
                  ...(state === 'current' && { backgroundColor: sj.accent, color: sj.accentInk }),
                  ...(state === 'done' && { backgroundColor: sj.success, color: sj.successInk }),
                  ...(state === 'upcoming' && {
                    backgroundColor: 'transparent',
                    boxShadow: `inset 0 0 0 1.5px ${sj.controlBorder}`,
                    color: sj.inkFaint,
                  }),
                }}
              >
                {state === 'done' ? <IconCheck size={12} strokeWidth={3.5} /> : s.n}
              </Box>
              <Box
                component="span"
                sx={{
                  fontFamily: sjFont.body,
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  color: state === 'current' ? sj.ink : state === 'done' ? sj.inkMuted : sj.inkFaint,
                }}
              >
                {s.label}
              </Box>
            </Box>
            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: '2px',
                  mx: sj.space3,
                  minWidth: 24,
                  backgroundColor: step > s.n ? sj.accent : sj.controlBorder,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
