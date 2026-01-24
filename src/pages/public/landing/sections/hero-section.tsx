import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router';

import { IZKI_COLORS, IZKI_GRADIENTS } from '../brand-constants';
import { varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function HeroSection() {
  const navigate = useNavigate();

  const handleScrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    navigate(paths.public.contact);
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: IZKI_GRADIENTS.maroon,
        overflow: 'hidden',
      }}
    >
      {/* Decorative geometric patterns */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${IZKI_COLORS.lightAccent} 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, ${IZKI_COLORS.lightAccent} 2px, transparent 2px),
            radial-gradient(circle at 40% 40%, ${IZKI_COLORS.lightAccent} 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px',
        }}
      />

      {/* Diagonal accent stripe */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '50%',
          height: '120%',
          background: `linear-gradient(135deg, ${IZKI_COLORS.accent}15 0%, transparent 50%)`,
          transform: 'skewX(-15deg)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={6}
        >
          {/* Left Content */}
          <Stack
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade('inLeft')}
            spacing={4}
            sx={{ maxWidth: 600, textAlign: { xs: 'center', md: 'left' } }}
          >
            {/* Logo placeholder */}
            <Box
              component={m.div}
              variants={varFade('inDown')}
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: IZKI_COLORS.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: { xs: 'auto', md: 0 },
                boxShadow: `0 8px 32px ${IZKI_COLORS.primary}40`,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: IZKI_COLORS.primary,
                  fontWeight: 800,
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                IZKI
              </Typography>
            </Box>


            {/* English Title */}
            <Typography
              component={m.h2}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                color: IZKI_COLORS.accent,
                fontFamily: '"Poppins", sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              Izki Club
            </Typography>

            {/* Description */}
            <Typography
              component={m.p}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: `${IZKI_COLORS.background}CC`,
                fontFamily: '"Poppins", sans-serif',
                maxWidth: 500,
              }}
            >
              The Official Website for Izki Club
            </Typography>

            {/* Description */}
            <Typography
              component={m.p}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: `${IZKI_COLORS.background}CC`,
                fontFamily: '"Poppins", sans-serif',
                maxWidth: 500,
              }}
            >
              A competitive sports club committed to developing youth, excellence, and teamwork.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              component={m.div}
              variants={varFade('inUp')}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              <Button
                size="large"
                variant="contained"
                onClick={handleScrollToAbout}
                sx={{
                  bgcolor: IZKI_COLORS.accent,
                  color: IZKI_COLORS.darkBg,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '1.1rem',
                  boxShadow: `0 8px 24px ${IZKI_COLORS.accent}50`,
                  '&:hover': {
                    bgcolor: IZKI_COLORS.lightAccent,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${IZKI_COLORS.accent}60`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                About the Club
              </Button>

              <Button
                size="large"
                variant="outlined"
                onClick={handleContactClick}
                sx={{
                  color: IZKI_COLORS.background,
                  borderColor: IZKI_COLORS.background,
                  borderWidth: 2,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: `${IZKI_COLORS.background}15`,
                    borderColor: IZKI_COLORS.background,
                    borderWidth: 2,
                  },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Stack>

          {/* Right - Player Image Placeholder */}
          <Box
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade('inRight')}
            sx={{
              position: 'relative',
              width: { xs: 300, md: 450 },
              height: { xs: 350, md: 500 },
            }}
          >
            {/* Glow effect behind */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                background: `radial-gradient(ellipse at center, ${IZKI_COLORS.accent}30 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />

            {/* Player silhouette placeholder */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '20px',
                background: `linear-gradient(180deg, transparent 0%, ${IZKI_COLORS.secondary}50 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${IZKI_COLORS.accent}30`,
              }}
            >
              <Box
                sx={{
                  width: '80%',
                  height: '90%',
                  bgcolor: `${IZKI_COLORS.background}10`,
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: `${IZKI_COLORS.accent}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '2rem' }}>⚽</Typography>
                </Box>
                <Typography
                  sx={{
                    color: IZKI_COLORS.lightAccent,
                    fontSize: '0.875rem',
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Player Image
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Scroll indicator */}
      <Box
        component={m.div}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 50,
            border: `2px solid ${IZKI_COLORS.background}50`,
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            pt: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 8,
              bgcolor: IZKI_COLORS.accent,
              borderRadius: '2px',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

