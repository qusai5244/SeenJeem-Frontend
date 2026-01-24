import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { m } from 'framer-motion';

import { IZKI_COLORS, IZKI_GRADIENTS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const PLAYERS = [
  { name: 'Ahmed Al-Izki', nameAr: 'أحمد الإزكي', number: 10, position: 'Forward' },
  { name: 'Mohammed Salim', nameAr: 'محمد سالم', number: 7, position: 'Midfielder' },
  { name: 'Khalid Hassan', nameAr: 'خالد حسن', number: 1, position: 'Goalkeeper' },
  { name: 'Omar Al-Rashid', nameAr: 'عمر الراشد', number: 9, position: 'Striker' },
];

// ----------------------------------------------------------------------

export function PlayersSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        background: IZKI_GRADIENTS.maroon,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(45deg, ${IZKI_COLORS.accent} 1px, transparent 1px),
            linear-gradient(-45deg, ${IZKI_COLORS.accent} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionViewport>
          {/* Section Header */}
          <Stack spacing={3} alignItems="center" sx={{ mb: 8 }}>
            <Box
              component={m.div}
              variants={varFade('inUp')}
              sx={{
                width: 80,
                height: 4,
                bgcolor: IZKI_COLORS.accent,
                borderRadius: 2,
              }}
            />

            <Typography
              component={m.h2}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                color: IZKI_COLORS.background,
                fontFamily: '"Poppins", sans-serif',
                textAlign: 'center',
              }}
            >
              Players Spotlight
            </Typography>

            <Typography
              component={m.h3}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                color: IZKI_COLORS.lightAccent,
                fontFamily: '"Cairo", sans-serif',
                direction: 'rtl',
              }}
            >
              أضواء على اللاعبين
            </Typography>
          </Stack>

          {/* Players Grid */}
          <Grid container spacing={4} justifyContent="center">
            {PLAYERS.map((player, index) => (
              <Grid item xs={6} sm={6} md={3} key={player.name}>
                <Box
                  component={m.div}
                  variants={varFade('inUp')}
                  custom={index * 0.1}
                  sx={{
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      '& .player-number': {
                        transform: 'scale(1.1)',
                        boxShadow: `0 0 30px ${IZKI_COLORS.accent}60`,
                      },
                    },
                  }}
                >
                  {/* Player Photo Placeholder */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: 140, md: 180 },
                      height: { xs: 180, md: 220 },
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {/* Background card */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '20px',
                        bgcolor: `${IZKI_COLORS.background}10`,
                        border: `1px solid ${IZKI_COLORS.accent}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: `${IZKI_COLORS.background}20`,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: `${IZKI_COLORS.background}60`,
                          fontFamily: '"Poppins", sans-serif',
                        }}
                      >
                        Player Photo
                      </Typography>
                    </Box>

                    {/* Jersey Number */}
                    <Box
                      className="player-number"
                      sx={{
                        position: 'absolute',
                        bottom: -15,
                        right: -10,
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        bgcolor: IZKI_COLORS.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 20px ${IZKI_COLORS.accent}40`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: IZKI_COLORS.darkBg,
                          fontFamily: '"Poppins", sans-serif',
                        }}
                      >
                        {player.number}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Player Info */}
                  <Stack spacing={0.5}>
                    <Typography
                      sx={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: IZKI_COLORS.background,
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    >
                      {player.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: IZKI_COLORS.lightAccent,
                        fontFamily: '"Cairo", sans-serif',
                        direction: 'rtl',
                      }}
                    >
                      {player.nameAr}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: IZKI_COLORS.accent,
                        fontFamily: '"Poppins", sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {player.position}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </MotionViewport>
      </Container>
    </Box>
  );
}

