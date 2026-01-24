import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const LOCAL_TEAMS = [
  {
    name: 'First Team',
    nameAr: 'الفريق الأول',
    category: 'Senior Division',
    categoryAr: 'فئة الكبار',
    players: 25,
    coach: 'Mohammed Al-Rashidi',
    description: 'Our flagship senior team competing in the top regional leagues.',
    icon: '🏆',
    color: IZKI_COLORS.primary,
  },
  {
    name: 'U-21 Team',
    nameAr: 'فريق تحت 21',
    category: 'Youth Division',
    categoryAr: 'فئة الشباب',
    players: 22,
    coach: 'Ahmed Al-Balushi',
    description: 'Talented young players preparing for senior football excellence.',
    icon: '⚡',
    color: IZKI_COLORS.secondary,
  },
  {
    name: 'U-17 Team',
    nameAr: 'فريق تحت 17',
    category: 'Junior Division',
    categoryAr: 'فئة الناشئين',
    players: 24,
    coach: 'Salim Al-Habsi',
    description: 'Developing future stars with professional training programs.',
    icon: '⚽',
    color: IZKI_COLORS.primary,
  },
  {
    name: 'U-13 Academy',
    nameAr: 'أكاديمية تحت 13',
    category: 'Academy',
    categoryAr: 'الأكاديمية',
    players: 30,
    coach: 'Khalid Al-Siyabi',
    description: 'Building fundamentals and passion for football in young talents.',
    icon: '🌟',
    color: IZKI_COLORS.secondary,
  },
];

// ----------------------------------------------------------------------

export function LocalTeamsSection() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: IZKI_COLORS.lightMaroonBg,
      }}
    >
      <Container maxWidth="lg">
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
              Local Teams
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
              الفرق المحلية
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
              Our club features multiple competitive teams across different age categories,
              each striving for excellence.
            </Typography>
          </Stack>

          {/* Teams Grid */}
          <Grid container spacing={4}>
            {LOCAL_TEAMS.slice(0, 4).map((team, index) => (
              <Grid item xs={12} sm={6} md={3} key={team.name}>
                <Card
                  component={m.div}
                  variants={varFade('inUp')}
                  custom={index * 0.1}
                  sx={{
                    height: '100%',
                    borderRadius: '20px',
                    bgcolor: IZKI_COLORS.background,
                    border: 'none',
                    boxShadow: `0 4px 20px ${IZKI_COLORS.primary}10`,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 40px ${IZKI_COLORS.primary}20`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: team.color,
                    },
                  }}
                >
                  {/* Team Icon Header */}
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: IZKI_COLORS.lightMaroonBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: `2px solid ${IZKI_COLORS.accent}20`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: IZKI_COLORS.background,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${IZKI_COLORS.primary}15`,
                      }}
                    >
                      <Typography sx={{ fontSize: '2.5rem' }}>{team.icon}</Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: IZKI_COLORS.primary,
                          fontFamily: '"Poppins", sans-serif',
                          textAlign: 'center',
                        }}
                      >
                        {team.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: IZKI_COLORS.primary,
                          fontFamily: '"Cairo", sans-serif',
                          direction: 'rtl',
                          textAlign: 'center',
                        }}
                      >
                        {team.nameAr}
                      </Typography>

                      {/* Category Badge */}
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: '12px',
                            bgcolor: `${IZKI_COLORS.accent}20`,
                            border: `1px solid ${IZKI_COLORS.accent}`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: IZKI_COLORS.primary,
                              fontFamily: '"Poppins", sans-serif',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {team.category}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Stats Row */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 3,
                          pt: 1,
                          borderTop: `1px solid ${IZKI_COLORS.lightMaroonBg}`,
                        }}
                      >
                        <Stack alignItems="center">
                          <Typography
                            sx={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: IZKI_COLORS.primary,
                            }}
                          >
                            {team.players}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.7rem',
                              color: IZKI_COLORS.text.secondary,
                              textTransform: 'uppercase',
                            }}
                          >
                            Players
                          </Typography>
                        </Stack>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: IZKI_COLORS.text.secondary,
                          fontFamily: '"Poppins", sans-serif',
                          lineHeight: 1.6,
                          textAlign: 'center',
                        }}
                      >
                        {team.description}
                      </Typography>

                      <Button
                        fullWidth
                        sx={{
                          mt: 1,
                          py: 1,
                          color: IZKI_COLORS.background,
                          bgcolor: IZKI_COLORS.primary,
                          fontWeight: 600,
                          fontFamily: '"Poppins", sans-serif',
                          borderRadius: '10px',
                          '&:hover': {
                            bgcolor: IZKI_COLORS.secondary,
                          },
                        }}
                      >
                        View Squad
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* View All Button */}
          <Stack
            component={m.div}
            variants={varFade('inUp')}
            alignItems="center"
            sx={{ mt: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(paths.public.localTeams)}
              sx={{
                px: 5,
                py: 1.5,
                bgcolor: IZKI_COLORS.primary,
                color: IZKI_COLORS.text.light,
                fontWeight: 700,
                fontFamily: '"Poppins", sans-serif',
                borderRadius: '12px',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: IZKI_COLORS.secondary,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              View All Teams →
            </Button>
          </Stack>
        </MotionViewport>
      </Container>
    </Box>
  );
}

