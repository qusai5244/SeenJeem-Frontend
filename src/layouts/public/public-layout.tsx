import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import { Helmet } from 'react-helmet-async';

import { MotionLazy } from 'src/components/animate/motion-lazy';

import { HeaderSection } from 'src/pages/public/landing/sections/header-section';
import { FooterSection } from 'src/pages/public/landing/sections/footer-section';

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
};

export function PublicLayout({ children }: Props) {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <MotionLazy>
        <Box
          sx={{
            overflow: 'hidden',
            '& *': {
              fontFamily: '"Poppins", "Cairo", sans-serif',
            },
            scrollBehavior: 'smooth',
          }}
        >
          <HeaderSection />
          
          <Box component="main">
            {children || <Outlet />}
          </Box>
          
          <FooterSection />
        </Box>
      </MotionLazy>
    </>
  );
}




