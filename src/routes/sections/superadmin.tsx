import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { SuperAdminLayout } from 'src/layouts/superAdmin';

import { LoadingScreen } from 'src/components/loading-screen';


import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/superAdmin/analytics/superAdminIndex'));
// Organization
// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const superAdminLayout = () => (
  <SuperAdminLayout>
    <SuspenseOutlet />
  </SuperAdminLayout>
);

export const superAdminRoutes: RouteObject[] = [
  {
    path: 'superadmin',
    element: CONFIG.auth.skip ? superAdminLayout() : <AuthGuard>{superAdminLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
    ],
  },
];
