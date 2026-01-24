import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { m } from 'framer-motion';

import { varFade, MotionViewport } from 'src/components/animate';
import { IZKI_COLORS, IZKI_GRADIENTS } from '../landing/brand-constants';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Local Teams - Izki Club | الفرق المحلية - نادي إزكي',
  description: 'Explore all local teams of Izki Club across different age categories.',
};

// ----------------------------------------------------------------------

const LOCAL_TEAMS = [
  {
    id: 'first-team',
    name: 'First Team',
    nameAr: 'الفريق الأول',
    category: 'Senior Division',
    categoryAr: 'فئة الكبار',
    players: 25,
    coach: 'Mohammed Al-Rashidi',
    coachAr: 'محمد الراشدي',
    assistantCoach: 'Yusuf Al-Amri',
    founded: '2022',
    homeGround: 'Izki Stadium',
    description: 'Our flagship senior team competing in the top regional leagues. The team consists of the most skilled and experienced players in the club.',
    descriptionAr: 'فريقنا الأول الرئيسي الذي يشارك في أعلى المسابقات الإقليمية. يضم الفريق أكثر اللاعبين مهارة وخبرة في النادي.',
    achievements: ['Regional League Champions 2023', 'Cup Semi-Finalists 2024', 'Community Shield Winners 2023'],
    icon: '🏆',
    color: IZKI_COLORS.primary,
    stats: { wins: 18, draws: 6, losses: 4, goalsFor: 52, goalsAgainst: 22 },
  },
  {
    id: 'u21-team',
    name: 'U-21 Team',
    nameAr: 'فريق تحت 21',
    category: 'Youth Division',
    categoryAr: 'فئة الشباب',
    players: 22,
    coach: 'Ahmed Al-Balushi',
    coachAr: 'أحمد البلوشي',
    assistantCoach: 'Salem Al-Kindi',
    founded: '2022',
    homeGround: 'Izki Training Ground',
    description: 'Talented young players preparing for senior football excellence. This team bridges the gap between youth and senior football.',
    descriptionAr: 'لاعبون شباب موهوبون يستعدون للتميز في كرة القدم للكبار. يمثل هذا الفريق الجسر بين كرة القدم الشبابية وكرة القدم للكبار.',
    achievements: ['Youth League Runners-up 2024', 'Best Youth Development Program 2023'],
    icon: '⚡',
    color: IZKI_COLORS.secondary,
    stats: { wins: 14, draws: 5, losses: 3, goalsFor: 42, goalsAgainst: 18 },
  },
  {
    id: 'u17-team',
    name: 'U-17 Team',
    nameAr: 'فريق تحت 17',
    category: 'Junior Division',
    categoryAr: 'فئة الناشئين',
    players: 24,
    coach: 'Salim Al-Habsi',
    coachAr: 'سالم الحبسي',
    assistantCoach: 'Nasser Al-Riyami',
    founded: '2022',
    homeGround: 'Izki Training Ground',
    description: 'Developing future stars with professional training programs. Focus on technical skills, tactical awareness, and physical development.',
    descriptionAr: 'تطوير نجوم المستقبل من خلال برامج تدريب احترافية. التركيز على المهارات الفنية والوعي التكتيكي والتطور البدني.',
    achievements: ['Junior Championship Winners 2024', 'Fair Play Award 2023'],
    icon: '⚽',
    color: IZKI_COLORS.primary,
    stats: { wins: 16, draws: 4, losses: 2, goalsFor: 48, goalsAgainst: 15 },
  },
  {
    id: 'u13-academy',
    name: 'U-13 Academy',
    nameAr: 'أكاديمية تحت 13',
    category: 'Academy',
    categoryAr: 'الأكاديمية',
    players: 30,
    coach: 'Khalid Al-Siyabi',
    coachAr: 'خالد السيابي',
    assistantCoach: 'Hamad Al-Busaidi',
    founded: '2023',
    homeGround: 'Izki Academy Fields',
    description: 'Building fundamentals and passion for football in young talents. Our academy focuses on fun, skill development, and love for the game.',
    descriptionAr: 'بناء الأساسيات والشغف بكرة القدم لدى المواهب الشابة. تركز أكاديميتنا على المتعة وتنمية المهارات وحب اللعبة.',
    achievements: ['Academy Tournament Winners 2024', 'Most Promising Academy 2024'],
    icon: '🌟',
    color: IZKI_COLORS.secondary,
    stats: { wins: 12, draws: 6, losses: 2, goalsFor: 38, goalsAgainst: 12 },
  },
  {
    id: 'womens-team',
    name: "Women's Team",
    nameAr: 'فريق السيدات',
    category: "Women's Division",
    categoryAr: 'قسم السيدات',
    players: 20,
    coach: 'Fatima Al-Harthi',
    coachAr: 'فاطمة الحارثي',
    assistantCoach: 'Maryam Al-Rashdi',
    founded: '2024',
    homeGround: 'Izki Stadium',
    description: "Newly established women's team promoting football among women in the community. Breaking barriers and inspiring the next generation.",
    descriptionAr: 'فريق نسائي تأسس حديثاً لتعزيز كرة القدم بين النساء في المجتمع. كسر الحواجز وإلهام الجيل القادم.',
    achievements: ['Inaugural Season 2024'],
    icon: '💪',
    color: IZKI_COLORS.accent,
    stats: { wins: 5, draws: 2, losses: 1, goalsFor: 15, goalsAgainst: 6 },
  },
  {
    id: 'futsal-team',
    name: 'Futsal Team',
    nameAr: 'فريق كرة الصالات',
    category: 'Indoor Football',
    categoryAr: 'كرة القدم الداخلية',
    players: 14,
    coach: 'Ali Al-Balushi',
    coachAr: 'علي البلوشي',
    assistantCoach: 'Rashid Al-Kindi',
    founded: '2023',
    homeGround: 'Izki Sports Hall',
    description: 'Fast-paced indoor football team competing in regional futsal leagues. Quick feet, quick thinking, and spectacular goals.',
    descriptionAr: 'فريق كرة قدم داخلية سريع الوتيرة يشارك في دوريات كرة الصالات الإقليمية. أقدام سريعة وتفكير سريع وأهداف مذهلة.',
    achievements: ['Futsal Cup Semi-Finalists 2024'],
    icon: '🏃',
    color: IZKI_COLORS.primary,
    stats: { wins: 10, draws: 3, losses: 3, goalsFor: 45, goalsAgainst: 20 },
  },
];

