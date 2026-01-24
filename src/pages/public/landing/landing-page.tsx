import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';

import {
  HeroSection,
  AboutSection,
  ManagementSection,
  LocalTeamsSection,
  TournamentsSection,
  NewsSection,
  PlayersSection,
  SponsorsSection,
} from './sections';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Izki Club - نادي إزكي الرياضي | Pride of the Community',
  description:
    'Izki Club is a competitive sports club committed to developing youth, excellence, and teamwork. Founded in 2022, representing Izki with pride in national competitions.',
};

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <Box id="hero">
        <HeroSection />
      </Box>
      
      <Box id="about">
        <AboutSection />
      </Box>
      
      <Box id="management">
        <ManagementSection />
      </Box>
      
      <Box id="local-teams">
        <LocalTeamsSection />
      </Box>
      
      <Box id="tournaments">
        <TournamentsSection />
      </Box>
      
      <Box id="news">
        <NewsSection />
      </Box>
      
      <Box id="players">
        <PlayersSection />
      </Box>
      
      <Box id="sponsors">
        <SponsorsSection />
      </Box>
    </>
  );
}
