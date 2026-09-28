import { Outlet } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { RouterLink } from 'src/routes/components';

import { toast } from 'src/components/snackbar';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sj, sjFont, sjGlobalCss } from 'src/pages/public/components/sj-tokens';
import { IconSun, IconMoon, IconCopy } from 'src/pages/public/components/icons';

// ----------------------------------------------------------------------

type SjThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'sj-theme-mode';

function readStoredMode(): SjThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

type Props = {
  children?: React.ReactNode;
};

export function PublicLayout({ children }: Props) {
  const pathname = usePathname();
  const [mode, setMode] = useState<SjThemeMode>(readStoredMode);

  const gameMatch = pathname.match(/^\/game\/([^/]+)/);
  const gameCode = gameMatch?.[1];

  // Set on <html> (not just an inner wrapper) so the tokens are visible to
  // MUI content portaled straight to document.body — Dialog, Popover, Menu,
  // Tooltip — which sit outside any element inside this component's tree.
  // Cleaned up on unmount so it never lingers into dashboard/auth/superAdmin.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-sj-theme', mode);
    return () => {
      root.removeAttribute('data-sj-theme');
    };
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Ignore storage failures (private browsing, blocked site data, etc).
      }
      return next;
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>SeenJeem</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: sjGlobalCss() }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: sj.surface0,
          color: sj.ink,
          fontFamily: sjFont.body,
          fontSize: 15,
          lineHeight: 1.55,
          transition: 'background-color 0.15s ease, color 0.15s ease',
        }}
      >
        <Stack
          component="header"
          direction="row"
          alignItems="center"
          sx={{
            gap: sj.space4,
            position: 'sticky',
            top: 0,
            zIndex: 40,
            bgcolor: sj.surface0,
            borderBottom: `1px solid ${sj.hairline}`,
            px: { xs: 2.5, sm: 3 },
            py: 1.75,
          }}
        >
          <Box
            component={RouterLink}
            href={paths.public.root}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: sjFont.display,
              fontWeight: 700,
              fontSize: 15,
              color: sj.ink,
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: sj.radiusXs,
                bgcolor: sj.brand,
                position: 'relative',
                flexShrink: 0,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  width: 6,
                  height: 6,
                  borderRadius: '2px',
                  bgcolor: sj.brandInk,
                  opacity: 0.55,
                },
              }}
            />
            SeenJeem
          </Box>

          {gameCode && (
            <Box
              component="button"
              type="button"
              title="Click to copy"
              onClick={() => {
                navigator.clipboard?.writeText(gameCode);
                toast.success('Game code copied.');
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: sjFont.body,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: sj.link,
                bgcolor: 'transparent',
                border: 0,
                boxShadow: `inset 0 0 0 1.5px ${sj.accent}`,
                borderRadius: sj.radiusXs,
                px: '10px',
                py: '5px',
                cursor: 'pointer',
              }}
            >
              {gameCode}
              <IconCopy size={12} strokeWidth={2.5} />
            </Box>
          )}

          <Box sx={{ flex: 1 }} />

          <SjButton sjVariant="ghost" href={paths.public.rules} component={RouterLink} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            How it works
          </SjButton>
          <SjButton
            sjVariant="ghost"
            href={paths.public.addQuestion}
            component={RouterLink}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Add a question
          </SjButton>
          <SjButton sjVariant="outline" href={paths.public.root} component={RouterLink}>
            Home
          </SjButton>

          <Box
            component="button"
            type="button"
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: sj.radiusPill,
              bgcolor: 'transparent',
              color: sj.inkMuted,
              boxShadow: `inset 0 0 0 1.5px ${sj.controlBorder}`,
              border: 0,
              cursor: 'pointer',
              '&:hover': { bgcolor: sj.surface200, color: sj.ink },
              '&:focus-visible': { outline: `2px solid ${sj.focus}`, outlineOffset: '2px' },
            }}
          >
            {mode === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
          </Box>
        </Stack>

        <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </>
  );
}
