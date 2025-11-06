import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import DriverReportsPage from './driverReportsPage';
// ----------------------------------------------------------------------

const metadata = { title: `Reports - ${CONFIG.appName}` };

export default function ReportsListPage() {
  const { t } = useTranslation();

  return (    
    <DashboardContent>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <CustomBreadcrumbs
        heading={t('Driver Reportsss')}
        links={[
          { name: t('Dashboard'), href: paths.dashboard.root },
          { name: t('Reports') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DriverReportsPage />
    </DashboardContent>
  );
}
