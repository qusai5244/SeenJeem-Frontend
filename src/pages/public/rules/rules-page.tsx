import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';

// ----------------------------------------------------------------------

const RULES = [
  {
    n: '01',
    title: 'Gather the room',
    body: 'Type everyone in, then assign names to the two teams — or hit Shuffle & Split and let it decide.',
  },
  {
    n: '02',
    title: 'Pick the board',
    body: 'One category, then exactly four subcategories. Each becomes a column worth 10, 20, 30 and 40 points.',
  },
  {
    n: '03',
    title: 'Share the code',
    body: 'Creating a game returns a six-character code. Anyone who opens it sees the same live board.',
  },
  {
    n: '04',
    title: 'Take turns',
    body: 'The team on turn picks any open tile. Choose an answer and submit — the score updates instantly.',
  },
  {
    n: '05',
    title: 'Swap once',
    body: 'Stuck? Each team can swap one question for another in the same tile. Once used, it’s gone for the game.',
  },
  {
    n: '06',
    title: 'Finish',
    body: 'When all sixteen tiles are taken the game closes itself and shows the final scores.',
  },
];

export default function RulesPage() {
  return (
    <>
      <Helmet>
        <title>How to play — SeenJeem</title>
      </Helmet>

      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 8 }, pb: { xs: 8, sm: 11 }, flex: 1 }}>
        <Typography
          sx={{
            fontFamily: sjFont.heading,
            fontWeight: 600,
            fontSize: { xs: 34, sm: 56 },
            textTransform: 'uppercase',
            lineHeight: 1,
            mb: 1,
          }}
        >
          How to play
        </Typography>
        <Typography sx={{ fontSize: 17, color: sjColor.neutral700, maxWidth: '52ch', mb: 4.5 }}>
          Six steps, about a minute of setup, then it runs itself.
        </Typography>

        <Stack sx={{ gap: '2px' }}>
          {RULES.map((rule) => (
            <Box
              key={rule.n}
              sx={{
                display: 'grid',
                gridTemplateColumns: '64px 1fr',
                gap: 2.25,
                alignItems: 'start',
                py: 2.5,
                borderTop: '1px solid',
                borderColor: sjColor.divider,
              }}
            >
              <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 34, lineHeight: 1, color: sjColor.accent }}>
                {rule.n}
              </Typography>
              <Box>
                <Typography
                  sx={{
                    fontFamily: sjFont.heading,
                    fontWeight: 600,
                    fontSize: 22,
                    textTransform: 'uppercase',
                    letterSpacing: '.03em',
                  }}
                >
                  {rule.title}
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: 15, color: sjColor.neutral700, maxWidth: '56ch' }}>
                  {rule.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        <SjButton
          sjVariant="primary"
          component={RouterLink}
          href={paths.public.newGame}
          sx={{ mt: 4.25, px: 3.75 }}
        >
          Start a game
        </SjButton>
      </Container>
    </>
  );
}
