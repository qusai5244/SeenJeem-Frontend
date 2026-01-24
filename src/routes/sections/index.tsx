import type { RouteObject } from 'react-router';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { publicRoutes } from './public';
import { dashboardRoutes } from './dashboard';
import { superAdminRoutes } from './superadmin';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export const routesSection: RouteObject[] = [
  // Public routes (no auth required)
  ...publicRoutes,

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
