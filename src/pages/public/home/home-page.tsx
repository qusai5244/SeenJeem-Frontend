import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getGameDetails } from 'src/actions/game';
import { toast } from 'src/components/snackbar';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';
import { BlueprintFrame } from 'src/pages/public/components/blueprint-frame';

// ----------------------------------------------------------------------

const STATS = [
  { value: '16', label: 'questions per board' },
  { value: '10–40', label: 'points per tile' },
  { value: '1', label: 'swap per team' },
];

export default function HomePage() {
  const router = useRouter();

  const [gameCode, setGameCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleContinueGame = useCallback(async () => {
    const code = gameCode.trim();

    if (!code) {
      setCodeError('Enter a game code to continue.');
      toast.error('Enter a game code to continue.');
      return;
    }

    setChecking(true);
    setCodeError('');

    try {
      const response = await getGameDetails(code);

      if (response.data) {
        router.push(paths.public.game(code));
      }
    } catch {
      setCodeError(`No game found with code ${code}.`);
      toast.error('No game found with that code.');
    } finally {
      setChecking(false);
    }
  }, [gameCode, router]);

  return (
    <>
      <Helmet>
        <title>SeenJeem — Team Trivia</title>
      </Helmet>

      <Box component="main" sx={{ maxWidth: 1120, mx: 'auto', width: 1, px: 3, py: { xs: 3.5, sm: 9 }, pb: 10 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: { xs: 3.5, sm: 8 },
            alignItems: 'start',
          }}
        >
          <Box component="section">
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: sjColor.accent700,
                mb: 1.75,
              }}
            >
              Team trivia · 2 teams · 16 questions
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: sjFont.heading,
                fontWeight: 600,
                fontSize: { xs: 40, sm: 72 },
                lineHeight: 0.96,
                m: 0,
                mb: 2.25,
                letterSpacing: '-.01em',
                textTransform: 'uppercase',
              }}
            >
              Pick a board.
              <br />
              Split the room.
              <br />
              Play it out.
            </Typography>

            <Typography sx={{ m: 0, mb: 3.5, maxWidth: '46ch', fontSize: 17, color: sjColor.neutral700 }}>
              Four categories, four values, one shared screen. Every answer is scored the second
              it lands — no scorekeeper, no arguments.
            </Typography>

            <Stack direction="row" flexWrap="wrap" spacing={1.5}>
              <BlueprintFrame cornerColor={sjColor.bg} sx={{ display: 'inline-flex' }}>
                <SjButton
                  sjVariant="primary"
                  size="large"
                  onClick={() => router.push(paths.public.newGame)}
                  sx={{ fontSize: 16, px: 3.5, py: 1.75 }}
                >
                  New game
                </SjButton>
              </BlueprintFrame>
              <SjButton
                sjVariant="secondary"
                size="large"
                onClick={() => router.push(paths.public.rules)}
                sx={{ fontSize: 15, px: 2.75 }}
              >
                How it works
              </SjButton>
            </Stack>

            <Stack
              direction="row"
              flexWrap="wrap"
              spacing={3.5}
              sx={{ mt: 5.5, pt: 3, borderTop: '1px solid', borderColor: sjColor.divider }}
            >
              {STATS.map((stat) => (
                <Box key={stat.label}>
                  <Typography sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 30, lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: sjColor.neutral600 }}>{stat.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <BlueprintFrame component="section" sx={{ p: 3.25 }}>
            <Typography sx={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: sjColor.accent }}>
              Already have a game
            </Typography>
            <Typography
              sx={{ fontFamily: sjFont.heading, fontWeight: 600, fontSize: 26, my: 0.75 }}
            >
              Continue with a code
            </Typography>
            <Typography sx={{ m: 0, mb: 2.25, fontSize: 14, color: sjColor.neutral700 }}>
              Anyone with the code can open the same board — a second phone, a laptop on the TV,
              whatever is closest.
            </Typography>

            <Box sx={{ mb: 1.25 }}>
              <Typography
                component="label"
                htmlFor="sj-code"
                sx={{ display: 'block', fontSize: 12, mb: 0.625, color: 'rgba(29,31,32,0.7)' }}
              >
                Game code
              </Typography>
              <Box
                id="sj-code"
                component="input"
                placeholder="SJ0000"
                value={gameCode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setGameCode(event.target.value.toUpperCase());
                  setCodeError('');
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Enter') handleContinueGame();
                }}
                sx={{
                  width: 1,
                  minHeight: 52,
                  fontFamily: sjFont.mono,
                  letterSpacing: '.26em',
                  fontSize: 20,
                  textTransform: 'uppercase',
                  color: sjColor.text,
                  bgcolor: sjColor.surface,
                  border: '1px solid',
                  borderColor: codeError ? '#c07474' : sjColor.divider,
                  borderRadius: 0,
                  px: 1.25,
                  outline: 'none',
                  '&:focus-visible': { borderColor: sjColor.accent },
                }}
              />
            </Box>

            {codeError && (
              <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ fontSize: 13, color: sjColor.errorText, mb: 1.25 }}>
                <Box component="span" sx={{ fontFamily: sjFont.heading, fontSize: 15, lineHeight: 1.2 }}>
                  !
                </Box>
                <Box component="span">{codeError}</Box>
              </Stack>
            )}

            <SjButton
              sjVariant="primary"
              fullWidth
              disabled={checking}
              onClick={handleContinueGame}
              sx={{ minHeight: 46, fontSize: 15 }}
            >
              {checking ? 'Checking…' : 'Continue game'}
            </SjButton>
          </BlueprintFrame>
        </Box>
      </Box>
    </>
  );
}
