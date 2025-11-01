import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { ForbiddenIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function View403() {
  return (
    <SimpleLayout>
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 5
          }}
        >
          <Typography variant="h3" sx={{ mb: 2 }}>
            No Permission
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 4 }}>
            You don&apos;t have permission to access this page.
            Please contact your administrator.
          </Typography>

          <ForbiddenIllustration sx={{ my: 4, height: 240 }} />

          <Button 
            component={RouterLink} 
            href="/" 
            size="large" 
            variant="contained"
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </SimpleLayout>
  );
}
