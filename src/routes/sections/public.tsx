import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { SplashScreen } from 'src/components/loading-screen';
import { PublicLayout } from 'src/layouts/public';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/public/home'));
const NewGamePage = lazy(() => import('src/pages/public/new-game'));
const GamePage = lazy(() => import('src/pages/public/game'));
const RulesPage = lazy(() => import('src/pages/public/rules'));
const AddQuestionPage = lazy(() => import('src/pages/public/add-question'));

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
      { index: true, element: <HomePage /> },
      { path: 'new-game', element: <NewGamePage /> },
      { path: 'rules', element: <RulesPage /> },
      { path: 'add-question', element: <AddQuestionPage /> },
      { path: 'game/:gameCode', element: <GamePage /> },
    ],
  },
];
