import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { SplashScreen } from 'src/components/loading-screen';
import { PublicLayout } from 'src/layouts/public';

// ----------------------------------------------------------------------

const LandingPage = lazy(() => import('src/pages/public/landing'));
const ContactPage = lazy(() => import('src/pages/public/contact'));
const ManagementPage = lazy(() => import('src/pages/public/management'));
const LocalTeamsPage = lazy(() => import('src/pages/public/local-teams'));
const TournamentsPage = lazy(() => import('src/pages/public/tournaments'));

// ----------------------------------------------------------------------

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'contact-us', element: <ContactPage /> },
      { path: 'management', element: <ManagementPage /> },
      { path: 'local-teams', element: <LocalTeamsPage /> },
      { path: 'tournaments', element: <TournamentsPage /> },
    ],
  },
];

