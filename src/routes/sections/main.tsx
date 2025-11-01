import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Error
// const Page500 = lazy(() => import('src/pages/error/500'));
// const Page403 = lazy(() => import('src/pages/error/403'));
// const Page404 = lazy(() => import('src/pages/error/404'));
// // Blank
// const BlankPage = lazy(() => import('src/pages/blank'));

// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
      },
      // {
      //   path: 'error',
      //   children: [
      //     { path: '500', element: <Page500 /> },
      //     { path: '404', element: <Page404 /> },
      //     { path: '403', element: <Page403 /> },
      //   ],
      // },
    ],
  },
];
