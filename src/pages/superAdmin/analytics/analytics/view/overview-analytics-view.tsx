import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { useTranslation } from 'react-i18next';
// import { useGetAnalytics } from 'src/actions/analytics';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
 
  
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {"Welcome"} 👋
      </Typography>
      <div>Overview Analytics View</div>
    
      {/* )} */}
    </DashboardContent>
  );
}