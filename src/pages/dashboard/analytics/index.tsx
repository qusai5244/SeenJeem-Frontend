import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

// import DashboardAnalyticsPage from './analytics/view/overview-analytics-view';
import { getDecodedToken } from 'src/auth/guard/guest-guard';

// ----------------------------------------------------------------------

const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const token = getDecodedToken();
  console.log("token");
  console.log(token);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <DashboardAnalyticsPage /> */}
      <div>Analytics</div>
    </>
  );
}