// ----------------------------------------------------------------------

export default function LocalTeamsPage() {
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
            background: 'radial-gradient(circle at 80% 20%, rgba(194, 177, 120, 0.15) 0%, transparent 50%)',
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
              ⚽
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
              Local Teams
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
              الفرق المحلية
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.125rem',
                maxWidth: 600,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Discover our competitive teams across all age categories, each dedicated to excellence and representing Izki with pride.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Teams Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: IZKI_COLORS.background }}>
        <Container maxWidth="lg">
          <MotionViewport>
            <Grid container spacing={4}>
              {LOCAL_TEAMS.map((team, index) => (
                <Grid item xs={12} md={6} key={team.id}>
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
                        borderColor: team.color,
                      },
                    }}
                  >
                    {/* Team Header */}
                    <Box
                      sx={{
                        background: IZKI_GRADIENTS.maroon,
                        px: 3,
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '16px',
                            bgcolor: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: '2rem' }}>{team.icon}</Typography>
                        </Box>
                        <Stack spacing={0.5}>
                          <Typography
                            sx={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: IZKI_COLORS.text.light,
                              fontFamily: '"Poppins", sans-serif',
                            }}
                          >
                            {team.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: IZKI_COLORS.accent,
                              fontFamily: '"Cairo", sans-serif',
                              direction: 'rtl',
                            }}
                          >
                            {team.nameAr}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Chip
                        label={team.category}
                        sx={{
                          bgcolor: IZKI_COLORS.accent,
                          color: IZKI_COLORS.primary,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          letterSpacing: '0.03em',
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        {/* Description */}
                        <Typography
                          sx={{
                            fontSize: '0.95rem',
                            color: IZKI_COLORS.text.secondary,
                            fontFamily: '"Poppins", sans-serif',
                            lineHeight: 1.7,
                          }}
                        >
                          {team.description}
                        </Typography>

                        {/* Coach Info */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: '12px',
                            bgcolor: IZKI_COLORS.lightMaroonBg,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: IZKI_COLORS.primary,
                              fontWeight: 700,
                            }}
                          >
                            {team.coach.charAt(0)}
                          </Avatar>
                          <Stack>
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                              }}
                            >
                              Head Coach
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: IZKI_COLORS.primary,
                              }}
                            >
                              {team.coach}
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

                          <Box sx={{ width: 1, bgcolor: `${IZKI_COLORS.accent}30` }} />

                          <Stack alignItems="center" sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: '#4CAF50',
                              }}
                            >
                              {team.stats.wins}
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

                          <Box sx={{ width: 1, bgcolor: `${IZKI_COLORS.accent}30` }} />

                          <Stack alignItems="center" sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: IZKI_COLORS.accent,
                              }}
                            >
                              {team.stats.goalsFor}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: IZKI_COLORS.text.secondary,
                                textTransform: 'uppercase',
                              }}
                            >
                              Goals
                            </Typography>
                          </Stack>
                        </Box>

                        {/* Achievements */}
                        <Stack spacing={1}>
                          <Typography
                            sx={{
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: IZKI_COLORS.primary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Achievements
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {team.achievements.map((achievement) => (
                              <Chip
                                key={achievement}
                                label={achievement}
                                size="small"
                                sx={{
                                  bgcolor: `${IZKI_COLORS.accent}20`,
                                  color: IZKI_COLORS.primary,
                                  fontWeight: 500,
                                  fontSize: '0.7rem',
                                  border: `1px solid ${IZKI_COLORS.accent}40`,
                                }}
                              />
                            ))}
                          </Stack>
                        </Stack>

                        {/* Action Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 1,
                            py: 1.5,
                            bgcolor: team.color,
                            color: IZKI_COLORS.text.light,
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif',
                            borderRadius: '12px',
                            '&:hover': {
                              bgcolor: IZKI_COLORS.secondary,
                            },
                          }}
                        >
                          View Full Squad
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
    </>
  );
}


