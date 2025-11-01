import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OverviewAnalyticsViewSuperAdmin } from './analytics/view/overview-analytics-view-superAdmin';


// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewAnalyticsViewSuperAdmin />
    </>
  );
}
