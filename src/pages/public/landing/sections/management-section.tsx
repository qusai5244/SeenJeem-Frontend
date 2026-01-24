import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { m } from 'framer-motion';
import { keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const MANAGEMENT_TEAM = [
  {
    name: 'Mohammed Al-Izki',
    nameAr: 'محمد الإزكي',
    position: 'President',
    positionAr: 'رئيس النادي',
    image: '',
  },
  {
    name: 'Ahmed Al-Rashdi',
    nameAr: 'أحمد الراشدي',
    position: 'Vice President',
    positionAr: 'نائب الرئيس',
    image: '',
  },
  {
    name: 'Khalid Al-Habsi',
    nameAr: 'خالد الحبسي',
    position: 'Secretary General',
    positionAr: 'الأمين العام',
    image: '',
  },
  {
    name: 'Salem Al-Saidi',
    nameAr: 'سالم السعيدي',
    position: 'Treasurer',
    positionAr: 'أمين الصندوق',
    image: '',
  },
  {
    name: 'Yusuf Al-Balushi',
    nameAr: 'يوسف البلوشي',
    position: 'Technical Director',
    positionAr: 'المدير الفني',
    image: '',
  },
  {
    name: 'Hassan Al-Kindi',
    nameAr: 'حسن الكندي',
    position: 'Youth Development',
    positionAr: 'مدير تطوير الناشئين',
    image: '',
  },
];

// Scroll animation keyframes
const scrollAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// ----------------------------------------------------------------------

// Card width calculation: Show 4 cards at a time
// Container max-width ~1200px, gap 24px, so (1200 - 3*24) / 4 ≈ 282px
const CARD_WIDTH = 280;
const CARD_GAP = 24;

function MemberCard({ member }: { member: typeof MANAGEMENT_TEAM[0] }) {
  return (
    <Card
      sx={{
        width: CARD_WIDTH,
        minWidth: CARD_WIDTH,
        flexShrink: 0,
        borderRadius: '20px',
        bgcolor: IZKI_COLORS.background,
        boxShadow: `0 4px 24px ${IZKI_COLORS.primary}10`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 16px 40px ${IZKI_COLORS.primary}20`,
          '& .member-image': {
            transform: 'scale(1.05)',
          },
          '& .position-badge': {
            bgcolor: IZKI_COLORS.primary,
          },
        },
      }}
    >
      {/* Member Image */}
      <Box
        sx={{
          position: 'relative',
          height: 220,
          overflow: 'hidden',
          bgcolor: IZKI_COLORS.lightMaroonBg,
        }}
      >
        {member.image ? (
          <Box
            component="img"
            className="member-image"
            src={member.image}
            alt={member.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
        ) : (
          <Box
            className="member-image"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
              background: `linear-gradient(135deg, ${IZKI_COLORS.lightMaroonBg} 0%, ${IZKI_COLORS.background} 100%)`,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: `${IZKI_COLORS.primary}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: '2.5rem', opacity: 0.5 }}>👤</Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.7rem',
                color: IZKI_COLORS.text.secondary,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Photo Coming Soon
            </Typography>
          </Box>
        )}

        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: `linear-gradient(180deg, transparent 0%, ${IZKI_COLORS.background} 100%)`,
          }}
        />
      </Box>

      {/* Member Info */}
      <Box sx={{ p: 2.5, pt: 0, mt: -3, position: 'relative', zIndex: 1 }}>
        {/* Position Badge */}
        <Box
          className="position-badge"
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            borderRadius: '16px',
            bgcolor: IZKI_COLORS.accent,
            mb: 1.5,
            transition: 'all 0.3s ease',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: IZKI_COLORS.darkBg,
              fontFamily: '"Poppins", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {member.position}
          </Typography>
        </Box>

        {/* Name */}
        <Typography
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: IZKI_COLORS.primary,
            fontFamily: '"Poppins", sans-serif',
            mb: 0.25,
          }}
        >
          {member.name}
        </Typography>

      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function ManagementSection() {
  const navigate = useNavigate();
  // Duplicate the team for seamless infinite scroll
  const duplicatedTeam = [...MANAGEMENT_TEAM, ...MANAGEMENT_TEAM];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: IZKI_COLORS.background,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: `linear-gradient(180deg, ${IZKI_COLORS.lightMaroonBg} 0%, ${IZKI_COLORS.background} 100%)`,
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
                color: IZKI_COLORS.primary,
                fontFamily: '"Poppins", sans-serif',
                textAlign: 'center',
              }}
            >
              Club Management
            </Typography>


            <Typography
              component={m.p}
              variants={varFade('inUp')}
              sx={{
                fontSize: '1.125rem',
                color: IZKI_COLORS.text.secondary,
                fontFamily: '"Poppins", sans-serif',
                textAlign: 'center',
                maxWidth: 600,
              }}
            >
              Meet the dedicated team leading Izki Club towards excellence
            </Typography>
          </Stack>
        </MotionViewport>
      </Container>

      {/* Scrolling Cards Container - Shows 4 cards at a time */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: CARD_WIDTH * 4 + CARD_GAP * 3, // 4 cards + 3 gaps
          mx: 'auto',
          overflow: 'hidden',
          py: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 60,
            height: '100%',
            background: `linear-gradient(90deg, ${IZKI_COLORS.background} 0%, transparent 100%)`,
            zIndex: 2,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 60,
            height: '100%',
            background: `linear-gradient(90deg, transparent 0%, ${IZKI_COLORS.background} 100%)`,
            zIndex: 2,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            animation: `${scrollAnimation} 25s linear infinite`,
            width: 'fit-content',
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        >
          {duplicatedTeam.map((member, index) => (
            <MemberCard key={`${member.name}-${index}`} member={member} />
          ))}
        </Box>
      </Box>

      {/* View More Button */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack alignItems="center" sx={{ mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(paths.public.management)}
            sx={{
              color: IZKI_COLORS.primary,
              borderColor: IZKI_COLORS.primary,
              borderWidth: 2,
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontFamily: '"Poppins", sans-serif',
              fontSize: '1rem',
              '&:hover': {
                bgcolor: IZKI_COLORS.primary,
                color: IZKI_COLORS.background,
                borderColor: IZKI_COLORS.primary,
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${IZKI_COLORS.primary}30`,
              },
              transition: 'all 0.3s ease',
            }}
          >
            View More Details
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
