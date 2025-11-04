import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

// import DashboardAnalyticsPage from './analytics/view/overview-analytics-view';
import { getDecodedToken } from 'src/auth/guard/guest-guard';
import AnalyticsPage from './analyticsPage';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const token = getDecodedToken();
  console.log("token");
  console.log(token);
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('Analytics')}
          links={[
            { name: t('Dashboard'), href: paths.dashboard.root },
            { name: t('Analytics') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <AnalyticsPage />
      </DashboardContent>
    </>
  );
}
