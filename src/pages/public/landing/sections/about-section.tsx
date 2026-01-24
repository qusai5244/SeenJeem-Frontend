import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { m } from 'framer-motion';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const STATS = [
  { icon: '🏆', label: 'Founded', value: '2022' },
  { icon: '⚽', label: 'Local Teams', value: '+20' },
  { icon: '👥', label: 'Players', value: '+100' },
  { icon: '📍', label: 'Location', value: 'Izki, Oman' },
];

// ----------------------------------------------------------------------

export function AboutSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: IZKI_COLORS.background,
      }}
    >
      <Container maxWidth="lg">
        <MotionViewport>
          {/* Section Divider */}
          <Box
            component={m.div}
            variants={varFade('inUp')}
            sx={{
              width: 80,
              height: 4,
              bgcolor: IZKI_COLORS.accent,
              borderRadius: 2,
              mx: 'auto',
              mb: 6,
            }}
          />

          <Grid container spacing={8} alignItems="center">
            {/* Left - Text Content */}
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Typography
                  component={m.h2}
                  variants={varFade('inLeft')}
                  sx={{
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    fontWeight: 800,
                    color: IZKI_COLORS.primary,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  About Izki Club
                </Typography>

                <Typography
                  component={m.p}
                  variants={varFade('inLeft')}
                  sx={{
                    fontSize: '1.125rem',
                    color: IZKI_COLORS.text.secondary,
                    lineHeight: 1.8,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Founded in 2022, Izki Club is dedicated to nurturing young talents and 
                  representing Izki with pride in national competitions. Our mission is to 
                  develop the next generation of football stars while fostering a spirit of 
                  teamwork, discipline, and excellence.
                </Typography>


              </Stack>
            </Grid>

            {/* Right - Stats Grid */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {STATS.map((stat, index) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box
                      component={m.div}
                      variants={varFade('inRight')}
                      custom={index * 0.1}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: IZKI_COLORS.lightMaroonBg,
                        border: `1px solid ${IZKI_COLORS.primary}15`,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 24px ${IZKI_COLORS.primary}15`,
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>
                        {stat.icon}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: IZKI_COLORS.primary,
                          fontFamily: '"Poppins", sans-serif',
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: IZKI_COLORS.accent,
                          fontWeight: 600,
                          fontFamily: '"Poppins", sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </MotionViewport>
      </Container>
    </Box>
  );
}

