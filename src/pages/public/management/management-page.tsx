import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { m } from 'framer-motion';

import { varFade } from 'src/components/animate';

import { IZKI_COLORS, IZKI_GRADIENTS } from '../landing/brand-constants';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Management - Izki Club | نادي إزكي الرياضي',
  description: 'Meet the dedicated management team leading Izki Club towards excellence.',
};

// ----------------------------------------------------------------------

export default function ManagementPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      {/* Main Content - Coming Soon */}
      <Box sx={{ py: 10, bgcolor: IZKI_COLORS.background }}>
        <Container maxWidth="lg">
          <Stack
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade('inUp')}
            spacing={4}
            alignItems="center"
            textAlign="center"
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: IZKI_COLORS.lightMaroonBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
              }}
            >
              👥
            </Box>
            
            <Typography
              variant="h4"
              sx={{
                color: IZKI_COLORS.primary,
                fontWeight: 700,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Coming Soon
            </Typography>
            
            <Typography
              sx={{
                color: IZKI_COLORS.text.secondary,
                fontSize: '1.125rem',
                maxWidth: 500,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              We are working on bringing you detailed information about our management team, 
              including their vision, achievements, and dedication to the club.
            </Typography>

            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 4,
                bgcolor: IZKI_COLORS.lightMaroonBg,
                borderRadius: 2,
                overflow: 'hidden',
                mt: 2,
              }}
            >
              <Box
                sx={{
                  width: '30%',
                  height: '100%',
                  bgcolor: IZKI_COLORS.accent,
                  borderRadius: 2,
                }}
              />
            </Box>
            
            <Typography
              sx={{
                color: IZKI_COLORS.text.secondary,
                fontSize: '0.875rem',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Page under construction
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

