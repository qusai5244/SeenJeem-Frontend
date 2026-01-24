import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { m } from 'framer-motion';

import { varFade, MotionViewport } from 'src/components/animate';
import { IZKI_COLORS, IZKI_GRADIENTS } from '../landing/brand-constants';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Tournaments - Izki Club | البطولات - نادي إزكي',
  description: 'Follow Izki Club journey across all competitions and tournaments.',
};

// ----------------------------------------------------------------------

const TOURNAMENTS = [
  {
    id: 'oman-league',
    name: 'Oman Professional League',
    nameAr: 'دوري عمان المحترفين',
    season: '2024/2025',
    status: 'ongoing',
    position: '5th',
    totalTeams: 14,
    matches: 18,
    wins: 8,
    draws: 4,
    losses: 6,
    goalsFor: 24,
    goalsAgainst: 18,
    points: 28,
    icon: '🏆',
    description: 'The top tier of Omani football competition featuring the best clubs in the nation.',
    descriptionAr: 'الدرجة الأولى من كرة القدم العمانية التي تضم أفضل الأندية في السلطنة.',
    nextMatch: { opponent: 'Al-Seeb', date: 'Jan 15, 2026', venue: 'Home' },
    topScorer: { name: 'Ahmed Al-Kindi', goals: 8 },
  },
  {
    id: 'sultan-cup',
    name: 'Sultan Qaboos Cup',
    nameAr: 'كأس جلالة السلطان',
    season: '2024/2025',
    status: 'upcoming',
    round: 'Round of 16',
    matches: 3,
    wins: 3,
    draws: 0,
    losses: 0,
    goalsFor: 9,
    goalsAgainst: 2,
    icon: '👑',
    description: 'The most prestigious knockout competition in Oman, featuring clubs from all divisions.',
    descriptionAr: 'أعرق بطولة خروج المغلوب في عمان، تضم أندية من جميع الدرجات.',
    nextMatch: { opponent: 'Dhofar SC', date: 'Feb 5, 2026', venue: 'Away' },
    topScorer: { name: 'Salim Al-Habsi', goals: 4 },
  },
  {
    id: 'governorate-championship',
    name: 'Governorate Championship',
    nameAr: 'بطولة المحافظة',
    season: '2024',
    status: 'completed',
    position: 'Champions 🥇',
    totalTeams: 8,
    matches: 10,
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 28,
    goalsAgainst: 8,
    points: 25,
    icon: '🎯',
    description: 'Regional championship representing Ad Dakhiliyah Governorate. We are proud champions!',
    descriptionAr: 'بطولة إقليمية تمثل محافظة الداخلية. نحن أبطال فخورون!',
    topScorer: { name: 'Mohammed Al-Rashidi', goals: 10 },
  },
  {
    id: 'youth-league',
    name: 'Youth Development League',
    nameAr: 'دوري تطوير الشباب',
    season: '2024/2025',
    status: 'ongoing',
    position: '2nd',
    totalTeams: 12,
    matches: 12,
    wins: 9,
    draws: 2,
    losses: 1,
    goalsFor: 32,
    goalsAgainst: 10,
    points: 29,
    icon: '⭐',
    description: 'Competitive league for developing young talent from U-17 and U-21 categories.',
    descriptionAr: 'دوري تنافسي لتطوير المواهب الشابة من فئتي تحت 17 وتحت 21.',
    nextMatch: { opponent: 'Muscat Youth', date: 'Jan 20, 2026', venue: 'Home' },
    topScorer: { name: 'Hamza Al-Busaidi', goals: 11 },
  },
  {
    id: 'friendly-cup',
    name: 'Oman Friendly Cup',
    nameAr: 'كأس عمان الودية',
    season: '2025',
    status: 'upcoming',
    round: 'Group Stage',
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    icon: '🤝',
    description: 'Pre-season friendly tournament to prepare teams for the upcoming season.',
    descriptionAr: 'بطولة ودية قبل الموسم لإعداد الفرق للموسم القادم.',
    nextMatch: { opponent: 'TBD', date: 'Mar 1, 2026', venue: 'TBD' },
  },
  {
    id: 'futsal-league',
    name: 'Oman Futsal League',
    nameAr: 'دوري عمان لكرة الصالات',
    season: '2024/2025',
    status: 'ongoing',
    position: '3rd',
    totalTeams: 10,
    matches: 8,
    wins: 5,
    draws: 2,
    losses: 1,
    goalsFor: 35,
    goalsAgainst: 18,
    points: 17,
    icon: '🏃',
    description: 'Indoor football league featuring fast-paced action and spectacular goals.',
    descriptionAr: 'دوري كرة القدم الداخلية الذي يتميز بالأكشن السريع والأهداف المذهلة.',
    nextMatch: { opponent: 'Sur Futsal', date: 'Jan 18, 2026', venue: 'Home' },
    topScorer: { name: 'Ali Al-Balushi', goals: 12 },
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

export default function TournamentsPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          background: IZKI_GRADIENTS.maroon,
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(194, 177, 120, 0.15) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade('inUp')}
            spacing={3}
            alignItems="center"
            textAlign="center"
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                mb: 2,
              }}
            >
              🏆
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: IZKI_COLORS.text.light,
                fontWeight: 800,
                fontFamily: '"Poppins", sans-serif',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Tournaments
            </Typography>
            <Typography
              sx={{
                color: IZKI_COLORS.accent,
                fontWeight: 700,
                fontFamily: '"Cairo", sans-serif',
                fontSize: { xs: '1.5rem', md: '2rem' },
                direction: 'rtl',
              }}
            >
              البطولات
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.125rem',
                maxWidth: 600,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Follow our journey across multiple competitions as we compete for glory and represent Izki with pride.
            </Typography>

            {/* Quick Stats */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              sx={{
                mt: 4,
                p: 3,
                borderRadius: '16px',
                bgcolor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Stack alignItems="center">
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: IZKI_COLORS.text.light }}>
                  {TOURNAMENTS.length}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: IZKI_COLORS.accent }}>
                  Active Competitions
                </Typography>
              </Stack>
              <Stack alignItems="center">
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#4CAF50' }}>
                  {TOURNAMENTS.reduce((acc, t) => acc + t.wins, 0)}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: IZKI_COLORS.accent }}>
                  Total Wins
                </Typography>
              </Stack>
              <Stack alignItems="center">
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: IZKI_COLORS.accent }}>
                  {TOURNAMENTS.reduce((acc, t) => acc + t.goalsFor, 0)}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: IZKI_COLORS.accent }}>
                  Goals Scored
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Tournaments Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: IZKI_COLORS.background }}>
        <Container maxWidth="lg">
          <MotionViewport>
            <Grid container spacing={4}>
              {TOURNAMENTS.map((tournament, index) => {
                const statusColor = getStatusColor(tournament.status);
                const winRate = tournament.matches > 0 
                  ? Math.round((tournament.wins / tournament.matches) * 100) 
                  : 0;

                return (
                  <Grid item xs={12} lg={6} key={tournament.id}>
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
                          <Stack spacing={0.25}>
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
                                fontSize: '0.85rem',
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

                          {/* Season & Position */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: '12px',
                              bgcolor: IZKI_COLORS.lightMaroonBg,
                            }}
                          >
                            <Stack>
                              <Typography
                                sx={{
                                  fontSize: '0.7rem',
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

                            <Stack alignItems="center">
                              <Typography
                                sx={{
                                  fontSize: '0.7rem',
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

                            {tournament.points !== undefined && (
                              <Stack alignItems="flex-end">
                                <Typography
                                  sx={{
                                    fontSize: '0.7rem',
                                    color: IZKI_COLORS.text.secondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                  }}
                                >
                                  Points
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: IZKI_COLORS.primary,
                                  }}
                                >
                                  {tournament.points}
                                </Typography>
                              </Stack>
                            )}
                          </Box>

                          {/* Match Stats */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              p: 2,
                              borderRadius: '16px',
                              border: `1px solid ${IZKI_COLORS.lightMaroonBg}`,
                            }}
                          >
                            <Stack alignItems="center" sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: IZKI_COLORS.primary }}>
                                {tournament.matches}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase' }}>
                                Played
                              </Typography>
                            </Stack>

                            <Box sx={{ width: 1, bgcolor: `${IZKI_COLORS.accent}30` }} />

                            <Stack alignItems="center" sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#4CAF50' }}>
                                {tournament.wins}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase' }}>
                                Wins
                              </Typography>
                            </Stack>

                            <Box sx={{ width: 1, bgcolor: `${IZKI_COLORS.accent}30` }} />

                            <Stack alignItems="center" sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: IZKI_COLORS.accent }}>
                                {tournament.draws}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase' }}>
                                Draws
                              </Typography>
                            </Stack>

                            <Box sx={{ width: 1, bgcolor: `${IZKI_COLORS.accent}30` }} />

                            <Stack alignItems="center" sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#F44336' }}>
                                {tournament.losses}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase' }}>
                                Losses
                              </Typography>
                            </Stack>
                          </Box>

                          {/* Win Rate Progress */}
                          {tournament.matches > 0 && (
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: IZKI_COLORS.primary }}>
                                  Win Rate
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#4CAF50' }}>
                                  {winRate}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={winRate}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: IZKI_COLORS.lightMaroonBg,
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: '#4CAF50',
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Stack>
                          )}

                          {/* Goals */}
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                flex: 1,
                                p: 2,
                                borderRadius: '12px',
                                bgcolor: '#4CAF5010',
                                border: '1px solid #4CAF5030',
                                textAlign: 'center',
                              }}
                            >
                              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#4CAF50' }}>
                                {tournament.goalsFor}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase' }}>
                                Goals For
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                flex: 1,
                                p: 2,
                                borderRadius: '12px',
                                bgcolor: '#F4433610',
                                border: '1px solid #F4433630',
                                textAlign: 'center',
                              }}
                            >
                              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#F44336' }}>
                                {tournament.goalsAgainst}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase' }}>
                                Goals Against
                              </Typography>
                            </Box>
                          </Box>

                          {/* Next Match & Top Scorer */}
                          {(tournament.nextMatch || tournament.topScorer) && (
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 2,
                              }}
                            >
                              {tournament.nextMatch && tournament.status !== 'completed' && (
                                <Box
                                  sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: '12px',
                                    bgcolor: IZKI_COLORS.lightMaroonBg,
                                  }}
                                >
                                  <Typography sx={{ fontSize: '0.7rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase', mb: 0.5 }}>
                                    Next Match
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: IZKI_COLORS.primary }}>
                                    vs {tournament.nextMatch.opponent}
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: IZKI_COLORS.text.secondary }}>
                                    {tournament.nextMatch.date} • {tournament.nextMatch.venue}
                                  </Typography>
                                </Box>
                              )}
                              {tournament.topScorer && (
                                <Box
                                  sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: '12px',
                                    bgcolor: `${IZKI_COLORS.accent}15`,
                                  }}
                                >
                                  <Typography sx={{ fontSize: '0.7rem', color: IZKI_COLORS.text.secondary, textTransform: 'uppercase', mb: 0.5 }}>
                                    Top Scorer
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: IZKI_COLORS.primary }}>
                                    {tournament.topScorer.name}
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: IZKI_COLORS.accent, fontWeight: 600 }}>
                                    {tournament.topScorer.goals} Goals
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}

                          {/* Action Button */}
                          <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                              mt: 1,
                              py: 1.5,
                              borderColor: IZKI_COLORS.primary,
                              color: IZKI_COLORS.primary,
                              fontWeight: 600,
                              fontFamily: '"Poppins", sans-serif',
                              borderRadius: '12px',
                              '&:hover': {
                                bgcolor: IZKI_COLORS.primary,
                                color: IZKI_COLORS.text.light,
                                borderColor: IZKI_COLORS.primary,
                              },
                            }}
                          >
                            View Full Details
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </MotionViewport>
        </Container>
      </Box>
    </>
  );
}


