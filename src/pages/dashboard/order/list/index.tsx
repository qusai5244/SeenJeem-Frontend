import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
// ----------------------------------------------------------------------

const metadata = { title: `Vehicles - ${CONFIG.appName}` };

export default function UnitsIndex() {  // Change here: export default
  const { t } = useTranslation();

return (    
  <DashboardContent>
    <CustomBreadcrumbs
      heading={t('Vehicles Page')}
      links={[
        { name: t('Dashboard'), href: paths.dashboard.root },
        { name: t('Vehicles') },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }}

    />
    {/* <VehicleListPage /> */}
  </DashboardContent>
);
}
