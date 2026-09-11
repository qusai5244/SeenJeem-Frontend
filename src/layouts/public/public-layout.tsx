import { Outlet } from 'react-router';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Helmet } from 'react-helmet-async';
import GlobalStyles from '@mui/material/GlobalStyles';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { RouterLink } from 'src/routes/components';

import { toast } from 'src/components/snackbar';

import { SjButton } from 'src/pages/public/components/sj-button';
import { sjColor, sjFont } from 'src/pages/public/components/sj-tokens';

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
};

export function PublicLayout({ children }: Props) {
  const pathname = usePathname();

  const gameMatch = pathname.match(/^\/game\/([^/]+)/);
  const gameCode = gameMatch?.[1];

  return (
    <>
      <Helmet>
        <title>SeenJeem</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <GlobalStyles
        styles={{
          '@keyframes sj-spin': { to: { transform: 'rotate(360deg)' } },
          '@keyframes sj-pulse': { '0%, 100%': { opacity: 0.35 }, '50%': { opacity: 0.8 } },
          '@keyframes sj-rise': {
            from: { opacity: 0, transform: 'translateY(6px)' },
            to: { opacity: 1, transform: 'none' },
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: sjColor.bg,
          color: sjColor.text,
          fontFamily: sjFont.body,
          fontSize: 15,
          lineHeight: 1.55,
        }}
      >
        <Stack
          component="header"
          direction="row"
          alignItems="center"
          spacing={2.25}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            bgcolor: sjColor.bg,
            borderBottom: '1px solid',
            borderColor: sjColor.divider,
            px: 3,
            py: 1.75,
          }}
        >
          <Box
            component={RouterLink}
            href={paths.public.root}
            sx={{
              fontFamily: sjFont.heading,
              fontWeight: 600,
              fontSize: 19,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: sjColor.text,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Seen<Box component="span" sx={{ color: sjColor.accent }}>Jeem</Box>
          </Box>

          {gameCode && (
            <Chip
              size="small"
              label={gameCode}
              title="Click to copy"
              onClick={() => {
                navigator.clipboard?.writeText(gameCode);
                toast.success('Game code copied.');
              }}
              sx={{
                borderRadius: 0,
                fontFamily: sjFont.mono,
                letterSpacing: '.12em',
                border: '1px solid',
                borderColor: sjColor.accent,
                color: sjColor.accent700,
                bgcolor: 'transparent',
                cursor: 'pointer',
              }}
            />
          )}

          <Box sx={{ flex: 1 }} />

          <SjButton sjVariant="ghost" size="small" href={paths.public.rules} component={RouterLink} sx={{ fontSize: 13, minHeight: 'auto', py: 0.75 }}>
            How to play
          </SjButton>
          <SjButton
            sjVariant="secondary"
            size="small"
            href={paths.public.root}
            component={RouterLink}
            sx={{ fontSize: 13, minHeight: 'auto', py: 0.875, px: 1.75 }}
          >
            Home
          </SjButton>
        </Stack>

        <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </>
  );
}
