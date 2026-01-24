import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { m } from 'framer-motion';

import { IZKI_COLORS, IZKI_GRADIENTS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function CtaSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        background: IZKI_GRADIENTS.gold,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: `2px solid ${IZKI_COLORS.primary}15`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: `2px solid ${IZKI_COLORS.primary}15`,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionViewport>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography
              component={m.h2}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                color: IZKI_COLORS.primary,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Join the Future of Izki Football
            </Typography>

            <Typography
              component={m.h3}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: IZKI_COLORS.primary,
                fontFamily: '"Cairo", sans-serif',
                direction: 'rtl',
              }}
            >
              انضم إلى مستقبل كرة القدم في إزكي
            </Typography>

            <Typography
              component={m.p}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: IZKI_COLORS.darkBg,
                fontFamily: '"Poppins", sans-serif',
                maxWidth: 500,
                opacity: 0.9,
              }}
            >
              Become a player, sponsor, or volunteer. Be part of our growing community.
            </Typography>

            <Stack
              component={m.div}
              variants={varFade('inUp')}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ pt: 3 }}
            >
              <Button
                size="large"
                variant="contained"
                sx={{
                  bgcolor: IZKI_COLORS.primary,
                  color: IZKI_COLORS.background,
                  fontWeight: 700,
                  px: 5,
                  py: 1.75,
                  borderRadius: '12px',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '1.1rem',
                  boxShadow: `0 8px 24px ${IZKI_COLORS.primary}40`,
                  '&:hover': {
                    bgcolor: IZKI_COLORS.secondary,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${IZKI_COLORS.primary}50`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Register Now
              </Button>

              <Button
                size="large"
                variant="outlined"
                sx={{
                  color: IZKI_COLORS.primary,
                  borderColor: IZKI_COLORS.primary,
                  borderWidth: 2,
                  fontWeight: 600,
                  px: 5,
                  py: 1.75,
                  borderRadius: '12px',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: `${IZKI_COLORS.primary}10`,
                    borderColor: IZKI_COLORS.primary,
                    borderWidth: 2,
                  },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Stack>
        </MotionViewport>
      </Container>
    </Box>
  );
}

