import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';


import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';
import { superAdminRoutes } from './superadmin';

import { AuthGuard } from 'src/auth/guard';

import { Navigate } from "react-router";

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
// const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    /**
     * @skip homepage
     * import { Navigate } from "react-router";
     * import { CONFIG } from 'src/global-config';
     *
     * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
     * and remove the element below:
     */
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Navigate to={paths.auth.jwt.signIn} />
        {/* <MainLayout>
          <HomePage />
        </MainLayout> */}
      </Suspense>
    ),
  },

  // Auth
  ...authRoutes,
  // ...authDemoRoutes,

  // Dashboard
  ...dashboardRoutes.map(route => ({
    ...route,
    element: (
      <AuthGuard>
        {route.element}
      </AuthGuard>
    ),
  })),

  ...superAdminRoutes.map(route => ({
    ...route,
    element: (
      <AuthGuard>
        {route.element}
      </AuthGuard>
    ),
  })),
  //...superAdminRoutes,
  // Main
  ...mainRoutes,

  // Components
  // ...componentsRoutes,

  // No match
  // { path: '*', element: <Page404 /> },

];
