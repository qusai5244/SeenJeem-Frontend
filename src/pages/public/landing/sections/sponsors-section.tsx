import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { m } from 'framer-motion';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const SPONSORS = [
  { name: 'Ketones', logo: '🏢' },
  { name: 'Oman Sports', logo: '🏅' },
  { name: 'Izki Municipality', logo: '🏛️' },
  { name: 'Bank Muscat', logo: '🏦' },
];

// ----------------------------------------------------------------------

export function SponsorsSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: IZKI_COLORS.background,
      }}
    >
      <Container maxWidth="lg">
        <MotionViewport>
          {/* Gold Section Divider */}
          <Box
            component={m.div}
            variants={varFade('inUp')}
            sx={{
              width: '100%',
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${IZKI_COLORS.accent} 50%, transparent 100%)`,
              mb: 8,
            }}
          />

          {/* Section Header */}
          <Stack spacing={3} alignItems="center" sx={{ mb: 6 }}>
            <Typography
              component={m.h2}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                color: IZKI_COLORS.primary,
                fontFamily: '"Poppins", sans-serif',
                textAlign: 'center',
              }}
            >
              Our Sponsors & Partners
            </Typography>

            <Typography
              component={m.h3}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: IZKI_COLORS.accent,
                fontFamily: '"Cairo", sans-serif',
                direction: 'rtl',
              }}
            >
              الرعاة والشركاء
            </Typography>
          </Stack>

          {/* Sponsors Grid */}
          <Grid container spacing={4} justifyContent="center">
            {SPONSORS.map((sponsor, index) => (
              <Grid item xs={6} sm={3} key={sponsor.name}>
                <Box
                  component={m.div}
                  variants={varFade('inUp')}
                  custom={index * 0.1}
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    bgcolor: IZKI_COLORS.lightMaroonBg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 8px 24px ${IZKI_COLORS.primary}15`,
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>{sponsor.logo}</Typography>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: IZKI_COLORS.text.secondary,
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {sponsor.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </MotionViewport>
      </Container>
    </Box>
  );
}

