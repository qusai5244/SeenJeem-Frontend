import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getGameDetails } from 'src/actions/game';

import { sj, sjText } from 'src/pages/public/components/sj-tokens';
import { SjButton } from 'src/pages/public/components/sj-button';
import { IconArrowRight, IconAlertCircle } from 'src/pages/public/components/icons';

// ----------------------------------------------------------------------
// ScreenHome — the one-decision screen: start a new game, or rejoin one.
// See project/components/ScreenHome/README.md.
// ----------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();

  const [gameCode, setGameCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleContinueGame = useCallback(async () => {
    const code = gameCode.trim();

    if (!code) {
      setCodeError('Enter a game code to continue.');
      return;
    }

    setChecking(true);
    setCodeError('');

    try {
      const response = await getGameDetails(code);
      if (response.data) router.push(paths.public.game(code));
    } catch {
      setCodeError(`That code doesn't match a game.`);
    } finally {
      setChecking(false);
    }
  }, [gameCode, router]);

  return (
    <>
      <Helmet>
        <title>SeenJeem — Team Trivia</title>
      </Helmet>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: { xs: 5, sm: 8 },
        }}
      >
        <Box sx={{ width: 1, maxWidth: 400 }}>
          <Box
            sx={{
              bgcolor: sj.surface100,
              borderRadius: sj.radiusXl,
              boxShadow: sj.shadowSm,
              textAlign: 'center',
              px: { xs: 3, sm: sj.space6 },
              pt: { xs: sj.space7, sm: sj.space9 },
              pb: sj.space6,
            }}
          >
            <Box component="h1" sx={{ ...sjText.displayXl, m: 0, mb: sj.space2 }}>
              Seen<Box component="span" sx={{ color: sj.brand }}>Jeem</Box>
            </Box>
            <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, m: 0, mb: sj.space7 }}>
              Grab a team. Light up the board.
            </Box>

            <SjButton
              sjVariant="primary"
              sjSize="large"
              fullWidth
              onClick={() => router.push(paths.public.newGame)}
            >
              New game
            </SjButton>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: sj.space3,
                my: sj.space6,
                color: sj.inkFaint,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                '&::before, &::after': { content: '""', flex: 1, height: '1px', bgcolor: sj.hairline },
              }}
            >
              or continue with a code
            </Box>

            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Box
                component="input"
                placeholder="e.g. 7F3K"
                value={gameCode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setGameCode(event.target.value.toUpperCase());
                  setCodeError('');
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Enter') handleContinueGame();
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  bgcolor: sj.surface200,
                  boxShadow: `inset 0 0 0 1.5px ${codeError ? sj.danger : sj.controlBorder}`,
                  borderRadius: sj.radiusSm,
                  border: 0,
                  px: '14px',
                  py: '12px',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: sj.ink,
                  outline: 'none',
                  '&::placeholder': { color: sj.inkFaint, fontWeight: 600, letterSpacing: 'normal', textTransform: 'none' },
                  '&:focus-visible': { boxShadow: `inset 0 0 0 1.5px ${sj.focus}` },
                }}
              />
              <Box
                component="button"
                type="button"
                aria-label="Continue with code"
                disabled={checking}
                onClick={handleContinueGame}
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: sj.radiusSm,
                  bgcolor: sj.accent,
                  color: sj.accentInk,
                  border: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: checking ? 'default' : 'pointer',
                  opacity: checking ? sj.opacityDisabled : 1,
                  '&:hover': { filter: checking ? 'none' : 'brightness(1.08)' },
                }}
              >
                <IconArrowRight size={18} strokeWidth={2.5} />
              </Box>
            </Box>

            {codeError && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  mt: sj.space2,
                  fontSize: 12,
                  color: sj.danger,
                  textAlign: 'left',
                }}
              >
                <IconAlertCircle size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                {codeError}
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: sj.space6 }}>
            <SjButton sjVariant="ghost" onClick={() => router.push(paths.public.rules)}>
              How it works
            </SjButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}
