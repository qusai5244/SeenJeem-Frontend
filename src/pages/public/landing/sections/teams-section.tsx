import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { m } from 'framer-motion';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const TEAMS = [
  {
    name: 'First Team',
    nameAr: 'الفريق الأول',
    ageGroup: 'Seniors (18+)',
    description: 'Our flagship team competing at the highest level of regional football.',
    icon: '🏆',
  },
  {
    name: 'U-17 Team',
    nameAr: 'فريق تحت 17',
    ageGroup: 'Under 17',
    description: 'Developing future stars with professional training and competitive matches.',
    icon: '⚽',
  },
  {
    name: 'Youth Academy',
    nameAr: 'أكاديمية الناشئين',
    ageGroup: 'Ages 8-14',
    description: 'Building fundamentals and passion for football in young players.',
    icon: '🌟',
  },
];

// ----------------------------------------------------------------------

export function TeamsSection() {
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
              Teams & Categories
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
              الفرق والفئات
            </Typography>
          </Stack>

          {/* Teams Grid */}
          <Grid container spacing={4}>
            {TEAMS.map((team, index) => (
              <Grid item xs={12} md={4} key={team.name}>
                <Card
                  component={m.div}
                  variants={varFade('inUp')}
                  custom={index * 0.15}
                  sx={{
                    height: '100%',
                    borderRadius: '20px',
                    bgcolor: IZKI_COLORS.background,
                    border: 'none',
                    boxShadow: `0 4px 20px ${IZKI_COLORS.primary}10`,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 40px ${IZKI_COLORS.primary}20`,
                    },
                  }}
                >
                  {/* Team Image Placeholder */}
                  <Box
                    sx={{
                      height: 180,
                      bgcolor: IZKI_COLORS.lightMaroonBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: `3px solid ${IZKI_COLORS.accent}`,
                    }}
                  >
                    <Typography sx={{ fontSize: '4rem' }}>{team.icon}</Typography>
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: IZKI_COLORS.primary,
                          fontFamily: '"Poppins", sans-serif',
                        }}
                      >
                        {team.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: IZKI_COLORS.primary,
                          fontFamily: '"Cairo", sans-serif',
                          direction: 'rtl',
                        }}
                      >
                        {team.nameAr}
                      </Typography>

                      {/* Gold underline */}
                      <Box
                        sx={{
                          width: 60,
                          height: 3,
                          bgcolor: IZKI_COLORS.accent,
                          borderRadius: 2,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: IZKI_COLORS.accent,
                          fontFamily: '"Poppins", sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {team.ageGroup}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '1rem',
                          color: IZKI_COLORS.text.secondary,
                          fontFamily: '"Poppins", sans-serif',
                          lineHeight: 1.7,
                        }}
                      >
                        {team.description}
                      </Typography>

                      <Button
                        sx={{
                          mt: 2,
                          color: IZKI_COLORS.primary,
                          fontWeight: 600,
                          fontFamily: '"Poppins", sans-serif',
                          justifyContent: 'flex-start',
                          px: 0,
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: IZKI_COLORS.accent,
                          },
                        }}
                      >
                        View Squad →
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MotionViewport>
      </Container>
    </Box>
  );
}

