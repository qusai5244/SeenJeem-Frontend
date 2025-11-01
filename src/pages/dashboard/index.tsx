import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

// import DashboardAnalyticsPage  from './analytics/analytics/view/overview-analytics-view';
import { getDecodedToken } from 'src/auth/guard/guest-guard';


// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
    </>
  );
}
