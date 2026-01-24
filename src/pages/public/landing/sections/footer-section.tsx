import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { m } from 'framer-motion';

import { IZKI_COLORS } from '../brand-constants';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const SOCIAL_LINKS = [
  { icon: '𝕏', label: 'Twitter' },
  { icon: '📘', label: 'Facebook' },
  { icon: '📸', label: 'Instagram' },
  { icon: '📺', label: 'YouTube' },
];

// ----------------------------------------------------------------------

export function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: IZKI_COLORS.darkBg,
      }}
    >
      <Container maxWidth="lg">
        <MotionViewport>
          {/* Follow Us Section */}
          <Stack
            component={m.div}
            variants={varFade('inUp')}
            spacing={3}
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: IZKI_COLORS.accent,
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Follow Us
            </Typography>

            <Stack direction="row" spacing={2}>
              {SOCIAL_LINKS.map((social) => (
                <IconButton
                  key={social.label}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: `${IZKI_COLORS.background}10`,
                    color: IZKI_COLORS.accent,
                    fontSize: '1.25rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: IZKI_COLORS.primary,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>

          {/* Copyright */}
          <Box
            component={m.div}
            variants={varFade('inUp')}
            sx={{
              mt: 4,
              pt: 4,
              borderTop: `1px solid ${IZKI_COLORS.background}20`,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: `${IZKI_COLORS.background}60`,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              © 2026 Izki Club. All rights reserved.
            </Typography>
          </Box>
        </MotionViewport>
      </Container>
    </Box>
  );
}

