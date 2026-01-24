import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { m } from 'framer-motion';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const NEWS_ITEMS = [
  {
    type: 'match',
    title: 'دوري تحت 17 سنة',
    titleEn: 'U-17 League Match',
    date: 'Friday - 12:00 PM',
    season: '2025-2026 Season',
    icon: '🏟️',
  },
  {
    type: 'announcement',
    title: 'بداية الموسم الجديد',
    titleEn: 'New Season Begins',
    date: 'Registration Open',
    season: 'January 2026',
    icon: '📢',
  },
  {
    type: 'achievement',
    title: 'إنجاز اللاعبين',
    titleEn: 'Player Achievement',
    date: 'MVP Award',
    season: 'Ahmed Al-Izki',
    icon: '🏅',
  },
];

// ----------------------------------------------------------------------

export function NewsSection() {
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
              Latest News & Matches
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
              آخر الأخبار والمباريات
            </Typography>
          </Stack>

          {/* News Grid */}
          <Grid container spacing={4}>
            {NEWS_ITEMS.map((item, index) => (
              <Grid item xs={12} md={4} key={item.titleEn}>
                <Card
                  component={m.div}
                  variants={varFade('inUp')}
                  custom={index * 0.15}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: '16px',
                    bgcolor: IZKI_COLORS.background,
                    border: `2px solid ${IZKI_COLORS.primary}20`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: IZKI_COLORS.primary,
                      borderColor: IZKI_COLORS.primary,
                      transform: 'translateY(-4px)',
                      '& .news-title, & .news-date, & .news-season': {
                        color: IZKI_COLORS.background,
                      },
                      '& .news-icon-box': {
                        bgcolor: `${IZKI_COLORS.background}20`,
                      },
                    },
                  }}
                >
                  <Stack spacing={3}>
                    <Box
                      className="news-icon-box"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '12px',
                        bgcolor: IZKI_COLORS.lightMaroonBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography sx={{ fontSize: '1.75rem' }}>{item.icon}</Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Typography
                        className="news-title"
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: IZKI_COLORS.primary,
                          fontFamily: '"Cairo", sans-serif',
                          direction: 'rtl',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        className="news-title"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: IZKI_COLORS.text.secondary,
                          fontFamily: '"Poppins", sans-serif',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.titleEn}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: IZKI_COLORS.accent,
                        }}
                      />
                      <Typography
                        className="news-date"
                        sx={{
                          fontSize: '0.875rem',
                          color: IZKI_COLORS.accent,
                          fontWeight: 600,
                          fontFamily: '"Poppins", sans-serif',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.date}
                      </Typography>
                    </Box>

                    <Typography
                      className="news-season"
                      sx={{
                        fontSize: '0.875rem',
                        color: IZKI_COLORS.text.secondary,
                        fontFamily: '"Poppins", sans-serif',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {item.season}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MotionViewport>
      </Container>
    </Box>
  );
}

