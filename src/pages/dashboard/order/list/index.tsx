import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import OrderListPage from './orderListPage';

// ----------------------------------------------------------------------

const metadata = { title: `Orders - ${CONFIG.appName}` };

export default function OrdersIndex({driverId, date}: {driverId?: number, date?: string}) {
  const { t } = useTranslation();

  return (    
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('Orders Management')}
          links={[
            { name: t('Dashboard'), href: paths.dashboard.root },
            { name: t('Orders') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <OrderListPage driverId={driverId} date={date} />
      </DashboardContent>
    </>
  );
}
