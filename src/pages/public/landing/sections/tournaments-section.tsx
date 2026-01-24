import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router';

import { IZKI_COLORS, IZKI_GRADIENTS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const TOURNAMENTS = [
  {
    name: 'Oman Professional League',
    nameAr: 'دوري عمان المحترفين',
    season: '2024/2025',
    status: 'ongoing',
    position: '5th',
    matches: 18,
    wins: 8,
    draws: 4,
    losses: 6,
    icon: '🏆',
    description: 'The top tier of Omani football competition.',
  },
  {
    name: 'Sultan Qaboos Cup',
    nameAr: 'كأس جلالة السلطان',
    season: '2024/2025',
    status: 'upcoming',
    round: 'Round of 16',
    matches: 3,
    wins: 3,
    draws: 0,
    losses: 0,
    icon: '👑',
    description: 'The most prestigious knockout competition in Oman.',
  },
  {
    name: 'Governorate Championship',
    nameAr: 'بطولة المحافظة',
    season: '2024',
    status: 'completed',
    position: 'Champions 🥇',
    matches: 10,
    wins: 8,
    draws: 1,
    losses: 1,
    icon: '🎯',
    description: 'Regional championship representing our governorate.',
  },
  {
    name: 'Youth Development League',
    nameAr: 'دوري تطوير الشباب',
    season: '2024/2025',
    status: 'ongoing',
    position: '2nd',
    matches: 12,
    wins: 9,
    draws: 2,
    losses: 1,
    icon: '⭐',
    description: 'Competitive league for developing young talent.',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return { bg: '#4CAF50', text: '#fff' };
    case 'upcoming':
      return { bg: IZKI_COLORS.accent, text: IZKI_COLORS.primary };
    case 'completed':
      return { bg: IZKI_COLORS.primary, text: '#fff' };
    default:
      return { bg: IZKI_COLORS.text.secondary, text: '#fff' };
  }
};

// ----------------------------------------------------------------------

export function TournamentsSection() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: IZKI_COLORS.background,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `radial-gradient(circle at 20% 50%, ${IZKI_COLORS.primary}08 0%, transparent 50%),
                       radial-gradient(circle at 80% 50%, ${IZKI_COLORS.accent}08 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
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
                color: IZKI_COLORS.primary,
                fontFamily: '"Poppins", sans-serif',
                textAlign: 'center',
              }}
            >
              Tournaments
            </Typography>

            <Typography
              component={m.h3}
              variants={varFade('inUp')}
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                color: IZKI_COLORS.primary,
                fontFamily: '"Cairo", sans-serif',
                direction: 'rtl',
              }}
            >
              البطولات
            </Typography>

            <Typography
              component={m.p}
              variants={varFade('inUp')}
              sx={{
                maxWidth: 600,
                textAlign: 'center',
                fontSize: '1.1rem',
                color: IZKI_COLORS.text.secondary,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Follow our journey across multiple competitions as we compete for glory and represent
              Izki with pride.
            </Typography>
          </Stack>

          {/* Tournaments Grid */}
          <Grid container spacing={4}>
            {TOURNAMENTS.slice(0, 4).map((tournament, index) => {
              const statusColor = getStatusColor(tournament.status);
              return (
                <Grid item xs={12} md={6} key={tournament.name}>
                  <Card
                    component={m.div}
                    variants={varFade('inUp')}
                    custom={index * 0.1}
                    sx={{
                      height: '100%',
                      borderRadius: '24px',
                      bgcolor: IZKI_COLORS.background,
                      border: `1px solid ${IZKI_COLORS.lightMaroonBg}`,
                      boxShadow: `0 4px 24px ${IZKI_COLORS.primary}08`,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 16px 48px ${IZKI_COLORS.primary}15`,
                        borderColor: IZKI_COLORS.accent,
                      },
                    }}
                  >
                    {/* Tournament Header */}
                    <Box
                      sx={{
                        background: IZKI_GRADIENTS.maroon,
                        px: 3,
                        py: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            bgcolor: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: '1.75rem' }}>{tournament.icon}</Typography>
                        </Box>
                        <Stack spacing={0.5}>
                          <Typography
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              color: IZKI_COLORS.text.light,
                              fontFamily: '"Poppins", sans-serif',
                            }}
                          >
                            {tournament.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              color: IZKI_COLORS.accent,
                              fontFamily: '"Cairo", sans-serif',
                              direction: 'rtl',
                            }}
                          >
                            {tournament.nameAr}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Chip
                        label={tournament.status.toUpperCase()}
                        sx={{
                          bgcolor: statusColor.bg,
                          color: statusColor.text,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          letterSpacing: '0.05em',
                          height: 28,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        {/* Season & Position */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Stack>
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                              }}
                            >
                              Season
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: IZKI_COLORS.primary,
                              }}
                            >
                              {tournament.season}
                            </Typography>
                          </Stack>

                          <Stack alignItems="flex-end">
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                              }}
                            >
                              {tournament.position ? 'Position' : 'Round'}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: IZKI_COLORS.accent,
                              }}
                            >
                              {tournament.position || tournament.round}
                            </Typography>
                          </Stack>
                        </Box>

                        {/* Stats */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: IZKI_COLORS.lightMaroonBg,
                          }}
                        >
                          <Stack alignItems="center" sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: IZKI_COLORS.primary,
                              }}
                            >
                              {tournament.matches}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                              }}
                            >
                              Matches
                            </Typography>
                          </Stack>

                          <Box
                            sx={{
                              width: 1,
                              bgcolor: IZKI_COLORS.accent,
                              opacity: 0.3,
                            }}
                          />

                          <Stack alignItems="center" sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: '#4CAF50',
                              }}
                            >
                              {tournament.wins}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                              }}
                            >
                              Wins
                            </Typography>
                          </Stack>

                          <Box
                            sx={{
                              width: 1,
                              bgcolor: IZKI_COLORS.accent,
                              opacity: 0.3,
                            }}
                          />

                          <Stack alignItems="center" sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: IZKI_COLORS.accent,
                              }}
                            >
                              {tournament.draws}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                              }}
                            >
                              Draws
                            </Typography>
                          </Stack>

                          <Box
                            sx={{
                              width: 1,
                              bgcolor: IZKI_COLORS.accent,
                              opacity: 0.3,
                            }}
                          />

                          <Stack alignItems="center" sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: '#F44336',
                              }}
                            >
                              {tournament.losses}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                              }}
                            >
                              Losses
                            </Typography>
                          </Stack>
                        </Box>

                        {/* Description */}
                        <Typography
                          sx={{
                            fontSize: '0.9rem',
                            color: IZKI_COLORS.text.secondary,
                            fontFamily: '"Poppins", sans-serif',
                            lineHeight: 1.6,
                          }}
                        >
                          {tournament.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* View All Button */}
          <Stack
            component={m.div}
            variants={varFade('inUp')}
            alignItems="center"
            sx={{ mt: 6 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(paths.public.tournaments)}
              sx={{
                px: 5,
                py: 1.5,
                borderColor: IZKI_COLORS.primary,
                color: IZKI_COLORS.primary,
                fontWeight: 700,
                fontFamily: '"Poppins", sans-serif',
                borderRadius: '12px',
                fontSize: '1rem',
                borderWidth: 2,
                '&:hover': {
                  bgcolor: IZKI_COLORS.primary,
                  color: IZKI_COLORS.text.light,
                  borderColor: IZKI_COLORS.primary,
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              View All Tournaments →
            </Button>
          </Stack>
        </MotionViewport>
      </Container>
    </Box>
  );
}

