import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';
import DriverListPage from 'src/pages/dashboard/driver/list';
import VehicleListPage from 'src/pages/dashboard/vehicle/list';
import OrderListPage from 'src/pages/dashboard/order/list';
import ReportsListPage from 'src/pages/dashboard/reports/list';



// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard/analytics'));

// ----------------------------------------------------------------------
 
function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
     
      {
        path: 'driver',
        children: [
          { path: 'list', element: <DriverListPage /> },
        ]
      },
      {
        path: 'vehicle',
        children: [
          { path: 'list', element: <VehicleListPage /> },
        ]
      },
      {
        path: 'order',
        children: [
          { path: 'list', element: <OrderListPage /> },
        ]
      },
      {
        path: 'reports',
        children: [
          { path: 'list', element: <ReportsListPage /> },
        ]
      },
    ],
  },
];
