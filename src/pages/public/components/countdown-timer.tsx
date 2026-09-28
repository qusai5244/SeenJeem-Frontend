import Box from '@mui/material/Box';

import { sj, sjFont } from './sj-tokens';

// ----------------------------------------------------------------------
// CountdownTimer — a 2-minute ring inside the question dialog.
// See project/components/CountdownTimer/README.md.
// ----------------------------------------------------------------------

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const WARNING_SECONDS = 15;

type Props = {
  secondsLeft: number;
  totalSeconds: number;
  size?: number;
};

export function CountdownTimer({ secondsLeft, totalSeconds, size = 64 }: Props) {
  const clamped = Math.max(0, secondsLeft);
  const progress = totalSeconds > 0 ? Math.min(1, clamped / totalSeconds) : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  const expired = clamped <= 0;
  const warning = !expired && clamped <= WARNING_SECONDS;
  const color = expired ? sj.danger : warning ? sj.warning : sj.accent;

  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 96 96" width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={48} cy={48} r={RADIUS} fill="none" strokeWidth={6} style={{ stroke: sj.controlBorder }} />
        <circle
          cx={48}
          cy={48}
          r={RADIUS}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ stroke: color, transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: sjFont.display,
          fontWeight: 700,
          fontSize: size < 64 ? 11 : 18,
          color,
          animation: warning ? 'sj-warn-pulse 1s ease-in-out infinite' : 'none',
        }}
      >
        {minutes}:{seconds < 10 ? '0' : ''}
        {seconds}
      </Box>
    </Box>
  );
}
