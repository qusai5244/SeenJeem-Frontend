import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';

// ----------------------------------------------------------------------
// ScreenRules — a static, single-column read: six numbered steps.
// See project/components/ScreenRules/README.md.
// ----------------------------------------------------------------------

const STEPS = [
  {
    title: 'Build two teams',
    body: 'Add every player, then split them into Team 1 and Team 2 — or let Shuffle & split do it for you.',
  },
  {
    title: 'Pick your board',
    body: 'Choose one category and exactly four of its subcategories. Together they build your 4×4 board.',
  },
  {
    title: 'Take turns',
    body: 'The starting team is random. Pick any unsolved tile — 10, 20, 30 or 40 points — to open its question.',
  },
  {
    title: 'Answer or swap',
    body: 'You have two minutes. Each team gets one swap for the whole game if a question just isn’t for you.',
  },
  {
    title: 'Right or wrong, the turn passes',
    body: 'Correct answers score the tile’s points. Either way, it’s the other team’s turn next.',
  },
  {
    title: 'Clear the board',
    body: 'Once all 16 tiles are answered, the higher score wins — or it’s a tie.',
  },
];

export default function RulesPage() {
  return (
    <>
      <Helmet>
        <title>How to play — SeenJeem</title>
      </Helmet>

      <Box sx={{ maxWidth: 480, mx: 'auto', width: 1, px: 3, py: { xs: sj.space6, sm: sj.space7 }, pb: { xs: 8, sm: 10 } }}>
        <Box component="h1" sx={{ ...sjText.displayLg, textAlign: 'center', m: 0, mb: sj.space6 }}>
          How it works
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: sj.space3 }}>
          {STEPS.map((step, index) => (
            <Box
              key={step.title}
              sx={{ display: 'flex', gap: sj.space4, bgcolor: sj.surface100, borderRadius: sj.radiusLg, p: sj.space5 }}
            >
              <Box sx={{ ...sjText.displayMd, color: sj.brand, flexShrink: 0, width: 28 }}>{index + 1}</Box>
              <Box>
                <Box sx={{ ...sjText.displayMd, fontSize: 15, mb: '4px' }}>{step.title}</Box>
                <Box sx={{ ...sjText.bodySm, color: sj.inkMuted }}>{step.body}</Box>
              </Box>
            </Box>
          ))}
        </Box>

        <SjButton
          sjVariant="primary"
          sjSize="large"
          fullWidth
          component={RouterLink}
          href={paths.public.newGame}
          sx={{ mt: sj.space6 }}
        >
          Start a game
        </SjButton>
      </Box>
    </>
  );
}
